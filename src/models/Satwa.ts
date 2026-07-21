import mongoose, { Schema, Document } from "mongoose";

export interface ISatwa extends Document {
  namaSpesies: string;
  namaLatin: string;
  keywords: string[];
  kategori: string;
  isProtected: boolean; // true = Dilindungi, false = Tidak Dilindungi
  statusPerlindungan: string;
}

const SatwaSchema: Schema = new Schema(
  {
    namaSpesies: { type: String, required: true, unique: true },
    namaLatin: { type: String, required: true },
    keywords: { type: [String], required: true },
    kategori: { type: String, required: true }, // Mamalia, Aves, Reptil, dll.
    isProtected: { type: Boolean, required: true, default: false }, // <--- FLAG UTAMA
    statusPerlindungan: { type: String, default: "Tidak Dilindungi" },
  },
  { 
    timestamps: true,
    collection: "satwa" // Nama koleksi di MongoDB Cluster
  }
);

export default mongoose.models.Satwa || mongoose.model<ISatwa>("Satwa", SatwaSchema, "satwa");