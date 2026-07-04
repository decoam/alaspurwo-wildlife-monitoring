import { auth } from "@/auth";
import { connectDB } from "@/app/lib/mongodb";
import { Observation } from "@/models/Observation";
import { revalidatePath } from "next/cache";

export type DashboardStats = {
  totalObservations: number;
  observationsToday: number;
  uniqueSpecies: number;
  uploadsToday: number;
  morningShift: number;
  eveningShift: number;
  weeklyActivity: Array<{ day: string; count: number }>;
  categoryBreakdown: Array<{ name: string; value: number }>;
};

export type RecentObservationItem = {
  _id: string;
  namaSatwa: string;
  lokasi: string;
  tanggalPengamatan: string;
  shift: "Pagi" | "Sore";
  foto: string;
  createdAt: string;
  status: "Terkonfirmasi" | "Tersimpan";
};

export type DashboardUserProfile = {
  name: string;
  email: string;
  fullName: string;
  role: string;
  posPengamatan: string;
  avatarInitials: string;
};

function getDayLabel(date: Date) {
  return ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][date.getDay()];
}

function getDayLabelFromNumber(dayNumber: number) {
  return ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][dayNumber] ?? "Minggu";
}

function buildWeeklyActivity(records: Array<{ _id: number; count: number }>) {
  const counts = new Map<string, number>();
  const today = new Date();

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    counts.set(getDayLabel(date), 0);
  }

  records.forEach((item) => {
    const label = getDayLabelFromNumber(item._id);
    counts.set(label, item.count);
  });

  return Array.from(counts.entries()).map(([day, count]) => ({ day, count }));
}

function buildCategoryBreakdown(records: Array<{ _id: string; count: number }>) {
  return records.map((item) => ({ name: item._id || "Lainnya", value: item.count }));
}

export async function getDashboardData(search = "") {
  await connectDB();

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 6);
  startOfWeek.setHours(0, 0, 0, 0);

  const searchRegex = search.trim();
  const recentFilter = searchRegex
    ? {
        $or: [
          { namaSatwa: { $regex: searchRegex, $options: "i" } },
          { lokasi: { $regex: searchRegex, $options: "i" } },
          { namaPetugas: { $regex: searchRegex, $options: "i" } },
        ],
      }
    : {};

  const [statsResult, recentResult, weeklyResult, categoryResult] = await Promise.all([
    Observation.aggregate([
      {
        $facet: {
          totalObservations: [{ $count: "count" }],
          observationsToday: [{ $match: { tanggalPengamatan: { $gte: startOfDay, $lte: endOfDay } } }, { $count: "count" }],
          uniqueSpecies: [{ $group: { _id: "$namaSatwa" } }, { $count: "count" }],
          uploadsToday: [{ $match: { foto: { $type: "string", $ne: "" }, createdAt: { $gte: startOfDay, $lte: endOfDay } } }, { $count: "count" }],
          morningShift: [{ $match: { shift: "Pagi" } }, { $count: "count" }],
          eveningShift: [{ $match: { shift: "Sore" } }, { $count: "count" }],
        },
      },
    ]),
    Observation.find(recentFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .select("namaSatwa lokasi tanggalPengamatan shift foto createdAt")
      .lean(),
    Observation.aggregate([
      {
        $match: { createdAt: { $gte: startOfWeek, $lte: now } },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Observation.aggregate([
      {
        $group: {
          _id: "$kategori",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]),
  ]);

  const [stats] = statsResult as Array<{
    totalObservations: Array<{ count: number }>;
    observationsToday: Array<{ count: number }>;
    uniqueSpecies: Array<{ count: number }>;
    uploadsToday: Array<{ count: number }>;
    morningShift: Array<{ count: number }>;
    eveningShift: Array<{ count: number }>;
  }>;

  const recentObservations: RecentObservationItem[] = (recentResult as Array<Record<string, unknown>>).map((item) => {
    const createdAt = item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt as string | number);
    const isRecent = Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000;

    return {
      _id: String(item._id),
      namaSatwa: String(item.namaSatwa ?? ""),
      lokasi: String(item.lokasi ?? ""),
      tanggalPengamatan: item.tanggalPengamatan ? new Date(item.tanggalPengamatan as string | Date).toISOString() : "",
      shift: item.shift === "Sore" ? "Sore" : "Pagi",
      foto: typeof item.foto === "string" ? item.foto : "",
      createdAt: createdAt.toISOString(),
      status: isRecent ? "Terkonfirmasi" : "Tersimpan",
    };
  });

  const dashboardStats: DashboardStats = {
    totalObservations: stats.totalObservations[0]?.count ?? 0,
    observationsToday: stats.observationsToday[0]?.count ?? 0,
    uniqueSpecies: stats.uniqueSpecies[0]?.count ?? 0,
    uploadsToday: stats.uploadsToday[0]?.count ?? 0,
    morningShift: stats.morningShift[0]?.count ?? 0,
    eveningShift: stats.eveningShift[0]?.count ?? 0,
    weeklyActivity: buildWeeklyActivity(weeklyResult as Array<{ _id: number; count: number }>),
    categoryBreakdown: buildCategoryBreakdown(categoryResult as Array<{ _id: string; count: number }>),
  };

  const session = await auth();
  const sessionUser = ((session as unknown as { user?: unknown } | null | undefined)?.user ?? undefined) as
    | {
        email?: string;
        posPengamatan?: string;
        fullName?: string;
        role?: string;
        name?: string;
        // next-auth biasanya menyediakan field lain, tapi kita tidak memaksa typedetail di sini
      }
    | undefined;

  const dashboardUser: DashboardUserProfile = {
    name: sessionUser?.name ?? "",
    email: sessionUser?.email ?? "",
    fullName: sessionUser?.fullName ?? sessionUser?.name ?? "",
    role: sessionUser?.role ?? "Petugas",
    posPengamatan: sessionUser?.posPengamatan ?? "",
    avatarInitials: (sessionUser?.fullName ?? sessionUser?.name ?? "AP")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  };

  return {
    stats: dashboardStats,
    recentObservations,
    user: dashboardUser,
  };
}

export async function revalidateDashboard() {
  revalidatePath("/dashboard");
}
