import mongoose, { Schema, Document } from "mongoose";

export interface ISatwaDilindungi extends Document {
  namaSpesies: string;
  namaLatin: string;
  keywords: string[];
  kategori: string;
  statusPerlindungan: string;
  isPrioritas: boolean;
}

const SatwaDilindungiSchema: Schema = new Schema(
  {
    namaSpesies: { type: String, required: true },
    namaLatin: { type: String, required: true },
    keywords: { type: [String], required: true },
    kategori: { type: String, required: true },
    statusPerlindungan: { type: String, default: "UU No. 5 Tahun 1990 / Permen LHK" },
    isPrioritas: { type: Boolean, default: true },
  },
  { 
    timestamps: true,
    collection: "satwa_dilindungi" // <--- NAMA KOLEKSI BAHASA INDONESIA EKSPLISIT
  }
);

export default mongoose.models.SatwaDilindungi ||
  mongoose.model<ISatwaDilindungi>("SatwaDilindungi", SatwaDilindungiSchema, "satwa_dilindungi");