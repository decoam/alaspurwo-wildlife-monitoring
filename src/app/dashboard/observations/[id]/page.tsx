import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, UserCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getObservationById } from "@/features/observation/repository"; 
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
    <main className="obs-main-layout">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-brand-primary/60 bg-surface-bg/80 p-4 shadow-card md:p-6">
        <Link href="/dashboard/observations" className="mb-6 inline-flex items-center gap-2 text-sm text-brand-text-light transition hover:text-text-heading">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[24px] border border-brand-primary/60 bg-surface-card">
            <Image src={observation.foto || "/placeholder.svg"} alt={observation.namaSatwa} width={1200} height={800} className="h-[380px] w-full object-cover" unoptimized />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-text">Detail Pengamatan</p>
              <h1 className="mt-2 text-3xl font-semibold text-text-heading">{observation.namaSatwa}</h1>
              <p className="mt-2 text-sm text-text-muted">{observation.kategori} • {observation.shift}</p>
            </div>

            <div className="grid gap-3 rounded-[24px] border border-brand-primary/60 bg-hover-bg p-4 text-sm text-text-secondary">
              <div className="flex items-center gap-3">
                <UserCircle2 className="h-5 w-5 text-brand-text-light" />
                <span>Petugas: {observation.namaPetugas}</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-brand-text-light" />
                <span>Tanggal: {new Date(observation.tanggalPengamatan).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-brand-text-light" />
                <span>Lokasi: {observation.lokasi}</span>
              </div>
            </div>

            <div className="rounded-[24px] border border-brand-primary/60 bg-hover-bg p-4">
              <h2 className="text-lg font-semibold text-text-heading">Informasi Lengkap</h2>
              <dl className="mt-4 grid gap-3 text-sm text-text-secondary sm:grid-cols-2">
                <div><dt className="text-text-muted">Jumlah</dt><dd className="mt-1 font-medium text-text-heading">{observation.jumlah}</dd></div>
                <div><dt className="text-text-muted">Cuaca</dt><dd className="mt-1 font-medium text-text-heading">{observation.kondisiCuaca}</dd></div>
                <div><dt className="text-text-muted">Pos Pengamatan</dt><dd className="mt-1 font-medium text-text-heading">{observation.posPengamatan}</dd></div>
                <div><dt className="text-text-muted">Status Upload</dt><dd className="mt-1 font-medium text-text-heading">{observation.foto ? "Tersedia" : "Belum diunggah"}</dd></div>
                <div><dt className="text-text-muted">Created At</dt><dd className="mt-1 font-medium text-text-heading">{new Date(observation.createdAt).toLocaleString("id-ID")}</dd></div>
                <div><dt className="text-text-muted">Updated At</dt><dd className="mt-1 font-medium text-text-heading">{new Date(observation.updatedAt).toLocaleString("id-ID")}</dd></div>
              </dl>
            </div>

            <div className="rounded-[24px] border border-brand-primary/60 bg-hover-bg p-4">
              <h2 className="text-lg font-semibold text-text-heading">Aktivitas & Catatan</h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{observation.aktivitasSatwa}</p>
              <p className="mt-2 text-sm leading-7 text-text-muted">{observation.catatan || "Tidak ada catatan tambahan."}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
