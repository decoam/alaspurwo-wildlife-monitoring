import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createObservation } from "@/features/observation";
import { ObservationForm } from "@/features/observation/components/ObservationForm";

export const runtime = "nodejs";

export default async function CreateObservationPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  async function submitObservation(formData: FormData): Promise<{ success: boolean; message: string }> {
    "use server";
    return createObservation(formData);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,64,38,0.5),_transparent_35%),linear-gradient(135deg,_#07110c_0%,_#0c1914_45%,_#13261d_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-emerald-900/60 bg-[#07110c]/80 p-4 shadow-[0_20px_60px_rgba(2,8,23,0.2)] md:p-6">
        <div className="border-b border-emerald-900/60 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">Tambah Pengamatan</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Form Pengamatan Satwa</h1>
          <p className="mt-2 text-sm text-slate-400">Isi data pengamatan sesuai dengan kondisi lapangan dan unggah foto bukti.</p>
        </div>

        <div className="mt-6">
          <ObservationForm submitLabel="Simpan Pengamatan" onSubmit={submitObservation} />
        </div>
      </div>
    </main>
  );
}
