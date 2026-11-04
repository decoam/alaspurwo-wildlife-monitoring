"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { AlertCircle, Camera, CheckCircle2, Image as ImageIcon, Loader2, Trash2, UploadCloud } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/DatePicker";

const locationOptions = ["Pos Pengamatan Pantai", "Rawa Mangrove", "Sadengan", "Puncak Pengamatan", "Padang Savana"];

const observationSchema = z.object({
  namaSatwa: z.string().min(1, "Nama satwa wajib dipilih"),
  kategori: z.string().optional(),
  jumlah: z.number().min(1, "Jumlah minimal 1"),
  lokasi: z.string().min(1, "Lokasi wajib dipilih"),
  tanggalPengamatan: z.string().min(1, "Tanggal wajib diisi"),
  shift: z.enum(["Pagi", "Sore"]),
  kondisiCuaca: z.string().min(1, "Kondisi cuaca wajib dipilih"),
  aktivitasSatwa: z.string().min(10, "Aktivitas satwa minimal 10 karakter"),
  catatan: z.string().optional(),
  foto: z.string().optional(),
});

type ObservationFormValues = z.infer<typeof observationSchema>;

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

export function ObservationForm({
  initialValues,
  submitLabel,
  onSubmit,
  successRedirectUrl = "/dashboard/observations?success=create",
}: ObservationFormProps) {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialValues?.foto ?? null);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const [satwaList, setSatwaList] = useState<{ namaSpesies: string; kategori: string }[]>([]);
  const [satwaLoading, setSatwaLoading] = useState(true);
  const [satwaError, setSatwaError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSatwa() {
      try {
        const res = await fetch("/api/satwa");
        if (!res.ok) throw new Error("Gagal mengambil data satwa");
        const json = await res.json();
        if (json.success) {
          setSatwaList(json.data);
        } else {
          setSatwaError(json.message);
        }
      } catch (err: any) {
        setSatwaError(err.message || "Terjadi kesalahan");
      } finally {
        setSatwaLoading(false);
      }
    }
    fetchSatwa();
  }, []);

  const animalCategoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    satwaList.forEach((s) => {
      map[s.namaSpesies] = s.kategori;
    });
    return map;
  }, [satwaList]);

  function getKategoriFromNamaSatwa(namaSatwa: string): string {
    return animalCategoryMap[namaSatwa] ?? "";
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? process.env.CLOUDINARY_UPLOAD_PRESET ?? "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ObservationFormValues>({
    resolver: zodResolver(observationSchema),
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

  const selectedNamaSatwa = watch("namaSatwa");
  const isNamaSatwaSelected = Boolean(selectedNamaSatwa);
  const derivedKategori = useMemo(() => getKategoriFromNamaSatwa(selectedNamaSatwa), [selectedNamaSatwa]);

  useEffect(() => {
    setValue("kategori", derivedKategori, { shouldValidate: true, shouldDirty: true });
  }, [derivedKategori, setValue]);

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
      if (key !== "foto" && value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    formData.append("foto", finalPhotoUrl);

    const result = await onSubmit(formData);
    if (result.success) {
      router.push(successRedirectUrl);
    } else {
      setStatusMessage(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      {statusMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-900/60 bg-rose-950/40 p-4 text-sm text-rose-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Nama Satwa */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Nama Satwa</label>
          <select
            {...register("namaSatwa")}
            disabled={satwaLoading || !!satwaError}
            className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none disabled:opacity-50"
          >
            <option value="">{satwaLoading ? "Memuat satwa..." : satwaError ? "Gagal memuat" : "Pilih satwa"}</option>
            {satwaList.map((satwa) => (
              <option key={satwa.namaSpesies} value={satwa.namaSpesies}>
                {satwa.namaSpesies}
              </option>
            ))}
          </select>
          {satwaError && <p className="mt-1 text-sm text-rose-400">{satwaError}</p>}
          {!isNamaSatwaSelected && (
            <p className="mt-2 text-xs text-emerald-300/90">Silakan pilih nama satwa terlebih dahulu untuk mengaktifkan form pengamatan.</p>
          )}
          {errors.namaSatwa && <p className="mt-1 text-sm text-rose-300">{errors.namaSatwa.message}</p>}
        </div>

        {/* Kategori */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium text-slate-300">
            <span>Kategori</span>
            {isNamaSatwaSelected && (
              <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] text-emerald-300 border border-emerald-700/50">
                Terisi otomatis
              </span>
            )}
          </label>
          <input
            readOnly
            value={derivedKategori}
            placeholder={isNamaSatwaSelected ? "" : "Pilih nama satwa terlebih dahulu"}
            className="w-full cursor-not-allowed rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none opacity-80"
          />
          {errors.kategori && <p className="mt-1 text-sm text-rose-300">{errors.kategori.message}</p>}
        </div>

        {/* Jumlah */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Jumlah Satwa (Ekor)</label>
          <input
            type="number"
            min={1}
            disabled={!isNamaSatwaSelected}
            {...register("jumlah", { valueAsNumber: true })}
            className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {errors.jumlah && <p className="mt-1 text-sm text-rose-300">{errors.jumlah.message}</p>}
        </div>

        {/* Lokasi */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Lokasi Pengamatan</label>
          <select
            {...register("lokasi")}
            disabled={!isNamaSatwaSelected}
            className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Pilih lokasi</option>
            {locationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.lokasi && <p className="mt-1 text-sm text-rose-300">{errors.lokasi.message}</p>}
        </div>

        {/* Tanggal Pengamatan */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Tanggal Pengamatan</label>
          <Controller
            control={control}
            name="tanggalPengamatan"
            render={({ field }) => (
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                disabled={!isNamaSatwaSelected}
              />
            )}
          />
          {errors.tanggalPengamatan && <p className="mt-1 text-sm text-rose-300">{errors.tanggalPengamatan.message}</p>}
        </div>

        {/* Shift */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Shift Pengamatan</label>
          <select
            {...register("shift")}
            disabled={!isNamaSatwaSelected}
            className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="Pagi">Pagi</option>
            <option value="Sore">Sore</option>
          </select>
          {errors.shift && <p className="mt-1 text-sm text-rose-300">{errors.shift.message}</p>}
        </div>

        {/* Cuaca */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">Kondisi Cuaca</label>
          <select
            {...register("kondisiCuaca")}
            disabled={!isNamaSatwaSelected}
            className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Pilih kondisi cuaca</option>
            <option value="Cerah">Cerah</option>
            <option value="Cerah Berawan">Cerah Berawan</option>
            <option value="Berawan">Berawan</option>
            <option value="Mendung">Mendung</option>
            <option value="Hujan Ringan">Hujan Ringan</option>
            <option value="Hujan Lebat">Hujan Lebat</option>
            <option value="Berkabut">Berkabut</option>
          </select>
          {errors.kondisiCuaca && <p className="mt-1 text-sm text-rose-300">{errors.kondisiCuaca.message}</p>}
        </div>

        {/* Aktivitas Satwa */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">Aktivitas Satwa</label>
          <textarea
            {...register("aktivitasSatwa")}
            disabled={!isNamaSatwaSelected}
            rows={3}
            placeholder="Deskripsikan aktivitas satwa yang diamati, misalnya sedang makan rumput, bertengger, atau berpindah kelompok."
            className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] p-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {errors.aktivitasSatwa && <p className="mt-1 text-sm text-rose-300">{errors.aktivitasSatwa.message}</p>}
        </div>

        {/* Catatan Tambahan */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">Catatan Tambahan (Opsional)</label>
          <textarea
            {...register("catatan")}
            disabled={!isNamaSatwaSelected}
            rows={3}
            placeholder="Tambahkan catatan khusus mengenai lingkungan, koordinat spesifik, atau anomali kondisi satwa."
            className="w-full rounded-2xl border border-emerald-900/60 bg-[#10241a] p-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {errors.catatan && <p className="mt-1 text-sm text-rose-300">{errors.catatan.message}</p>}
        </div>
      </div>

      {/* Upload Foto */}
      <div className="rounded-2xl border border-emerald-900/60 bg-[#07110c]/80 p-5 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <Camera className="h-4 w-4 text-emerald-400" /> Upload Foto Dokumentasi
          </label>
          <span className="text-xs text-slate-400">JPG, JPEG, PNG, WebP • Maksimal 5 MB</span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr]">
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
                if (isNamaSatwaSelected) {
                  setUploadState("uploading");
                  setUploadMessage("Membuka pemilih gambar...");
                }
              }}
              onSuccess={(result) => {
                const uploadResult = result as CloudinaryUploadResult;
                const secureUrl = uploadResult?.info?.secure_url ?? uploadResult?.info?.url ?? null;
                if (secureUrl) {
                  setPhotoUrl(secureUrl);
                  setUploadState("success");
                  setUploadMessage("Foto berhasil diunggah.");
                } else {
                  setUploadState("error");
                  setUploadMessage("URL gambar tidak ditemukan.");
                }
              }}
              onError={(error) => {
                setUploadState("error");
                let errorMessage = "Gagal mengunggah foto.";
                if (typeof error === "string") {
                  errorMessage = error;
                } else if (error && typeof error === "object" && "statusText" in error) {
                  errorMessage = String((error as { statusText: string }).statusText);
                }
                setUploadMessage(errorMessage);
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  disabled={!isNamaSatwaSelected || isSubmitting}
                  onClick={() => {
                    if (!cloudName || !uploadPreset) {
                      setUploadState("error");
                      setUploadMessage("Cloudinary belum dikonfigurasi.");
                    } else if (isNamaSatwaSelected) {
                      open();
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-800/80 bg-emerald-950/40 px-4 py-3 text-sm font-medium text-emerald-200 transition hover:bg-emerald-900/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploadState === "uploading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                  {uploadState === "uploading" ? "Mengunggah..." : "Pilih atau Tarik Foto Satwa"}
                </button>
              )}
            </CldUploadWidget>

            <div className="rounded-2xl border border-dashed border-emerald-900/60 bg-[#08140e] p-3 text-xs text-slate-400">
              Pastikan foto jelas menampilkan satwa yang sedang dipantau di lokasi.
            </div>

            {uploadState === "success" && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-800/60 bg-emerald-950/60 px-3 py-2 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Foto siap disimpan bersama laporan observasi.</span>
              </div>
            )}

            {uploadState === "error" && (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-900/60 bg-rose-950/50 px-3 py-2 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{uploadMessage}</span>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-emerald-900/60 bg-[#08140e] aspect-video w-full">
            {photoUrl ? (
              <div className="relative w-full h-full">
                <img src={photoUrl} alt="Preview foto satwa" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute right-3 top-3 flex items-center gap-1.5 rounded-xl border border-rose-800/80 bg-rose-950/80 px-3 py-1.5 text-xs font-medium text-rose-200 shadow-md backdrop-blur transition hover:bg-rose-900"
                  disabled={!isNamaSatwaSelected}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </button>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-slate-500 p-4">
                <ImageIcon className="h-8 w-8 opacity-40 text-emerald-400" />
                <p className="mt-2 text-xs text-slate-400 text-center">Preview gambar yang diunggah akan muncul di sini</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!isNamaSatwaSelected || isSubmitting || uploadState === "uploading"}
          className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-lime-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/50 transition hover:from-emerald-600 hover:to-lime-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
