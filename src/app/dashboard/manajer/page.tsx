import {
  Users,
  Eye,
  FileDown,
  CircleAlert,
  Search,
  ShieldCheck,
  Building2,
  MapPin,
  TrendingUp,
} from "lucide-react";

import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts";

// Data dummy profil user manager untuk layout header/sidebar
const dummyUser = {
  name: "Bintang",
  email: "bintang@alaspurwo.go.id",
  fullName: "Bintang Manager",
  role: "manajer",
  posPengamatan: "Kantor Pusat Balai TN AP",
  avatarInitials: "BM",
};

export const runtime = "nodejs";

export default async function ManagerDashboard({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }> | { search?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const search =
    typeof resolvedSearchParams.search === "string"
      ? resolvedSearchParams.search
      : "";

  // 1. DATA DUMMY: Pemantauan Real-Time (Statistik Utama)
  const summaryCards = [
    {
      title: "Total Petugas Lapangan",
      value: 14,
      detail: "Tersebar di 5 Pos Pengamatan",
      icon: Users,
      accent: "from-emerald-500 to-lime-500",
    },
    {
      title: "Total Observasi Satwa",
      value: 1420,
      detail: "Bulan ini terdata riil",
      icon: Eye,
      accent: "from-teal-500 to-emerald-600",
    },
    {
      title: "Approval Pending",
      value: 7,
      detail: "Laporan observasi baru",
      icon: CircleAlert,
      accent: "from-amber-500 to-orange-500",
    },
    {
      title: "Temuan Darurat Aktif",
      value: 3,
      detail: "Butuh tindak lanjut segera",
      icon: CircleAlert,
      accent: "from-red-500 to-amber-600",
    },
  ];

  // DATA DUMMY: Aktivitas Tim/Hasil Observasi Lapangan untuk Pencarian Historis
  const dummyObservations = [
    { id: "1", observer: "Agus Setiawan", species: "Banteng Jawa (Bos javanicus)", location: "Pos 1 Sadengan", time: "08.20", date: "14/07/2026", status: "Terkonfirmasi" },
    { id: "2", observer: "Siti Rahma", species: "Merak Hijau (Pavo muticus)", location: "Pos 3 Trianggulasi", time: "09.10", date: "14/07/2026", status: "Pending" },
    { id: "3", observer: "Randi Wijaya", species: "Macan Tutul Jawa (Panthera pardus)", location: "Pos 4 Pancur", time: "10.00", date: "13/07/2026", status: "Terkonfirmasi" },
    { id: "4", observer: "Dewi Lestari", species: "Penyu Hijau (Chelonia mydas)", location: "Pos 5 Ngagelan", time: "10.40", date: "13/07/2026", status: "Pending" },
  ];

  // Filter dummy sederhana jika user mengetik sesuatu di kolom pencarian
  const filteredObservations = dummyObservations.filter((obs) =>
    obs.species.toLowerCase().includes(search.toLowerCase()) ||
    obs.location.toLowerCase().includes(search.toLowerCase()) ||
    obs.observer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,64,38,0.5),_transparent_35%),linear-gradient(135deg,_#07110c_0%,_#0c1914_45%,_#13261d_100%)] px-4 py-4 text-slate-100 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row">
        
        {/* Sidebar */}
        <div className="w-full lg:w-72">
          <DashboardSidebar user={dummyUser} />
        </div>

        {/* Content Area */}
        <section className="flex-1 space-y-4">
          <DashboardHeader searchValue={search} user={dummyUser} />

          {/* 1. Pemantauan Real-Time: Ringkasan Statistik Utama */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard key={card.title} {...card} />
            ))}
          </div>

          {/* 2. Menganalisis Data & Tren Satwa */}
          <div className="rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-6 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <Eye className="text-emerald-400" size={20} />
              Tren Populasi & Observasi Mingguan Satwa Liar
            </h2>
            <DashboardCharts
  activity={[
    { day: "Sen", value: 45 },
    { day: "Sel", value: 68 },
    { day: "Rab", value: 52 },
    { day: "Kam", value: 91 },
    { day: "Jum", value: 84 },
  ] as any} // <--- Tambahkan 'as any' di sini
  categoryBreakdown={[
    { name: "Mamalia (Banteng, Rusa)", value: 50 },
    { name: "Aves (Merak, Elang)", value: 30 },
    { name: "Reptil (Penyu, Ular)", value: 20 },
  ] as any} // <--- Tambahkan juga di sini jika categoryBreakdown ikut error
