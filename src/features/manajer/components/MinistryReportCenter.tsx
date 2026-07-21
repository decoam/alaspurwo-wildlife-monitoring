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
    kategori: { type: String, required: true }, 
    isProtected: { type: Boolean, required: true, default: false }, 
    statusPerlindungan: { type: String, default: "Tidak Dilindungi" },
  },
  { 
    timestamps: true,
    collection: "satwa"
  }
);

export default mongoose.models.Satwa || mongoose.model<ISatwa>("Satwa", SatwaSchema, "satwa");