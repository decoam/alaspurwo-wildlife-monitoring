import mongoose from "mongoose";
import dotenv from "dotenv";
import SatwaDilindungi from "@/models/SatwaDilindungi";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

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
  if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI tidak ditemukan di file .env!");
    process.exit(1);
  }

  try {
    console.log("Menghubungkan ke MongoDB Cluster...");
    await mongoose.connect(MONGODB_URI);
    console.log("Terhubung!");

    // Bersihkan koleksi 'satwa_dilindungi'
    await SatwaDilindungi.deleteMany({});
    console.log("Koleksi 'satwa_dilindungi' berhasil dibersihkan.");

    // Insert data baru
    const result = await SatwaDilindungi.insertMany(dataAwalSatwa);
    console.log(`Berhasil menambahkan ${result.length} data ke koleksi 'satwa_dilindungi'!`);

    process.exit(0);
  } catch (error) {
    console.error("Gagal melakukan seeding:", error);
    process.exit(1);
  }
}

seedSatwa();