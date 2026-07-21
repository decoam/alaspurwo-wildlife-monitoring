import mongoose from "mongoose";
import dotenv from "dotenv";
import ProtectedSpecies from "../models/ProtectedSpecies"; // sesuaikan path model kamu

dotenv.config(); // Untuk membaca MONGODB_URI dari .env

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://<user>:<password>@cluster.mongodb.net/your-db-name";

const initialSpeciesData = [
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

async function seedProtectedSpecies() {
  try {
    console.log("Connecting to MongoDB Cluster...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    // 1. Bersihkan koleksi jika sudah ada (opsional, agar tidak duplikat)
    await ProtectedSpecies.deleteMany({});
    console.log("Cleared existing protected_species collection.");

    // 2. Insert data awal secara otomatis
    const inserted = await ProtectedSpecies.insertMany(initialSpeciesData);
    console.log(`Successfully seeded ${inserted.length} protected species into cluster!`);

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exit(1);
  }
}

seedProtectedSpecies();