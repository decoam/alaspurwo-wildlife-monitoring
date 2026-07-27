import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface ILogLaporanKementerian extends Document {
  tipeDokumen: "BULANAN" | "BAP";
  nomorSurat: string;
  totalKasus: number;
  totalIndividu: number;
  lastObservationCreatedAt: Date | null;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const logLaporanKementerianSchema = new Schema<ILogLaporanKementerian>(
  {
    tipeDokumen: { type: String, enum: ["BULANAN", "BAP"], required: true },
    nomorSurat: { type: String, required: true },
    totalKasus: { type: Number, default: 0 },
    totalIndividu: { type: Number, default: 0 },
    lastObservationCreatedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const LogLaporanKementerian =
  mongoose.models.LogLaporanKementerian ||
  mongoose.model<ILogLaporanKementerian>("LogLaporanKementerian", logLaporanKementerianSchema);