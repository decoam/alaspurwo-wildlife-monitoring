import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Observation } from "@/models/Observation";
import { LogLaporanKementerian } from "@/models/LogLaporanKementerian";

export const runtime = "nodejs";

// GET: Cek status sync berdasarkan tipe dokumen (BULANAN / BAP)
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const tipeDokumen = (searchParams.get("tipeDokumen") || "BULANAN") as "BULANAN" | "BAP";

    // Ambil log pengiriman terakhir untuk tipe dokumen ini
    const lastLog = await LogLaporanKementerian.findOne({ tipeDokumen })
      .sort({ createdAt: -1 })
      .lean() as any;

    if (!lastLog) {
      return NextResponse.json({ isSynced: false, status: "draft" });
    }

    // Cek apakah ada observasi baru yang dibuat SETELAH pengiriman terakhir
    const newObservationsCount = await Observation.countDocuments({
      createdAt: { $gt: lastLog.createdAt },
    });

    const isSynced = newObservationsCount === 0;

    return NextResponse.json({
      isSynced,
      status: isSynced ? "sent" : "draft",
      lastSentAt: lastLog.createdAt,
      newCount: newObservationsCount,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST: Catat Log Pengiriman Dokumen Baru
export async function POST(req: Request) {
  try {
    const session = await auth();
    const sessionUser = session?.user as any;

    if (!session || sessionUser?.role?.toLowerCase() !== "manajer") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { tipeDokumen = "BULANAN", nomorSurat, totalKasus, totalIndividu } = body;

    // Ambil timestamp observasi paling akhir
    const latestObs = await Observation.findOne().sort({ createdAt: -1 }).lean() as any;

    // Simpan catatan log ke koleksi baru
    await LogLaporanKementerian.create({
      tipeDokumen,
      nomorSurat: nomorSurat || `KLHK/TN-AP/${tipeDokumen}/${Date.now()}`,
      totalKasus: totalKasus || 0,
      totalIndividu: totalIndividu || 0,
      lastObservationCreatedAt: latestObs?.createdAt || new Date(),
      createdBy: sessionUser.id,
    });

    // Update status observasi jika dokumen yang dikirim adalah laporan Bulanan
    if (tipeDokumen === "BULANAN") {
      await Observation.updateMany(
        { status: "Pending" },
        { $set: { status: "Validated", isSynced: true } }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil mencatat log dan mengirimkan dokumen ${tipeDokumen}`,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}