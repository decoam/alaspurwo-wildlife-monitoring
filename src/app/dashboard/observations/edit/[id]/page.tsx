import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getObservationById } from "@/features/observation/repository";
import { updateObservation } from "@/features/observation/service";
import { ObservationForm } from "@/features/observation/components/ObservationForm";

export const runtime = "nodejs";

type EditObservationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditObservationPage({ params }: EditObservationPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const result = await getObservationById(id);

  if (!result.success || !result.observation) {
    redirect("/dashboard/observations");
  }

  // Tolak/Redirect jika pengguna bukan pemilik data
  if (String(result.observation.createdBy) !== String(session.user.id)) {
    redirect("/dashboard/observations");
  }

  async function submitObservation(formData: FormData): Promise<{ success: boolean; message: string }> {
    "use server";
    return updateObservation(formData);
  }

  return (
    <main className="obs-main-layout">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-brand-primary/60 bg-surface-bg/80 p-4 shadow-card md:p-6">
        <div className="border-b border-brand-primary/60 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-text">
            Edit Pengamatan
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-text-heading">
            Ubah Data Pengamatan
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Sunting data pengamatan dan perbarui bukti visual jika diperlukan.
          </p>
        </div>

        <div className="mt-6">
          <ObservationForm
            initialValues={{
              id,
              namaSatwa: result.observation.namaSatwa,
              kategori: result.observation.kategori,
              jumlah: result.observation.jumlah,
              lokasi: result.observation.lokasi,
              tanggalPengamatan: new Date(result.observation.tanggalPengamatan)
                .toISOString()
                .split("T")[0],
              shift: result.observation.shift,
              kondisiCuaca: result.observation.kondisiCuaca,
              aktivitasSatwa: result.observation.aktivitasSatwa,
              catatan: result.observation.catatan,
              foto: result.observation.foto,
            }}
            submitLabel="Perbarui Pengamatan"
            onSubmit={submitObservation}
            successRedirectUrl="/dashboard/observations?success=edit"
          />
        </div>
      </div>
    </main>
  );
}