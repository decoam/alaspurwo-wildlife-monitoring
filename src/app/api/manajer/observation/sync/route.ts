import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Observation } from "@/models/Observation";
import { LogLaporanKementerian } from "@/models/LogLaporanKementerian";

export const runtime = "nodejs";

interface LogDocument {
  _id: string;
  tipeDokumen: string;
  createdAt: Date;
}

interface ObservationDocument {
  _id: string;
  createdAt: Date;
}

// GET: Cek status sync berdasarkan tipe dokumen (BULANAN / BAP)
export async function GET(req: Request) {
  try {
    const session = await auth();
    const sessionUser = session?.user;

    // Batasi akses GET khusus untuk Manajer
    if (!sessionUser || sessionUser.role?.toLowerCase() !== "manajer") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const tipeDokumen = (searchParams.get("tipeDokumen") || "BULANAN") as "BULANAN" | "BAP";

    // Ambil log pengiriman terakhir untuk tipe dokumen ini
    const lastLog = await LogLaporanKementerian.findOne({ tipeDokumen })
      .sort({ createdAt: -1 })
      .lean<LogDocument>();

    if (!lastLog) {
      return NextResponse.json({ isSynced: false, status: "draft", newCount: 0 });
    }

    // Cek apakah ada observasi baru (eksplisit abaikan data soft-deleted)
    const newObservationsCount = await Observation.countDocuments({
      createdAt: { $gt: lastLog.createdAt },
      deletedAt: null,
    });

    const isSynced = newObservationsCount === 0;

    return NextResponse.json({
      isSynced,
      status: isSynced ? "sent" : "draft",
      lastSentAt: lastLog.createdAt,
      newCount: newObservationsCount,
    });
  } catch (error) {
    console.error("GET /api/manajer/observation/sync error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

// POST: Catat Log Pengiriman Dokumen Baru
export async function POST(req: Request) {
  try {
    const session = await auth();
    const sessionUser = session?.user;

    if (!sessionUser || sessionUser.role?.toLowerCase() !== "manajer") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { tipeDokumen = "BULANAN", nomorSurat, totalKasus, totalIndividu } = body;

    // Validasi Sederhana Input Body
    if (
      typeof tipeDokumen !== "string" ||
      !["BULANAN", "BAP"].includes(tipeDokumen) ||
      (nomorSurat && typeof nomorSurat !== "string") ||
      (totalKasus !== undefined && typeof totalKasus !== "number") ||
      (totalIndividu !== undefined && typeof totalIndividu !== "number")
    ) {
      return NextResponse.json(
        { message: "Format payload/body request tidak valid" },
        { status: 400 }
      );
    }

    // Ambil timestamp observasi paling akhir (eksplisit abaikan soft-deleted)
    const latestObs = await Observation.findOne({ deletedAt: null })
      .sort({ createdAt: -1 })
      .lean<ObservationDocument>();

    // Simpan catatan log ke koleksi baru
    await LogLaporanKementerian.create({
      tipeDokumen,
      nomorSurat: nomorSurat || `KLHK/TN-AP/${tipeDokumen}/${Date.now()}`,
      totalKasus: typeof totalKasus === "number" ? totalKasus : 0,
      totalIndividu: typeof totalIndividu === "number" ? totalIndividu : 0,
      lastObservationCreatedAt: latestObs?.createdAt || new Date(),
      createdBy: sessionUser.id,
    });

    // Update status observasi jika dokumen yang dikirim adalah laporan Bulanan (abaikan soft-deleted)
    if (tipeDokumen === "BULANAN") {
      await Observation.updateMany(
        { status: "Pending", deletedAt: null },
        { $set: { status: "Validated", isSynced: true } }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil mencatat log dan mengirimkan dokumen ${tipeDokumen}`,
    });
  } catch (error) {
    console.error("POST /api/manajer/observation/sync error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}