/>
          </div>

          {/* Kolom Tanggung Jawab Operasional Manajer */}
          <div className="grid gap-4 xl:grid-cols-3">
            
            {/* 3. Mengelola Laporan (Export Data) */}
            <div className="rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-6 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">
              <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <FileDown size={20} className="text-emerald-400" />
                Mengelola Laporan (Export)
              </h2>
              <p className="text-sm text-slate-400 mb-5">
                Pilih rentang data observasi untuk diunduh ke format internal/eksternal.
              </p>
              <div className="space-y-3">
                {["Data_Observasi_Mingguan.csv", "Analisis_Perilaku_Bulanan.xlsx", "Laporan_Kesehatan_Ekosistem.pdf"].map((file) => (
                  <div key={file} className="flex items-center justify-between rounded-xl bg-emerald-950/40 p-4">
                    <span className="font-medium text-xs truncate max-w-[180px]">{file}</span>
                    <button className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-1 text-black">
                      <FileDown size={14} /> Unduh
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Mengontrol Akses & Pengguna (RBAC) */}
            <div className="rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-6 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">
              <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-400" />
                Kontrol Akses & Pengguna
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                Manajemen hak akses akun petugas lapangan dan audit log keamanan data masuk.
              </p>
              <div className="space-y-3">
                <a 
                  href="/dashboard/manajer/register" 
                  className="flex items-center justify-center w-full rounded-xl border border-emerald-500/40 bg-emerald-950/20 py-3 text-sm font-medium hover:bg-emerald-500/20 text-emerald-400 transition-all text-center"
                >
                  + Daftarkan Petugas Lapangan
                </a>
                <div className="text-[11px] text-slate-400 bg-black/30 p-3 rounded-xl border border-emerald-900/40">
                  <strong>Audit Log:</strong> Akun <em>petugas_pos3</em> memperbarui data pengamatan Merak Hijau.
                </div>
              </div>
            </div>

            {/* 5. Koordinasi & Pelaporan Kementerian */}
            <div className="rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-6 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">
              <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <Building2 size={20} className="text-emerald-400" />
                Pelaporan Kementerian SDA
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                Sinkronisasi berkas data satwa liar Alas Purwo secara berkala ke server Kementerian Lingkungan Hidup dan Kehutanan.
              </p>
              <button className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md">
                Kirim Berkas Konservasi Resmi
              </button>
            </div>

          </div>

          {/* 6. Melakukan Pencarian Data Historis & Aktivitas Petugas */}
          <div className="rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-6 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Search className="text-emerald-400" size={20} />
                <h2 className="text-lg font-semibold">Pencarian Data Historis Observasi</h2>
              </div>
              <span className="text-xs text-slate-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                Filter Aktif: "{search || 'Semua Data'}"
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="text-left text-slate-400 border-b border-emerald-900/60">
                  <tr>
                    <th className="pb-4">Nama Petugas</th>
                    <th className="pb-4">Spesies Satwa</th>
                    <th className="pb-4">Pos Pengamatan</th>
                    <th className="pb-4">Tanggal & Waktu</th>
                    <th className="pb-4">Status Validasi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredObservations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        Data historis satwa "{search}" tidak ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredObservations.map((row) => (
                      <tr key={row.id} className="border-t border-emerald-900/30 hover:bg-emerald-950/10 transition-colors">
                        <td className="py-4 font-medium text-emerald-300">{row.observer}</td>
                        <td className="font-semibold">{row.species}</td>
                        <td className="text-slate-300">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} className="text-slate-500" /> {row.location}
                          </span>
                        </td>
                        <td className="text-sm text-slate-400">{row.date} | Pukul {row.time} WIB</td>
                        <td>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                            row.status === "Pending"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}