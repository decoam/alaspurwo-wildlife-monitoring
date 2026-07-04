import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getObservationById, updateObservation } from "@/actions/observation.actions";
import { ObservationForm } from "@/components/observations/ObservationForm";

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

  async function submitObservation(formData: FormData): Promise<{ success: boolean; message: string }> {
    "use server";
    return updateObservation(formData);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,64,38,0.5),_transparent_35%),linear-gradient(135deg,_#07110c_0%,_#0c1914_45%,_#13261d_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-emerald-900/60 bg-[#07110c]/80 p-4 shadow-[0_20px_60px_rgba(2,8,23,0.2)] md:p-6">
        <div className="border-b border-emerald-900/60 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">Edit Pengamatan</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Ubah Data Pengamatan</h1>
          <p className="mt-2 text-sm text-slate-400">Sunting data pengamatan dan perbarui bukti visual jika diperlukan.</p>
        </div>

        <div className="mt-6">
          <ObservationForm
            initialValues={{
              id,
              namaSatwa: result.observation.namaSatwa,
              kategori: result.observation.kategori,
              jumlah: result.observation.jumlah,
              lokasi: result.observation.lokasi,
              tanggalPengamatan: new Date(result.observation.tanggalPengamatan).toISOString().split("T")[0],
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
