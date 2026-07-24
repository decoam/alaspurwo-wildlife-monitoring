import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Interface eksplisit untuk menghindari penggunaan `any`
interface UpdatePetugasData {
  fullName: string;
  username: string;
  password?: string;
}

// 1. ENDPOINT UNTUK MEMBUAT AKUN PETUGAS BARU (POST)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role?.toLowerCase() !== "manajer") {
      return NextResponse.json(
        { error: "Akses ditolak. Khusus manajer." },
        { status: 403 }
      );
    }

    const { fullName, username, password } = await request.json();

    if (!fullName || !username || !password) {
      return NextResponse.json(
        { error: "Semua kolom (Nama, Username, Password) wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah digunakan oleh akun lain." },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      username: username.toLowerCase(),
      password: hashedPassword,
      role: "Petugas",
    });

    return NextResponse.json(
      {
        message: "Akun petugas berhasil dibuat!",
        user: {
          id: newUser._id.toString(),
          fullName: newUser.fullName,
          username: newUser.username,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("API Petugas POST Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server internal." },
      { status: 500 }
    );
  }
}

// 2. ENDPOINT UNTUK MENGEDIT DATA PETUGAS (PUT)
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role?.toLowerCase() !== "manajer") {
      return NextResponse.json(
        { error: "Akses ditolak. Khusus manajer." },
        { status: 403 }
      );
    }

    const { id, fullName, username, password } = await request.json();

    // 1. Validasi Keberadaan Field Utama
    if (!id || !fullName || !username) {
      return NextResponse.json(
        { error: "Data ID, fullName, dan username wajib diisi." },
        { status: 400 }
      );
    }

    // 2. Validasi Format ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Format ID Petugas tidak valid." },
        { status: 400 }
      );
    }

    await connectDB();

    // 3. Pastikan Target adalah User Ber-role "Petugas"
    const targetUser = await User.findOne({
      _id: id,
      role: { $regex: /^petugas$/i },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Akun petugas tidak ditemukan atau target bukan merupakan petugas." },
        { status: 404 }
      );
    }

    // 4. Validasi Duplikasi Username dengan User Lain
    const existingUser = await User.findOne({
      username: username.toLowerCase(),
      _id: { $ne: id },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah digunakan oleh akun lain." },
        { status: 400 }
      );
    }

    // 5. Menyusun Payload Terstruktur tanpa 'any'
    const updateData: UpdatePetugasData = {
      fullName,
      username: username.toLowerCase(),
    };

    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password minimal harus 6 karakter." },
          { status: 400 }
        );
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    await User.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json(
      { message: "Akun petugas berhasil diperbarui!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("API Petugas PUT Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server internal." },
      { status: 500 }
    );
  }
}

// 3. ENDPOINT UNTUK MENGHAPUS DATA PETUGAS (DELETE)
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role?.toLowerCase() !== "manajer") {
      return NextResponse.json(
        { error: "Akses ditolak. Khusus manajer." },
        { status: 403 }
      );
    }

    const { id } = await request.json();

    // 1. Validasi Keberadaan ID
    if (!id) {
      return NextResponse.json(
        { error: "ID Petugas wajib disertakan." },
        { status: 400 }
      );
    }

    // 2. Validasi Format ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Format ID Petugas tidak valid." },
        { status: 400 }
      );
    }

    await connectDB();

    // 3. Hapus Hanya Jika Target Ber-role "Petugas"
    const deletedUser = await User.findOneAndDelete({
      _id: id,
      role: { $regex: /^petugas$/i },
    });

    if (!deletedUser) {
      return NextResponse.json(
        { error: "Petugas tidak ditemukan atau target bukan merupakan petugas." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Akun petugas berhasil dihapus!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("API Petugas DELETE Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server internal." },
      { status: 500 }
    );
  }
}