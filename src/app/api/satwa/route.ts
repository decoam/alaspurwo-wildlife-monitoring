import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Satwa from "@/models/Satwa";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    // 1. Proteksi Autentikasi: Memastikan pengguna sudah terautentikasi (login)
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // 2. Gunakan koneksi tercache terpusat dari @/lib/mongodb
    await connectDB();

    const { searchParams } = new URL(request.url);
    const isProtectedQuery = searchParams.get("protected");

    let filter = {};
    if (isProtectedQuery !== null) {
      filter = { isProtected: isProtectedQuery === "true" };
    }

    const dataSatwa = await Satwa.find(filter).sort({ namaSpesies: 1 });

    return NextResponse.json(
      {
        success: true,
        total: dataSatwa.length,
        data: dataSatwa,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Gagal mengambil data satwa:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data dari database",
      },
      { status: 500 }
    );
  }
}