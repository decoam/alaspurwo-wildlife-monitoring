import type { SerializedObservation } from "./types";

export function parseObservationFormData(formData: FormData) {
  return {
    namaSatwa: formData.get("namaSatwa")?.toString() ?? "",
    kategori: formData.get("kategori")?.toString() ?? "",
    jumlah: formData.get("jumlah")?.toString() ?? "",
    lokasi: formData.get("lokasi")?.toString() ?? "",
    tanggalPengamatan: formData.get("tanggalPengamatan")?.toString() ?? "",
    shift: formData.get("shift")?.toString() ?? "",
    kondisiCuaca: formData.get("kondisiCuaca")?.toString() ?? "",
    aktivitasSatwa: formData.get("aktivitasSatwa")?.toString() ?? "",
    foto: formData.get("foto")?.toString() ?? "",
    catatan: formData.get("catatan")?.toString() ?? "",
  };
}

export function serializeObservation(observation: Record<string, unknown>): SerializedObservation {
  const value = observation as Record<string, unknown> & Partial<SerializedObservation>;

  return {
    _id: value._id ? String(value._id) : "",
    namaSatwa: typeof value.namaSatwa === "string" ? value.namaSatwa : "",
    kategori: typeof value.kategori === "string" ? value.kategori : "",
    jumlah: typeof value.jumlah === "number" ? value.jumlah : Number(value.jumlah ?? 0),
    lokasi: typeof value.lokasi === "string" ? value.lokasi : "",
    tanggalPengamatan: value.tanggalPengamatan ? new Date(value.tanggalPengamatan as string | Date).toISOString() : "",
    shift: value.shift === "Sore" ? "Sore" : "Pagi",
    kondisiCuaca: typeof value.kondisiCuaca === "string" ? value.kondisiCuaca : "",
    aktivitasSatwa: typeof value.aktivitasSatwa === "string" ? value.aktivitasSatwa : "",
    foto: typeof value.foto === "string" ? value.foto : "",
    catatan: typeof value.catatan === "string" ? value.catatan : "",
    namaPetugas: typeof value.namaPetugas === "string" ? value.namaPetugas : "",
    posPengamatan: typeof value.posPengamatan === "string" ? value.posPengamatan : "",
    createdBy: value.createdBy ? String(value.createdBy) : "",
    createdAt: value.createdAt ? new Date(value.createdAt as string | Date).toISOString() : "",
    updatedAt: value.updatedAt ? new Date(value.updatedAt as string | Date).toISOString() : "",
  };
}