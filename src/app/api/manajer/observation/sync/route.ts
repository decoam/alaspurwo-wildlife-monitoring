import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Observation } from "@/models/Observation";

export const runtime = "nodejs";

export async function POST() {
  try {
    // Proteksi Autentikasi dan Hak Akses Manajer
    const session = await auth();
    const sessionUser = session?.user as any;

    if (!session || sessionUser?.role?.toLowerCase() !== "manajer") {
      return NextResponse.json(
        { message: "Akses ditolak. Hanya Manajer yang dapat melakukan aksi ini." },
        { status: 403 }
      );
    }

    // Koneksi ke Database
    await connectDB();

    // Update Permanen Semua Data Observasi yang Masih Pending / Belum Di-sync
    const result = await Observation.updateMany(
      {
        $or: [
          { isSynced: false },
          { isSynced: { $exists: false } },
          { status: "Pending" },
          { status: { $exists: false } },
        ],
      },
      {
        $set: {
          status: "Validated",
          isSynced: true,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Berhasil menyinkronkan seluruh data observasi ke kementerian",
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error("Error sinkronisasi observasi:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat menyinkronkan data" },
      { status: 500 }
    );
  }
}