import { NextResponse } from "next/server";
import mongoose from "mongoose";
import SatwaDilindungi from "@/models/Satwa"; // Import model yang sudah dibuat

const MONGODB_URI = process.env.MONGODB_URI;

// Helper koneksi database untuk Next.js API Route
async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI belum dikonfigurasi di file .env.local!");
  }
  await mongoose.connect(MONGODB_URI);
}

export async function GET() {
  try {
    await connectToDatabase();

    // Ambil semua data satwa dilindungi dari koleksi 'satwa_dilindungi'
    const dataSatwa = await SatwaDilindungi.find({}).sort({ namaSpesies: 1 });

    return NextResponse.json(
      {
        success: true,
        total: dataSatwa.length,
        data: dataSatwa,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal mengambil data satwa dilindungi:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data dari database",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}