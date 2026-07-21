import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import SatwaDilindungi from "@/models/SatwaDilindungi";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

const dataAwalSatwa = [
  {
    namaSpesies: "Banteng Jawa",
    namaLatin: "Bos javanicus",
    keywords: ["banteng", "javan banteng", "bos javanicus"],
    kategori: "Mamalia",
    isPrioritas: true,
  },
  {
    namaSpesies: "Macan Tutul Jawa",
    namaLatin: "Panthera pardus melas",
    keywords: ["macan tutul", "macan", "leopard", "panthera pardus"],
    kategori: "Mamalia",
    isPrioritas: true,
  },
  {
    namaSpesies: "Elang Jawa",
    namaLatin: "Nisaetus bartelsi",
    keywords: ["elang", "elang jawa", "nisaetus bartelsi"],
    kategori: "Aves",
    isPrioritas: true,
  },
  {
    namaSpesies: "Merak Hijau",
    namaLatin: "Pavo muticus",
    keywords: ["merak", "merak hijau", "pavo muticus"],
    kategori: "Aves",
    isPrioritas: true,
  },
  {
    namaSpesies: "Penyu Sukamade",
    namaLatin: "Chelonioidea",
    keywords: ["penyu", "penyu lekang", "penyu sisik", "penyu hijau"],
    kategori: "Reptil",
    isPrioritas: true,
  },
  {
    namaSpesies: "Ajag (Anjing Hutan)",
    namaLatin: "Cuon alpinus",
    keywords: ["ajag", "anjing hutan", "cuon alpinus"],
    kategori: "Mamalia",
    isPrioritas: true,
  },
];

async function seedSatwa() {
  console.log("\n========================================");
  console.log("🌱 PROSES SEEDING KOLEKSI SATWA DILINDUNGI...");
  console.log("========================================\n");

  if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI tidak ditemukan!");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ Terhubung ke database: ${conn.connection.name}`);

    // Bersihkan data lama
    await SatwaDilindungi.deleteMany({});
    console.log("🧹 Koleksi 'satwa_dilindungi' dibersihkan.");

    // Insert data baru
    const result = await SatwaDilindungi.insertMany(dataAwalSatwa);
    console.log(`🎉 Berhasil menambahkan ${result.length} data ke koleksi 'satwa_dilindungi'!`);
    console.log("========================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ GAGAL MEMBUAT KOLEKSI:", error);
    process.exit(1);
  }
}

seedSatwa();