import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

// 1. ENDPOINT UNTUK MENGEDIT DATA PETUGAS (PUT)
export async function PUT(request: Request) {
  try {
    // Proteksi: Pastikan hanya Manajer yang bisa mengakses API ini
    const session = await auth();
    if (!session || session.user?.role?.toLowerCase() !== "manajer") {
      return NextResponse.json({ error: "Akses ditolak. Khusus manajer." }, { status: 403 });
    }

    const { id, fullName, username, password } = await request.json();
    if (!id || !fullName || !username) {
      return NextResponse.json({ error: "Data fullName dan username wajib diisi." }, { status: 400 });
    }

    await connectDB();

    // Validasi: Cek apakah username diubah dan bentrok dengan user lain
    const existingUser = await User.findOne({ username: username.toLowerCase(), _id: { $ne: id } });
    if (existingUser) {
      return NextResponse.json({ error: "Username sudah digunakan oleh akun lain." }, { status: 400 });
    }

    const updateData: any = { 
      fullName, 
      username: username.toLowerCase() 
    };

    // Jika manajer mengisi/mengubah password petugas, lakukan hashing ulang
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ error: "Data petugas tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ message: "Akun petugas berhasil diperbarui!" }, { status: 200 });
  } catch (error: any) {
    console.error("API Petugas PUT Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server internal." }, { status: 500 });
  }
}

// 2. ENDPOINT UNTUK MENGHAPUS DATA PETUGAS (DELETE)
export async function DELETE(request: Request) {
  try {
    // Proteksi: Pastikan hanya Manajer yang bisa menghapus
    const session = await auth();
    if (!session || session.user?.role?.toLowerCase() !== "manajer") {
      return NextResponse.json({ error: "Akses ditolak. Khusus manajer." }, { status: 403 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID Petugas wajib disertakan." }, { status: 400 });
    }

    await connectDB();

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ error: "Petugas tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ message: "Akun petugas berhasil dihapus!" }, { status: 200 });
  } catch (error: any) {
    console.error("API Petugas DELETE Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server internal." }, { status: 500 });
  }
}