import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/models/User";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";

    if (!username || !password || !fullName) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ username: username.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username sudah digunakan." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      fullName,
      role: "Petugas",
    });

    return NextResponse.json(
      {
        message: "Pendaftaran berhasil.",
        user: {
          id: user._id.toString(),
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat mendaftarkan pengguna." },
      { status: 500 }
    );
  }
}
