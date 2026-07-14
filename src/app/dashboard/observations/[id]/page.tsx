import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, UserCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getObservationById } from "@/features/observation/repository";
import { serializeObservation } from "@/features/observation/mapper"; 
import { SerializedObservation } from "@/features/observation";
export const runtime = "nodejs";

type DetailObservationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ObservationDetailPage({ params }: DetailObservationPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const result = await getObservationById(id);

  if (!result.success || !result.observation) {
    redirect("/dashboard/observations");
  }

  const observation = result.observation as SerializedObservation;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,64,38,0.5),_transparent_35%),linear-gradient(135deg,_#07110c_0%,_#0c1914_45%,_#13261d_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-emerald-900/60 bg-[#07110c]/80 p-4 shadow-[0_20px_60px_rgba(2,8,23,0.2)] md:p-6">
        <Link href="/dashboard/observations" className="mb-6 inline-flex items-center gap-2 text-sm text-emerald-200 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[24px] border border-emerald-900/60 bg-[#08140e]">
            <Image src={observation.foto || "/placeholder.svg"} alt={observation.namaSatwa} width={1200} height={800} className="h-[380px] w-full object-cover" unoptimized />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">Detail Pengamatan</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{observation.namaSatwa}</h1>
              <p className="mt-2 text-sm text-slate-400">{observation.kategori} • {observation.shift}</p>
            </div>

            <div className="grid gap-3 rounded-[24px] border border-emerald-900/60 bg-[#0d1d14] p-4 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <UserCircle2 className="h-5 w-5 text-emerald-300" />
                <span>Petugas: {observation.namaPetugas}</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-emerald-300" />
                <span>Tanggal: {new Date(observation.tanggalPengamatan).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-300" />
                <span>Lokasi: {observation.lokasi}</span>
              </div>
            </div>

            <div className="rounded-[24px] border border-emerald-900/60 bg-[#0d1d14] p-4">
              <h2 className="text-lg font-semibold text-white">Informasi Lengkap</h2>
              <dl className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <div><dt className="text-slate-500">Jumlah</dt><dd className="mt-1 font-medium text-white">{observation.jumlah}</dd></div>
                <div><dt className="text-slate-500">Cuaca</dt><dd className="mt-1 font-medium text-white">{observation.kondisiCuaca}</dd></div>
                <div><dt className="text-slate-500">Pos Pengamatan</dt><dd className="mt-1 font-medium text-white">{observation.posPengamatan}</dd></div>
                <div><dt className="text-slate-500">Status Upload</dt><dd className="mt-1 font-medium text-white">{observation.foto ? "Tersedia" : "Belum diunggah"}</dd></div>
                <div><dt className="text-slate-500">Created At</dt><dd className="mt-1 font-medium text-white">{new Date(observation.createdAt).toLocaleString("id-ID")}</dd></div>
                <div><dt className="text-slate-500">Updated At</dt><dd className="mt-1 font-medium text-white">{new Date(observation.updatedAt).toLocaleString("id-ID")}</dd></div>
              </dl>
            </div>

            <div className="rounded-[24px] border border-emerald-900/60 bg-[#0d1d14] p-4">
              <h2 className="text-lg font-semibold text-white">Aktivitas & Catatan</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{observation.aktivitasSatwa}</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">{observation.catatan || "Tidak ada catatan tambahan."}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
