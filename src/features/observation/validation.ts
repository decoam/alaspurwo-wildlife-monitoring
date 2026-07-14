import { z } from "zod";

export const observationSchema = z.object({
  namaSatwa: z.string().trim().min(1, "Nama satwa wajib diisi."),
  kategori: z.string().trim().min(1, "Kategori wajib diisi."),
  jumlah: z.coerce.number().int().min(1, "Jumlah minimal 1."),
  lokasi: z.string().trim().min(1, "Lokasi wajib diisi."),
  tanggalPengamatan: z.string().trim().min(1, "Tanggal wajib diisi."),
  shift: z.enum(["Pagi", "Sore"]),
  kondisiCuaca: z.string().trim().min(1, "Kondisi cuaca wajib diisi."),
  aktivitasSatwa: z.string().trim().min(1, "Aktivitas satwa wajib diisi."),
  foto: z.string().trim().min(1, "Foto wajib diunggah.").url("Foto wajib berupa URL Cloudinary."),
  catatan: z.string().trim().optional().default(""),
});