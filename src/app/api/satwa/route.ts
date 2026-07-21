import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Satwa from "@/models/Satwa";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI belum dikonfigurasi!");
  }
  await mongoose.connect(MONGODB_URI);
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();

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
  } catch (error) {
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