import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// MEMUAT FILE .env.local SECARA MANUAL KE DALAM process.env
// Langkah ini diletakkan di paling atas sebelum ada aktivitas skema atau koneksi
const envPath = path.resolve(process.cwd(), ".env.local");
dotenv.config({ path: envPath });

// Mendefinisikan skema lokal agar tidak bergantung pada file '@/models/User'
// Hal ini mencegah error kompilasi path alias Next.js saat dijalankan di terminal
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true, trim: true },
  role: { type: String, default: "Petugas" }
}, { timestamps: true });

// Gunakan model yang sudah ada di memori Mongoose, atau buat baru berdasarkan skema di atas
const SeedUser = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedManager() {
  console.log("=== MEMULAI PROSES SEEDING AKUN MANAJER ===");

  const mongoUri = process.env.MONGODB_URI;

  // VERIFIKASI VARIABEL LINGKUNGAN
  if (!mongoUri) {
    console.error("🔴 PROSES SEEDING GAGAL SEBELUM DIMULAI!");
    console.error(`Penyebab: Variabel MONGODB_URI tidak ditemukan di dalam file .env.local.`);
    console.error(`Lokasi file .env.local yang diperiksa: ${envPath}`);
    process.exit(1);
  }

  // KONEKSI DATABASE
  try {
    console.log("Menghubungkan langsung ke database MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("🟢 Berhasil terhubung ke database.");
  } catch (dbError: any) {
    console.error("🔴 KONEKSI DATABASE GAGAL!");
    console.error("Penyebab: Aplikasi tidak dapat menjangkau server MongoDB Anda. Periksa apakah MONGODB_URI di file .env.local sudah benar, atau pastikan database lokal/cloud Anda dalam keadaan aktif.");
    console.error(`Detail teknis error database: ${dbError?.message || dbError}`);
    process.exit(1); 
  }

  // Menggunakan kredensial sesuai yang Anda minta
  const targetUsername = "manajer"; 

  // CEK DUPLIKASI DATA (ONE-TIME EXECUTION)
  try {
    console.log(`Memeriksa duplikasi data untuk username: '${targetUsername}'...`);
    const existingUser = await SeedUser.findOne({ username: targetUsername });

    if (existingUser) {
      console.warn("⚠️ PROSES SEEDING DIHENTIKAN!");
      console.warn(`Penyebab: Akun manajer dengan username '${targetUsername}' sudah terdaftar di database.`);
      console.warn(`Data konflik yang ditemukan -> ID Dokumen: ${existingUser._id}, Nama Lengkap: ${existingUser.fullName}`);
      console.warn("Tindakan: Sistem membatalkan penulisan data baru untuk mencegah penumpukan/duplikasi akun dengan username yang sama.");
      
      await mongoose.disconnect();
      process.exit(0); 
    }
    console.log("🟢 Username aman. Tidak ditemukan konflik duplikasi di database.");
  } catch (checkError: any) {
    console.error("🔴 PEMERIKSAAN DUPLIKASI GAGAL!");
    console.error("Penyebab: Gagal melakukan query pencarian (findOne) ke koleksi 'users'. Ini bisa terjadi jika database Anda sedang sibuk, indeks database bermasalah, atau koneksi terputus.");
    console.error(`Detail teknis error query: ${checkError?.message || checkError}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // HASHING PASSWORD
  let hashedPassword = "";
  const passwordPolos = "manajer123"; 

  try {
    console.log("Mengamankan password menggunakan algoritma bcrypt...");
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(passwordPolos, salt);
    console.log("🟢 Password berhasil di-hash dengan aman.");
  } catch (hashError: any) {
    console.error("🔴 PROSES HASHING PASSWORD GAGAL!");
    console.error("Penyebab: Library 'bcryptjs' gagal menghasilkan salt atau gagal mengenkripsi string password polos Anda.");
    console.error(`Detail teknis error bcrypt: ${hashError?.message || hashError}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // INSTANSIASI DOKUMEN MONGOOSE
  let newManagerDoc;
  try {
    console.log("Menyusun struktur dokumen Mongoose untuk akun manajer baru...");
    newManagerDoc = new SeedUser({
      username: targetUsername,
      password: hashedPassword,
      fullName: "Manajer Taman Nasional",
      role: "manajer", 
    });
    console.log("🟢 Dokumen user baru berhasil disiapkan dalam memori.");
  } catch (schemaError: any) {
    console.error("🔴 VALIDASI STRUKTUR DATA GAGAL!");
    console.error("Penyebab: Data yang dimasukkan ke model User tidak memenuhi kriteria validasi Mongoose. Periksa apakah ada field required di skema 'User.ts' Anda yang terlewatkan atau format tipe datanya tidak sesuai.");
    console.error(`Detail teknis error skema: ${schemaError?.message || schemaError}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // PENYIMPANAN DATA KE DATABASE
  try {
    console.log("Menulis data manajer baru ke dalam database MongoDB...");
    const savedManager = await newManagerDoc.save();
    
    console.log("\n========================================================");
    console.log("🎉 BERHASIL: Akun Manajer One-Time Berhasil Dibuat!");
    console.log(`User ID   : ${savedManager._id}`);
    console.log(`Username  : ${targetUsername}`);
    console.log(`Password  : ${passwordPolos}`);
    console.log(`Role      : ${savedManager.role}`);
    console.log("========================================================\n");
  } catch (saveError: any) {
    console.error("🔴 PENYIMPANAN DATA KE DATABASE GAGAL!");
    console.error("Penyebab: MongoDB menolak perintah penyimpanan dokumen ini. Hal ini biasanya terjadi jika ada pelanggaran indeks unik di database (misalnya ada indeks unik lama di MongoDB yang bertubrukan) atau koneksi database terputus di tengah jalan.");
    console.error(`Detail teknis error penyimpanan: ${saveError?.message || saveError}`);
    await mongoose.disconnect();
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Koneksi database telah ditutup dengan aman.");
    process.exit(0);
  }
}

seedManager();