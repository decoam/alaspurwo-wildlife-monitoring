import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    // PROTEKSI: Wajib login (Session harus ada)
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Akses ditolak. Anda harus login terlebih dahulu." },
        { status: 401 }
      );
    }

    await connectDB();

    // RESPON SUKSES: Tanpa membocorkan detail infrastruktur internal
    return NextResponse.json({
      success: true,
      message: "Koneksi database berhasil.",
    });
  } catch (error: unknown) {
    // Detail error tetap dicatat di terminal VS Code untuk debugging Bintang
    console.error("[DB TEST ERROR]:", error);

    // PESAN GENERIK: Menyembunyikan error.message mentah dari publik/client
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada koneksi basis data.",
      },
      { status: 500 }
    );
  }
}