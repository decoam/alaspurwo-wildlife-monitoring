# 🐾 Alas Purwo Wildlife Monitoring System

Sistem Monitoring Satwa Liar berbasis web untuk mendukung proses pendataan, pelaporan, dan pengelolaan data pengamatan satwa di kawasan **Taman Nasional Alas Purwo**.

---

## 📖 Deskripsi

Alas Purwo Wildlife Monitoring System merupakan aplikasi berbasis web yang dirancang untuk membantu digitalisasi proses monitoring satwa liar di Taman Nasional Alas Purwo.

Sistem ini menyediakan dua jenis pengguna utama:

### 👮 Petugas Lapangan

Berfokus pada proses pelaporan pengamatan satwa secara cepat dan sederhana.

### 🏢 Manajemen

Berfokus pada monitoring, rekapitulasi, dan analisis data pengamatan yang dilaporkan oleh petugas.

---

# 🎯 Tujuan

* Digitalisasi proses monitoring satwa liar.
* Mengurangi pencatatan manual.
* Mempermudah rekapitulasi data pengamatan.
* Menyediakan data terpusat untuk kebutuhan konservasi.
* Mendukung pengambilan keputusan berbasis data.

---

# ✨ Fitur Utama

## 👮 Role: Petugas

### Dashboard Petugas

Dashboard sederhana yang difokuskan untuk kebutuhan pelaporan.

### Manajemen Pengamatan

* Tambah Data Pengamatan
* Melihat Riwayat Pengamatan
* Edit Data Pengamatan
* Hapus Data Pengamatan

### Pelaporan Pengamatan

Data yang dapat dicatat:

* Nama Satwa
* Kategori Satwa (otomatis)
* Jumlah Individu
* Lokasi Pengamatan
* Tanggal Pengamatan
* Shift Pengamatan
* Kondisi Cuaca
* Aktivitas Satwa
* Dokumentasi Foto
* Catatan Tambahan

### Upload Dokumentasi

Integrasi Cloudinary untuk penyimpanan foto pengamatan.

---

## 🏢 Role: Manajemen

### Dashboard Monitoring

* Total Pengamatan
* Statistik Pengamatan
* Monitoring Aktivitas Petugas

### Manajemen Data

* Melihat seluruh laporan pengamatan
* Filter dan pencarian data
* Rekapitulasi laporan
* Monitoring aktivitas petugas

### Manajemen Pengguna

* Melihat data petugas
* Monitoring performa pelaporan

---

# 🏗️ Arsitektur Sistem

```text
Petugas
    ↓
Web Application (Next.js)
    ↓
MongoDB Atlas
    ↓
Dashboard Manajemen
    ↓
Monitoring & Rekapitulasi
```

---

# 🗂️ Struktur Project

```bash
src/
│
├── app/
│   ├── dashboard/
│   │   ├── observations/
│   │   ├── profile/
│   │   ├── petugas/
│   │   └── manajemen/
│   │
│   ├── login/
│   ├── register/
│   └── api/
│
├── components/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── observation/
│   └── user/
│
├── lib/
│
├── models/
│
└── types/
```

---

# 🛠️ Tech Stack

## Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* Lucide React

## Backend

* Next.js Server Actions
* Auth.js / NextAuth

## Database

* MongoDB Atlas
* Mongoose

## Cloud Storage

* Cloudinary

---

# 🧩 Database Entities

## User

* username
* password
* fullName
* role
* posPengamatan
* createdAt

## Observation

* namaSatwa
* kategori
* jumlah
* lokasi
* tanggalPengamatan
* shift
* kondisiCuaca
* aktivitasSatwa
* foto
* catatan
* namaPetugas
* createdBy
* createdAt

---

# 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/your-repository.git
cd alaspurwo-wildlife-monitoring
```

### Install Dependencies

```bash
npm install
```

### Setup Environment

Create:

```bash
.env.local
```

Example:

```env
MONGODB_URI=

AUTH_SECRET=

NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

### Run Development Server

```bash
npm run dev
```

---

# 🔐 User Roles

| Role      | Akses                                       |
| --------- | ------------------------------------------- |
| Petugas   | Pelaporan dan pengelolaan data pengamatan   |
| Manajemen | Monitoring, rekapitulasi, dan analisis data |

---

# 📸 Screenshots

## Landing Page

*(Tambahkan screenshot di sini)*

## Dashboard Petugas

*(Tambahkan screenshot di sini)*

## Dashboard Manajemen

*(Tambahkan screenshot di sini)*

## Form Pengamatan

*(Tambahkan screenshot di sini)*

---

# 🌿 Future Development

* Integrasi GIS / Peta Persebaran Satwa
* AI Wildlife Detection
* Export PDF & Excel
* Push Notification
* Mobile Application
* Dashboard Analitik Populasi Satwa
* Integrasi dengan sistem konservasi TN Alas Purwo

---

# 👨‍💻 Developers

### Deco Akbar Maulana

AI Engineer & Fullstack Developer

### Ahmad Bintang Rafli Maulana

Frontend Developer & System Designer

---

# 🎓 Institution

Politeknik Negeri Banyuwangi
Program Studi Teknologi Rekayasa Perangkat Lunak

---

# 🤝 Collaboration

This project is developed as a prototype system to support digital transformation in wildlife monitoring and conservation activities at:

**Balai Taman Nasional Alas Purwo**
Direktorat Jenderal KSDAE
Kementerian Lingkungan Hidup dan Kehutanan Republik Indonesia

---

# 📄 License

This project is developed for educational, research, and conservation purposes.
