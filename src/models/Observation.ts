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
  status: "Pending" | "Validated" | "Rejected";
  isSynced: boolean;
  createdBy: Types.ObjectId;
  deletedAt: Date | null;
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
    status: {
      type: String,
      enum: ["Pending", "Validated", "Rejected"],
      default: "Pending",
      index: true,
    },
    isSynced: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Sembunyikan data soft-deleted dari query standar .find(), .findOne(), dll.
observationSchema.pre(/^find/, function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this as any).where({ deletedAt: null });
});

// Terapkan soft-delete filter secara otomatis untuk .countDocuments()
observationSchema.pre("countDocuments", function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this as any).where({ deletedAt: null });
});

// Terapkan soft-delete filter secara otomatis untuk .updateMany()
observationSchema.pre("updateMany", function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this as any).where({ deletedAt: null });
});

export const Observation =
  mongoose.models.Observation ||
  mongoose.model<IObservation>("Observation", observationSchema);