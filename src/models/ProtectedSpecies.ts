import mongoose, { Schema, Document } from "mongoose";

export interface IProtectedSpecies extends Document {
  namaSpesies: string;
  namaLatin: string;
  keywords: string[];
  kategori: string;
  statusPerlindungan: string;
  isPrioritas: boolean;
}

const ProtectedSpeciesSchema: Schema = new Schema(
  {
    namaSpesies: { type: String, required: true },
    namaLatin: { type: String, required: true },
    keywords: { type: [String], required: true },
    kategori: { type: String, required: true }, // Mamalia, Burung, Reptil, dll.
    statusPerlindungan: { type: String, default: "UU No. 5 Tahun 1990 / Permen LHK" },
    isPrioritas: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.ProtectedSpecies ||
  mongoose.model<IProtectedSpecies>("ProtectedSpecies", ProtectedSpeciesSchema);