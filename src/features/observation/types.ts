export type ActionResult = {
  success: boolean;
  message: string;
};

export type SerializedObservation = {
  _id: string;
  namaSatwa: string;
  kategori: string;
  jumlah: number;
  lokasi: string;
  tanggalPengamatan: string;
  shift: "Pagi" | "Sore";
  kondisiCuaca: string;
  aktivitasSatwa: string;
  foto: string;
  catatan: string;
  namaPetugas: string;
  posPengamatan: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ObservationListParams = {
  search?: string;
  shift?: string;
  category?: string;
  date?: string;
  sort?: string;
  page?: number;
  limit?: number;
};