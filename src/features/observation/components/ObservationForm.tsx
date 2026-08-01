"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AlertCircle, Camera, CheckCircle2, Image as ImageIcon, Loader2, Trash2, UploadCloud } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const satwaOptions = ["Rusa Timor", "Banteng Jawa", "Merak Jawa", "Elang", "Babi Hutan", "Macan Tutul"];
const locationOptions = ["Pos Pengamatan Pantai", "Rawa Mangrove", "Sadengan", "Puncak Pengamatan", "Padang Savana"];

const animalCategoryMap: Record<string, string> = {
  "Banteng Jawa": "Mamalia",
  "Rusa Timor": "Mamalia",
  "Merak Jawa": "Burung",
  "Elang": "Burung",
  "Babi Hutan": "Mamalia",
  "Macan Tutul": "Mamalia",
};

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

function getKategoriFromNamaSatwa(namaSatwa: string): string {
  return animalCategoryMap[namaSatwa] ?? "";
}

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

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? process.env.CLOUDINARY_UPLOAD_PRESET ?? "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
          <label className="mb-2 block text-sm font-medium text-text-secondary">Nama Satwa</label>
          <Select {...register("namaSatwa")}>
            <option value="">Pilih satwa</option>
            {satwaOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
          {!isNamaSatwaSelected && <p className="mt-2 text-xs text-brand-text-light/90">Silakan pilih nama satwa terlebih dahulu untuk mengaktifkan form pengamatan.</p>}
          {errors.namaSatwa && <p className="mt-1 text-sm text-error-text">{errors.namaSatwa.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Kategori</label>
          <Input readOnly value={derivedKategori} placeholder={isNamaSatwaSelected ? "" : "Pilih nama satwa terlebih dahulu"} disabled={!isNamaSatwaSelected} />
          {errors.kategori && <p className="mt-1 text-sm text-error-text">{errors.kategori.message}</p>}
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
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Tanggal Pengamatan</label>
          <DatePicker
            value={selectedDate ? new Date(`${selectedDate}T00:00:00`) : undefined}
            onChange={(date) => {
              if (!date) {
                setValue("tanggalPengamatan", "", { shouldValidate: true, shouldDirty: true });
                return;
              }
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              setValue("tanggalPengamatan", `${year}-${month}-${day}`, { shouldValidate: true, shouldDirty: true });
            }}
            disabled={!isNamaSatwaSelected}
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
          <textarea {...register("aktivitasSatwa")} disabled={!isNamaSatwaSelected} rows={3} className="obs-textarea-field" />
          {errors.aktivitasSatwa && <p className="mt-1 text-sm text-error-text">{errors.aktivitasSatwa.message}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-text-secondary">Catatan</label>
          <textarea {...register("catatan")} disabled={!isNamaSatwaSelected} rows={3} className="obs-textarea-field" />
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
            {uploadState === "error" && <div className="flex items-center gap-2 rounded-2xl border border-rose-900/70 bg-rose-950/40 px-3 py-2 text-sm text-error-text"><AlertCircle className="h-4 w-4" />{uploadMessage}</div>}
          </div>
          <div className="overflow-hidden rounded-2xl border border-brand-primary/60 bg-surface-card">
            {photoUrl ? (
              <div className="relative">
                <img src={photoUrl} alt="Preview foto" className="h-56 w-full object-cover" />
                <Button type="button" variant="danger" onClick={removePhoto} className="absolute right-3 top-3 !py-2 !px-3" disabled={!isNamaSatwaSelected}>
                  <Trash2 className="h-4 w-4" /> Hapus
                </Button>
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center text-text-muted"><div className="text-center"><ImageIcon className="mx-auto h-8 w-8" /><p className="mt-2 text-sm">Preview gambar akan tampil di sini.</p></div></div>
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
