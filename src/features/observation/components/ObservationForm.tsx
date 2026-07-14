"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AlertCircle, Camera, CheckCircle2, Image as ImageIcon, Loader2, Trash2, UploadCloud } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

const satwaOptions = ["Rusa Timor", "Banteng Jawa", "Merak Jawa", "Elang", "Babi Hutan", "Macan Tutul"];
const categoryOptions = ["Mamalia", "Burung", "Reptil", "Amfibi", "Primata"];
const locationOptions = ["Pos Pengamatan Pantai", "Rawa Mangrove", "Sadengan", "Puncak Pengamatan", "Padang Savana"];

type ObservationFormValues = {
  namaSatwa: string;
  kategori: string;
  jumlah: number;
  lokasi: string;
  tanggalPengamatan: string;
  shift: "Pagi" | "Sore";
  kondisiCuaca: string;
  aktivitasSatwa: string;
  catatan?: string;
  foto?: string;
};

type ObservationFormProps = {
  initialValues?: Partial<ObservationFormValues> & { foto?: string; id?: string };
  submitLabel: string;
  onSubmit: (formData: FormData) => Promise<{ success: boolean; message: string }>;
  successRedirectUrl?: string;
};

type CloudinaryUploadResult = {
  event?: string;
  info?: {
    secure_url?: string;
    url?: string;
  };
};

