import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Memuat file .env.local dari root direktori proyek
const envPath = path.resolve(process.cwd(), ".env.local");
dotenv.config({ path: envPath });

async function testConnection() {
  console.log("=== MEMULAI PENGUJIAN KONEKSI DATABASE ===");

  const mongoUri = process.env.MONGODB_URI;

  // Cek apakah variabel lingkungan terbaca
  if (!mongoUri) {
    console.error("🔴 KONEKSI GAGAL SEBELUM DIMULAI!");
    console.error(`Penyebab: Variabel MONGODB_URI tidak ditemukan di dalam file .env.local Anda.`);
    console.error(`Lokasi file .env.local yang diperiksa: ${envPath}`);
    process.exit(1);
  }

  try {
    console.log("Mencoba menyambungkan langsung ke MongoDB Atlas/Lokal...");
    
    // Melakukan koneksi langsung tanpa bergantung pada file src/lib/mongodb.ts
    await mongoose.connect(mongoUri);
    
    if (mongoose.connection.readyState === 1) {
      console.log("\n========================================================");
      console.log("🟢 KONEKSI BERHASIL: Aplikasi Anda Sudah Terhubung!");
      console.log(`Nama Database : ${mongoose.connection.name}`);
      console.log(`Host Database : ${mongoose.connection.host}`);
      console.log("========================================================\n");
    } else {
      console.warn("⚠️ STATUS KONEKSI MERAGUKAN!");
      console.warn("Penyebab: Proses koneksi selesai tanpa error, tetapi status koneksi Mongoose tidak aktif (readyState tidak bernilai 1).");
    }

  } catch (dbError: any) {
    console.error("🔴 KONEKSI DATABASE GAGAL TOTAL!");
    console.error("Penyebab: MongoDB menolak permintaan koneksi dari komputer Anda. Periksa beberapa hal berikut:");
    console.error("1. Pastikan tidak ada karakter salah ketik pada password atau username di dalam string MONGODB_URI.");
    console.error("2. Jika menggunakan MongoDB Atlas (Cloud), pastikan IP Public internet Anda saat ini sudah masuk ke whitelist 'Network Access' di dashboard Atlas.");
    console.error(`Detail teknis error: ${dbError?.message || dbError}`);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("Koneksi uji coba telah diputuskan dengan aman.");
    }
    process.exit(0);
  }
}

testConnection();