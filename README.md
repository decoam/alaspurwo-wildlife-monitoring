# 🐾 Alas Purwo Wildlife Monitoring System

Sistem Monitoring Satwa Liar berbasis web yang digunakan untuk membantu petugas dalam mencatat hasil pengamatan satwa di kawasan **Taman Nasional Alas Purwo** secara digital.

---

## 📌 Tentang Project

Selama proses pengamatan satwa, pencatatan masih banyak dilakukan secara manual. Project ini dibuat untuk membantu petugas agar data observasi dapat tersimpan dengan lebih rapi, mudah diakses, dan lebih aman.

Aplikasi ini dibangun menggunakan **Next.js**, **MongoDB Atlas**, dan **NextAuth** sebagai sistem autentikasi.

---

## ✨ Fitur

- 🔐 Login & Register Petugas
- 👤 Manajemen Akun Petugas
- 🦌 CRUD Data Observasi Satwa
- 📷 Upload Foto Satwa
- 📊 Dashboard Monitoring
- 🔒 Autentikasi menggunakan NextAuth

---

## 👤 Data Petugas

Data yang digunakan pada akun petugas:

- Username
- Password
- Nama Petugas
- Pos Pengamatan

Contoh Pos Pengamatan:

- Pancur
- Sadengan
- Trianggulasi
- Rowobendo
- Ngagelan

---

## 🛠️ Teknologi yang Digunakan

- Next.js 15
- TypeScript
- Tailwind CSS
- NextAuth
- MongoDB Atlas
- Mongoose
- Cloudinary (Upload Gambar)

---

## 📂 Struktur Folder

```text
src
│
├── app
│   ├── dashboard
│   ├── login
│   ├── register
│   └── api
│
├── components
├── lib
├── models
└── middleware.ts
```

---

## 🚀 Cara Menjalankan Project

1. Clone repository

```bash
git clone https://github.com/username/alaspurwo-wildlife-monitoring.git
```

2. Masuk ke folder project

```bash
cd alaspurwo-wildlife-monitoring
```

3. Install dependency

```bash
npm install
```

4. Buat file `.env.local`

```env
MONGODB_URI=
AUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

5. Jalankan aplikasi

```bash
npm run dev
```

Aplikasi dapat diakses melalui:

```
http://localhost:3000
```

---

## 📸 Tampilan Aplikasi

- Landing Page
- Login
- Register
- Dashboard
- Data Observasi
- Tambah Observasi

*(Screenshot akan ditambahkan setelah aplikasi selesai.)*

---

## 🎯 Tujuan Project

Project ini dibuat sebagai tugas individu untuk mengembangkan aplikasi berbasis web menggunakan **Next.js** dengan menerapkan:

- CRUD
- Autentikasi
- Upload Gambar
- Database NoSQL
- UI Modern menggunakan Tailwind CSS

---

## 👨‍💻 Developer

**Deco Akbar M**

Mahasiswa Teknik Informatika

---

## 📄 Lisensi

Project ini dibuat untuk keperluan pembelajaran dan tugas untuk kesiapan magang.