export function ObservationForm({ initialValues, submitLabel, onSubmit, successRedirectUrl = "/dashboard/observations?success=create" }: ObservationFormProps) {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialValues?.foto ?? null);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? process.env.CLOUDINARY_UPLOAD_PRESET ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ObservationFormValues>({
    defaultValues: {
      namaSatwa: initialValues?.namaSatwa ?? "",
      kategori: initialValues?.kategori ?? "",
      jumlah: initialValues?.jumlah ?? 1,
      lokasi: initialValues?.lokasi ?? "",
      tanggalPengamatan: initialValues?.tanggalPengamatan ?? "",
      shift: initialValues?.shift ?? "Pagi",
      kondisiCuaca: initialValues?.kondisiCuaca ?? "",
      aktivitasSatwa: initialValues?.aktivitasSatwa ?? "",
      catatan: initialValues?.catatan ?? "",
    },
  });

  useEffect(() => {
    if (initialValues?.foto) {
      setPhotoUrl(initialValues.foto);
      setUploadState("success");
      setUploadMessage("Foto saat ini sudah tersimpan.");
    }
  }, [initialValues?.foto]);

  const removePhoto = () => {
    setPhotoUrl(null);
    setUploadState("idle");
    setUploadMessage(null);
  };

  const submitHandler = async (data: ObservationFormValues) => {
    setStatusMessage(null);
    const finalPhotoUrl = photoUrl ?? initialValues?.foto ?? "";

    if (!finalPhotoUrl) {
      setStatusMessage("Foto wajib diunggah sebelum menyimpan data.");
      return;
    }

    const formData = new FormData();

    if (initialValues?.id) {
      formData.append("id", initialValues.id);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (key === "foto") {
        return;
      }

      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    formData.append("foto", finalPhotoUrl);

    const result = await onSubmit(formData);

    if (result.success) {
      router.push(successRedirectUrl);
      return;
    }

    setStatusMessage(result.message);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      {statusMessage ? (
        <div className="rounded-2xl border border-amber-900/60 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">
          {statusMessage}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Nama Satwa</label>
          <select {...register("namaSatwa")} className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none">
            <option value="">Pilih satwa</option>
            {satwaOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.namaSatwa ? <p className="mt-1 text-sm text-rose-300">{errors.namaSatwa.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Kategori</label>
          <select {...register("kategori")} className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none">
            <option value="">Pilih kategori</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.kategori ? <p className="mt-1 text-sm text-rose-300">{errors.kategori.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Jumlah</label>
          <input type="number" {...register("jumlah")} className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none" />
          {errors.jumlah ? <p className="mt-1 text-sm text-rose-300">{errors.jumlah.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Lokasi</label>
          <select {...register("lokasi")} className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none">
            <option value="">Pilih lokasi</option>
            {locationOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.lokasi ? <p className="mt-1 text-sm text-rose-300">{errors.lokasi.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Tanggal Pengamatan</label>
          <input type="date" {...register("tanggalPengamatan")} className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none" />
          {errors.tanggalPengamatan ? <p className="mt-1 text-sm text-rose-300">{errors.tanggalPengamatan.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Shift</label>
          <select {...register("shift")} className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none">
            <option value="Pagi">Pagi</option>
            <option value="Sore">Sore</option>
          </select>
          {errors.shift ? <p className="mt-1 text-sm text-rose-300">{errors.shift.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Cuaca</label>
          <input {...register("kondisiCuaca")} className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none" />
          {errors.kondisiCuaca ? <p className="mt-1 text-sm text-rose-300">{errors.kondisiCuaca.message}</p> : null}
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">Aktivitas Satwa</label>
          <textarea {...register("aktivitasSatwa")} rows={3} className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none" />
          {errors.aktivitasSatwa ? <p className="mt-1 text-sm text-rose-300">{errors.aktivitasSatwa.message}</p> : null}
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">Catatan</label>
          <textarea {...register("catatan")} rows={3} className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none" />
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-900/60 bg-[#10241a] p-4">
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Camera className="h-4 w-4" />
            Upload Foto
          </label>
          <span className="text-xs text-slate-500">JPG, JPEG, PNG, WebP • Maksimal 5 MB</span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-3">
            <CldUploadWidget
              uploadPreset={uploadPreset}
              options={{
                sources: ["local"],
                multiple: false,
                maxFiles: 1,
                clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                maxFileSize: 5 * 1024 * 1024,
                resourceType: "image",
              }}
              onOpen={() => {
                setUploadState("uploading");
                setUploadMessage("Membuka pemilih gambar...");
              }}
              onSuccess={(result) => {
                const uploadResult = result as CloudinaryUploadResult;
                const secureUrl = uploadResult?.info?.secure_url ?? uploadResult?.info?.url ?? null;

                if (!secureUrl) {
                  setUploadState("error");
                  setUploadMessage("Cloudinary tidak mengembalikan URL gambar.");
                  return;
                }

                setPhotoUrl(secureUrl);
                setUploadState("success");
                setUploadMessage("Foto berhasil diunggah ke Cloudinary.");
              }}
              onError={(error) => {
                const message = typeof error === "string"
                  ? error
                  : error?.statusText ?? "Gagal mengunggah foto.";

                setUploadState("error");
                setUploadMessage(message);
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => {
                    if (!cloudName || !uploadPreset) {
                      setUploadState("error");
                      setUploadMessage("Cloudinary belum dikonfigurasi. Periksa variabel NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME dan NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.");
                      return;
                    }

                    setUploadState("uploading");
                    setUploadMessage("Mengunggah foto...");
                    open();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-700/70 bg-emerald-700/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  {uploadState === "uploading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                  {uploadState === "uploading" ? "Mengunggah..." : "Pilih atau tarik gambar"}
                </button>
              )}
            </CldUploadWidget>

            <div className="rounded-2xl border border-dashed border-emerald-800/70 bg-[#0b1712] p-3 text-sm text-slate-400">
              Widget mendukung drag & drop dari perangkat Anda. Setelah upload selesai, URL gambar akan dikirim ke server action.
            </div>

            {uploadState === "success" ? (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-900/70 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Foto siap disimpan.
              </div>
            ) : null}

            {uploadState === "error" ? (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-900/70 bg-rose-950/40 px-3 py-2 text-sm text-rose-300">
                <AlertCircle className="h-4 w-4" />
                {uploadMessage}
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-2xl border border-emerald-900/60 bg-[#08140e]">
            {photoUrl ? (
              <div className="relative">
                <img src={photoUrl} alt="Preview foto" className="h-56 w-full object-cover" />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute right-3 top-3 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-sm text-white backdrop-blur"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </button>
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center text-slate-500">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8" />
                  <p className="mt-2 text-sm">Preview gambar akan tampil di sini.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => router.back()} className="rounded-2xl border border-emerald-900/60 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-emerald-950/60">
          Batal
        </button>
        <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
