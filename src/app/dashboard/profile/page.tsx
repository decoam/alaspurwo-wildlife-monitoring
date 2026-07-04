import Link from "next/link";
import { ArrowLeft, CalendarDays, Camera, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/app/lib/mongodb";
import { Observation } from "@/models/Observation";
import { User } from "@/models/User";

export const runtime = "nodejs";

type ProfileAvatarProps = {
  fullName: string;
  avatarUrl?: string;
};

function ProfileAvatar({ fullName, avatarUrl }: ProfileAvatarProps) {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return avatarUrl ? (
    <div className="relative h-14 w-14 overflow-hidden rounded-full border border-emerald-900/60 bg-[#08140e]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
    </div>
  ) : (
    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-900/60 bg-gradient-to-br from-emerald-500 to-lime-600 text-base font-semibold text-white shadow-lg">
      {initials}
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
};

function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-emerald-900/60 bg-[#0c1914]/90 p-4 shadow-[0_20px_60px_rgba(2,8,23,0.18)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-emerald-200/80">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-600 p-2 text-white shadow-lg">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

type RecentObservationRow = {
  _id: string;
  namaSatwa: string;
  lokasi: string;
  tanggalPengamatan: Date;
  shift: "Pagi" | "Sore";
  foto: string;
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();

  const userId = session.user.id;

  const [userDoc, summary, recent] = await Promise.all([
    User.findById(userId).lean(),
    (async () => {
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const [total, today, uploadsToday] = await Promise.all([
        Observation.countDocuments({ createdBy: userId }),
        Observation.countDocuments({
          createdBy: userId,
          tanggalPengamatan: { $gte: startOfDay, $lte: endOfDay },
        }),
        Observation.countDocuments({
          createdBy: userId,
          foto: { $type: "string", $ne: "" },
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        }),
      ]);

      return {
        total,
        today,
        uploadsToday,
      };
    })(),
    Observation.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("namaSatwa lokasi tanggalPengamatan shift foto")
      .lean(),
  ]);

  const fullName = session.user.fullName || userDoc?.fullName || "";
  const username = session.user.username || "";
  const email = session.user.email || "";
  const role = session.user.role || userDoc?.role || "Petugas";
  const posPengamatan = session.user.posPengamatan || (session.user.fullName ? "" : userDoc?.fullName) || "";

  const createdAt = userDoc?.createdAt ? new Date(userDoc.createdAt) : null;

  const totalPengamatanSaya = summary.total;
  const pengamatanHariIni = summary.today;
  const uploadFotoSaya = summary.uploadsToday;

  const recentRows: RecentObservationRow[] = (recent as Array<Record<string, unknown>>).map((item) => {
    return {
      _id: String(item._id),
      namaSatwa: String(item.namaSatwa ?? ""),
      lokasi: String(item.lokasi ?? ""),
      tanggalPengamatan: item.tanggalPengamatan
        ? new Date(item.tanggalPengamatan as string | Date)
        : new Date(),
      shift: item.shift === "Sore" ? "Sore" : "Pagi",
      foto: typeof item.foto === "string" ? item.foto : "",
    };
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,64,38,0.5),_transparent_35%),linear-gradient(135deg,_#07110c_0%,_#0c1914_45%,_#13261d_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-emerald-900/60 bg-[#07110c]/80 p-4 shadow-[0_20px_60px_rgba(2,8,23,0.2)] md:p-6">
        <div className="sr-only">{username}</div>
        <div className="flex flex-col gap-4 border-b border-emerald-900/60 pb-6 md:flex-row md:items-center md:justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 self-start rounded-2xl px-3 py-2 text-sm text-emerald-200 transition hover:bg-emerald-900/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">Profil</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Data Pengguna</h1>
            <p className="mt-2 text-sm text-slate-400">Kelola informasi akun dan pantau aktivitas pengamatan Anda.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[24px] border border-emerald-900/60 bg-[#08140e] p-5">
            <div className="flex items-center gap-4">
              <ProfileAvatar fullName={fullName || "Alas Purwo"} />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">{fullName || "Alas Purwo"}</h2>
                <p className="mt-1 text-sm text-slate-300">@{username || "unknown"}</p>
                <p className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-emerald-900/60 bg-[#0d1d14] px-3 py-2 text-xs font-semibold text-emerald-200">
                  {posPengamatan ? `Pos: ${posPengamatan}` : "Pos Pengamatan: —"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 rounded-[24px] border border-emerald-900/60 bg-[#0c1914]/70 p-4 text-sm text-slate-200">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Email</span>
                <span className="font-medium text-white">{email || "—"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Role</span>
                <span className="font-medium text-white">{role || "Petugas"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Tanggal Bergabung</span>
                <span className="font-medium text-white">
                  {createdAt ? createdAt.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard/observations/create"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                <PlusCircle className="h-4 w-4" />
                Tambah Pengamatan
              </Link>
              <Link
                href="/dashboard/observations"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-900/60 bg-[#10241a] px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-900/40"
              >
                <Camera className="h-4 w-4" />
                Lihat Semua Pengamatan
              </Link>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-1">
              <StatCard title="Total Pengamatan Saya" value={totalPengamatanSaya} icon={CalendarDays} />
              <StatCard title="Pengamatan Hari Ini" value={pengamatanHariIni} icon={CalendarDays} />
              <StatCard title="Upload Foto Saya" value={uploadFotoSaya} icon={Camera} />
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-[24px] border border-emerald-900/60 bg-[#08140e] p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">Pengamatan Terbaru Saya</p>
              <h2 className="mt-2 text-lg font-semibold text-white">Maksimal 5 data terbaru</h2>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            {recentRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-emerald-800/70 bg-[#0c1712] px-5 py-12 text-center">
                <p className="text-sm font-semibold text-white">Belum ada pengamatan Anda</p>
                <p className="mt-2 text-sm text-slate-400">Mulai dengan menambahkan pengamatan pertama Anda.</p>
                <Link
                  href="/dashboard/observations/create"
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  <PlusCircle className="h-4 w-4" />
                  Tambah Pengamatan
                </Link>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-emerald-900/60 text-sm">
                <thead className="bg-emerald-950/50 text-left text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Foto</th>
                    <th className="px-4 py-3 font-medium">Nama Satwa</th>
                    <th className="px-4 py-3 font-medium">Lokasi</th>
                    <th className="px-4 py-3 font-medium">Tanggal</th>
                    <th className="px-4 py-3 font-medium">Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/50 bg-[#0f2218] text-slate-200">
                  {recentRows.map((row) => (
                    <tr key={row._id} className="transition hover:bg-emerald-950/40">
                      <td className="px-4 py-4">
                        {row.foto ? (
                          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-emerald-900/60 bg-[#08140e]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={row.foto} alt={row.namaSatwa} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-900/60 bg-[#08140e]">
                            <span className="text-lg">🐾</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 font-medium text-white">{row.namaSatwa}</td>
                      <td className="px-4 py-4">{row.lokasi}</td>
                      <td className="px-4 py-4">
                        {row.tanggalPengamatan.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full border border-emerald-700/60 bg-emerald-900/60 px-3 py-1 text-xs font-semibold text-emerald-200">
                          {row.shift}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

