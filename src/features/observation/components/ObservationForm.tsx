"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { AlertCircle, Camera, CheckCircle2, Image as ImageIcon, Loader2, Trash2, UploadCloud, Calendar as CalendarIcon, X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import "react-day-picker/dist/style.css";

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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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
  const selectedDate = watch("tanggalPengamatan");
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
        <div className="rounded-2xl border border-amber-bg bg-amber-bg px-4 py-3 text-sm text-amber-text">
          {statusMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
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

          {!isNamaSatwaSelected ? (
            <p className="mt-2 text-xs text-emerald-300/90">Silakan pilih nama satwa terlebih dahulu untuk mengaktifkan form pengamatan.</p>
          ) : null}

          {errors.namaSatwa ? <p className="mt-1 text-sm text-rose-300">{errors.namaSatwa.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300 flex items-center justify-between">
            Kategori
            {isNamaSatwaSelected && (
              <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded-full">Terisi otomatis</span>
            )}
          </label>
          <input
            readOnly
            value={derivedKategori}
            placeholder={isNamaSatwaSelected ? "" : "Select animal name first"}
            className="w-full cursor-not-allowed rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm text-white outline-none disabled:cursor-not-allowed"
          />
          {errors.kategori ? <p className="mt-1 text-sm text-rose-300">{errors.kategori.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Jumlah</label>
          <Input type="number" min={1} disabled={!isNamaSatwaSelected} {...register("jumlah", { valueAsNumber: true })} className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          {errors.jumlah && <p className="mt-1 text-sm text-error-text">{errors.jumlah.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Lokasi</label>
          <Select {...register("lokasi")} disabled={!isNamaSatwaSelected}>
            <option value="">Pilih lokasi</option>
            {locationOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
          {errors.lokasi && <p className="mt-1 text-sm text-error-text">{errors.lokasi.message}</p>}
        </div>

        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-slate-300">Tanggal Pengamatan</label>
          <Controller
            control={control}
            name="tanggalPengamatan"
            render={({ field }) => (
              <>
                <button
                  type="button"
                  disabled={!isNamaSatwaSelected}
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className={`w-full flex items-center justify-between rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60 transition ${field.value ? "text-white" : "text-slate-400"}`}
                >
                  <span className="truncate">
                    {field.value
                      ? format(new Date(field.value), "dd MMMM yyyy", { locale: id })
                      : "Pilih tanggal"}
                  </span>
                  <CalendarIcon className="h-4 w-4 shrink-0 opacity-70" />
                </button>

                {isDatePickerOpen && (
                  <div className="absolute top-full mt-2 left-0 z-50 rounded-2xl border border-emerald-900/60 bg-[#0c1914] p-3 shadow-xl shadow-black/50">
                    <div className="flex justify-end mb-2">
                      <button 
                        type="button" 
                        onClick={() => setIsDatePickerOpen(false)}
                        className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-emerald-900/40"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <DayPicker
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                        setIsDatePickerOpen(false);
                      }}
                      locale={id}
                      className="text-white"
                      classNames={{
                        selected: "bg-emerald-600 text-white rounded-full hover:bg-emerald-500",
                        today: "font-bold text-emerald-400",
                        day_button: "hover:bg-emerald-900/40 rounded-full transition-colors",
                      }}
                    />
                  </div>
                )}
              </>
            )}
          />
          {errors.tanggalPengamatan && <p className="mt-1 text-sm text-error-text">{errors.tanggalPengamatan.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Shift</label>
          <Select {...register("shift")} disabled={!isNamaSatwaSelected}>
            <option value="Pagi">Pagi</option>
            <option value="Sore">Sore</option>
          </Select>
          {errors.shift && <p className="mt-1 text-sm text-error-text">{errors.shift.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Cuaca</label>
          <Select {...register("kondisiCuaca")} disabled={!isNamaSatwaSelected}>
            <option value="">Pilih kondisi cuaca</option>
            <option value="Cerah">Cerah</option>
            <option value="Cerah Berawan">Cerah Berawan</option>
            <option value="Berawan">Berawan</option>
            <option value="Mendung">Mendung</option>
            <option value="Hujan Ringan">Hujan Ringan</option>
            <option value="Hujan Lebat">Hujan Lebat</option>
            <option value="Berkabut">Berkabut</option>
          </Select>
          {errors.kondisiCuaca && <p className="mt-1 text-sm text-error-text">{errors.kondisiCuaca.message}</p>}
        </div>
        
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-text-secondary">Aktivitas Satwa</label>
          <textarea
            {...register("aktivitasSatwa")}
            disabled={!isNamaSatwaSelected}
            rows={3}
            placeholder="Deskripsikan aktivitas satwa yang diamati, misalnya makan atau bergerak."
            className="w-full rounded-2xl border border-brand-primary/40 bg-surface-card p-3 text-text-light placeholder:text-text-muted/50 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          {errors.aktivitasSatwa && <p className="mt-1 text-sm text-error-text">{errors.aktivitasSatwa.message}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-text-secondary">Catatan</label>
          <textarea
            {...register("catatan")}
            disabled={!isNamaSatwaSelected}
            rows={3}
            placeholder="Tambahkan catatan lokasi, cuaca, atau kondisi khusus lain."
            className="w-full rounded-2xl border border-brand-primary/40 bg-surface-card p-3 text-text-light placeholder:text-text-muted/50 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          {errors.catatan && <p className="mt-1 text-sm text-error-text">{errors.catatan.message}</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-brand-primary/60 bg-input-bg p-4">
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
            <Camera className="h-4 w-4" /> Upload Foto
          </label>
          <span className="text-xs text-text-muted">JPG, JPEG, PNG, WebP • Maksimal 5 MB</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-3">
            <CldUploadWidget
              uploadPreset={uploadPreset}
              options={{ sources: ["local"], multiple: false, maxFiles: 1, clientAllowedFormats: ["jpg", "jpeg", "png", "webp"], maxFileSize: 5 * 1024 * 1024, resourceType: "image" }}
              onOpen={() => { if (isNamaSatwaSelected) { setUploadState("uploading"); setUploadMessage("Membuka pemilih gambar..."); } }}
              onSuccess={(result) => {
                const uploadResult = result as CloudinaryUploadResult;
                const secureUrl = uploadResult?.info?.secure_url ?? uploadResult?.info?.url ?? null;
                if (secureUrl) { setPhotoUrl(secureUrl); setUploadState("success"); setUploadMessage("Foto berhasil diunggah."); }
                else { setUploadState("error"); setUploadMessage("URL gambar tidak ditemukan."); }
              }}
              onError={(error) => {
                setUploadState("error");
                let errorMessage = "Gagal mengunggah.";
                if (typeof error === "string") {
                  errorMessage = error;
                } else if (error && typeof error === "object" && "statusText" in error) {
                  errorMessage = String((error as { statusText: string }).statusText);
                }
                setUploadMessage(errorMessage);
              }}
            >
              {({ open }) => (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!isNamaSatwaSelected || isSubmitting}
                  onClick={() => {
                    if (!cloudName || !uploadPreset) {
                      setUploadState("error");
                      setUploadMessage("Cloudinary belum dikonfigurasi.");
                    } else if (isNamaSatwaSelected) {
                      open();
                    }
                  }}
                  className="w-full"
                >
                  {uploadState === "uploading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                  {uploadState === "uploading" ? "Mengunggah..." : "Pilih atau tarik gambar"}
                </Button>
              )}
            </CldUploadWidget>
            <div className="rounded-2xl border border-dashed border-brand-primary/70 bg-surface-bg p-3 text-sm text-text-muted">
              Widget mendukung drag & drop. Upload akan otomatis dimulai.
            </div>
            {uploadState === "success" && <div className="flex items-center gap-2 rounded-2xl border border-brand-primary/70 bg-brand-primary/40 px-3 py-2 text-sm text-brand-text-light"><CheckCircle2 className="h-4 w-4" />Foto siap disimpan.</div>}
            {uploadState === "error" && <div className="flex items-center gap-2 rounded-2xl border border-error-bg bg-error-bg px-3 py-2 text-sm text-error-text"><AlertCircle className="h-4 w-4" />{uploadMessage}</div>}
          </div>

          <div className="overflow-hidden rounded-2xl border border-emerald-900/60 bg-[#08140e] w-full aspect-video">
            {photoUrl ? (
              <div className="relative w-full h-full">
                <img src={photoUrl} alt="Preview foto" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute right-3 top-3 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-sm text-white backdrop-blur"
                  disabled={!isNamaSatwaSelected}
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </button>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-500">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8" />
                  <p className="mt-2 text-sm">Preview gambar akan tampil di sini.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={!isNamaSatwaSelected || isSubmitting || uploadState === 'uploading'}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
