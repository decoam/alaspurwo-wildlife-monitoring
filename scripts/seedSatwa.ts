import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Satwa from "@/models/Satwa";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

const dataMasterSatwa = [
  // --- SATWA DILINDUNGI ---
  {
    namaSpesies: "Banteng Jawa",
    namaLatin: "Bos javanicus",
    keywords: ["banteng", "javan banteng", "bos javanicus"],
    kategori: "Mamalia",
    isProtected: true,
    statusPerlindungan: "Permen LHK P.106/2018",
  },
  {
    namaSpesies: "Macan Tutul Jawa",
    namaLatin: "Panthera pardus melas",
    keywords: ["macan tutul", "macan", "leopard", "panthera pardus"],
    kategori: "Mamalia",
    isProtected: true,
    statusPerlindungan: "Permen LHK P.106/2018",
  },
  {
    namaSpesies: "Elang Jawa",
    namaLatin: "Nisaetus bartelsi",
    keywords: ["elang", "elang jawa", "nisaetus bartelsi"],
    kategori: "Aves",
    isProtected: true,
    statusPerlindungan: "Permen LHK P.106/2018",
  },
  {
    namaSpesies: "Merak Hijau",
    namaLatin: "Pavo muticus",
    keywords: ["merak", "merak hijau", "pavo muticus"],
    kategori: "Aves",
    isProtected: true,
    statusPerlindungan: "Permen LHK P.106/2018",
  },
  {
    namaSpesies: "Penyu Sukamade",
    namaLatin: "Chelonioidea",
    keywords: ["penyu", "penyu lekang", "penyu sisik", "penyu hijau"],
    kategori: "Reptil",
    isProtected: true,
    statusPerlindungan: "Permen LHK P.106/2018",
  },
  {
    namaSpesies: "Ajag (Anjing Hutan)",
    namaLatin: "Cuon alpinus",
    keywords: ["ajag", "anjing hutan", "cuon alpinus"],
    kategori: "Mamalia",
    isProtected: true,
    statusPerlindungan: "Permen LHK P.106/2018",
  },

  // --- SATWA TIDAK DILINDUNGI ---
  {
    namaSpesies: "Monyet Ekor Panjang",
    namaLatin: "Macaca fascicularis",
    keywords: ["monyet", "monyet ekor panjang", "macaca"],
    kategori: "Mamalia",
    isProtected: false,
    statusPerlindungan: "Tidak Dilindungi (Risiko Rendah / IUCN LC)",
  },
  {
    namaSpesies: "Babi Hutan",
    namaLatin: "Sus scrofa",
    keywords: ["babi", "babi hutan", "celeng", "sus scrofa"],
    kategori: "Mamalia",
    isProtected: false,
    statusPerlindungan: "Tidak Dilindungi",
  },
  {
    namaSpesies: "Ayam Hutan Merah",
    namaLatin: "Gallus gallus",
    keywords: ["ayam hutan", "ayam hutan merah", "gallus gallus"],
    kategori: "Aves",
    isProtected: false,
    statusPerlindungan: "Tidak Dilindungi",
  },
  {
    namaSpesies: "Lutra / Berang-Berang",
    namaLatin: "Lutra lutra",
    keywords: ["lutra", "berang-berang", "otter"],
    kategori: "Mamalia",
    isProtected: false,
    statusPerlindungan: "Tidak Dilindungi",
  }
];

async function seedSatwa() {
  console.log("\n========================================");
  console.log("🌱 PROSES SEEDING KOLEKSI SATWA UNIVERSAL...");
  console.log("========================================\n");

  if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI tidak ditemukan di file .env.local!");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ Terhubung ke database: ${conn.connection.name}`);

    // Clean data lama
    await Satwa.deleteMany({});
    console.log("🧹 Koleksi 'satwa' berhasil dibersihkan.");

    // Insert data master
    const result = await Satwa.insertMany(dataMasterSatwa);
    console.log(`🎉 Berhasil menambahkan ${result.length} data spesies ke koleksi 'satwa'!`);
    console.log("========================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ GAGAL SEEDING KOLEKSI SATWA:", error);
    process.exit(1);
  }
}

seedSatwa();