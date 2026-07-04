import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IObservation extends Document {
  namaSatwa: string;
  kategori: string;
  jumlah: number;
  lokasi: string;
  tanggalPengamatan: Date;
  shift: "Pagi" | "Sore";
  kondisiCuaca: string;
  aktivitasSatwa: string;
  foto: string;
  catatan: string;
  namaPetugas: string;
  posPengamatan: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const observationSchema = new Schema<IObservation>(
  {
    namaSatwa: { type: String, required: true, trim: true },
    kategori: { type: String, required: true, trim: true },
    jumlah: { type: Number, required: true, min: 1 },
    lokasi: { type: String, required: true, trim: true },
    tanggalPengamatan: { type: Date, required: true },
    shift: { type: String, enum: ["Pagi", "Sore"], required: true },
    kondisiCuaca: { type: String, required: true, trim: true },
    aktivitasSatwa: { type: String, required: true, trim: true },
    foto: { type: String, default: "" },
    catatan: { type: String, default: "" },
    namaPetugas: { type: String, required: true, trim: true },
    posPengamatan: { type: String, required: true, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Observation = mongoose.models.Observation || mongoose.model<IObservation>("Observation", observationSchema);
