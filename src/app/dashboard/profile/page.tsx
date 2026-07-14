import Link from "next/link";
import { ArrowLeft, CalendarDays, Camera, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
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
    <div className="prof-avatar-container">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={avatarUrl} alt={fullName} className="prof-avatar-img" />
    </div>
  ) : (
    <div className="prof-avatar-fallback">
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
    <div className="prof-stat-card">
      <div className="prof-stat-flex">
        <div>
          <p className="prof-stat-title">{title}</p>
          <p className="prof-stat-value">{value}</p>
        </div>
        <div className="prof-stat-icon-wrapper">
          <Icon className="prof-stat-icon" />
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
    <main className="prof-main-layout">
      <div className="prof-container">
        <div className="prof-sr-only">{username}</div>
        
        {/* Header Section */}
        <div className="prof-header-flex">
          <Link href="/dashboard" className="prof-btn-secondary">
            <ArrowLeft className="prof-icon" />
            Kembali ke Dashboard
          </Link>

          <div>
            <p className="prof-meta-title">Profil</p>
            <h1 className="prof-main-title">Data Pengguna</h1>
            <p className="prof-desc">Kelola informasi akun dan pantau aktivitas pengamatan Anda.</p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="prof-grid-layout">
          
          {/* User Bio Card */}
          <section className="prof-section-card">
            <div className="prof-info-flex">
              <ProfileAvatar fullName={fullName || "Alas Purwo"} />
              <div className="flex-1">
                <h2 className="prof-section-title">{fullName || "Alas Purwo"}</h2>
                <p className="prof-username">@{username || "unknown"}</p>
                <p className="prof-badge-pos">
                  {posPengamatan ? `Pos: ${posPengamatan}` : "Pos Pengamatan: —"}
                </p>
              </div>
            </div>

            {/* Account Details Box */}
            <div className="prof-details-box">
              <div className="prof-detail-row">
                <span className="prof-detail-label">Email</span>
                <span className="prof-detail-value">{email || "—"}</span>
              </div>
              <div className="prof-detail-row">
                <span className="prof-detail-label">Role</span>
                <span className="prof-detail-value">{role || "Petugas"}</span>
              </div>
              <div className="prof-detail-row">
                <span className="prof-detail-label">Tanggal Bergabung</span>
                <span className="prof-detail-value">
                  {createdAt ? createdAt.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="prof-actions-grid">
              <Link href="/dashboard/observations/create" className="prof-btn-primary">
                <PlusCircle className="prof-icon" />
                Tambah Pengamatan
              </Link>
              <Link href="/dashboard/observations" className="prof-btn-outline">
                <Camera className="prof-icon" />
                Lihat Semua Pengamatan
              </Link>
            </div>
          </section>

          {/* Stats Section */}
          <aside className="prof-aside">
            <div className="prof-stats-grid">
              <StatCard title="Total Pengamatan Saya" value={totalPengamatanSaya} icon={CalendarDays} />
              <StatCard title="Pengamatan Hari Ini" value={pengamatanHariIni} icon={CalendarDays} />
              <StatCard title="Upload Foto Saya" value={uploadFotoSaya} icon={Camera} />
            </div>
          </aside>
        </div>

        {/* Recent Observation Table */}
        <section className="prof-table-section">
          <div className="prof-table-header">
            <div>
              <p className="prof-meta-title">Pengamatan Terbaru Saya</p>
              <h2 className="prof-main-title">Maksimal 5 data terbaru</h2>
            </div>
          </div>

          <div className="prof-table-wrapper">
            {recentRows.length === 0 ? (
              /* Table Empty State */
              <div className="prof-empty-state">
                <p className="prof-section-title">Belum ada pengamatan Anda</p>
                <p className="prof-desc">Mulai dengan menambahkan pengamatan pertama Anda.</p>
                <div className="prof-empty-btn">
                  <Link href="/dashboard/observations/create" className="prof-btn-primary">
                    <PlusCircle className="prof-icon" />
                    Tambah Pengamatan
                  </Link>
                </div>
              </div>
            ) : (
              /* Data Table */
              <table className="prof-table">
                <thead className="prof-thead">
                  <tr>
                    <th className="prof-th">Foto</th>
                    <th className="prof-th">Nama Satwa</th>
                    <th className="prof-th">Lokasi</th>
                    <th className="prof-th">Tanggal</th>
                    <th className="prof-th">Shift</th>
                  </tr>
                </thead>
                <tbody className="prof-tbody">
                  {recentRows.map((row) => (
                    <tr key={row._id} className="prof-tr">
                      <td className="prof-td">
                        {row.foto ? (
                          <div className="prof-row-img-container">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={row.foto} alt={row.namaSatwa} className="prof-avatar-img" />
                          </div>
                        ) : (
                          <div className="prof-row-img-placeholder">
                            <span className="text-lg">🐾</span>
                          </div>
                        )}
                      </td>
                      <td className="prof-td-highlight">{row.namaSatwa}</td>
                      <td className="prof-td">{row.lokasi}</td>
                      <td className="prof-td">
                        {row.tanggalPengamatan.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="prof-td">
                        <span className="prof-badge-shift">
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