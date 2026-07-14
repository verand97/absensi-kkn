# Panduan Lengkap Deployment ke Vercel

Panduan ini akan membantu Anda mengunggah (deploy) aplikasi Absensi KKN Sumanding 2026 ke Vercel dan mengatur database Vercel Postgres agar data absensi tersimpan dengan aman di internet.

---

## Langkah 1: Persiapan Repository (GitHub)
Sebelum masuk ke Vercel, pastikan semua kode (termasuk folder ini) sudah diunggah ke repository GitHub Anda.
1. Buka [GitHub](https://github.com/) dan buat repository baru (misal: `absensi-kkn-sumanding-2026`).
2. Jalankan perintah ini di terminal VSCode Anda (jika belum pernah di-push):
   ```bash
   git init
   git add .
   git commit -m "Upload proyek perdana"
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/absensi-kkn-sumanding-2026.git
   git push -u origin main
   ```

---

## Langkah 2: Deployment Awal di Vercel
1. Buka [Vercel](https://vercel.com/) dan masuk/login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Cari repository `absensi-kkn-sumanding-2026` dari daftar, lalu klik tombol **"Import"**.
4. Biarkan semua pengaturan standar (Framework: Next.js).
5. Klik **"Deploy"** dan tunggu sekitar 1-2 menit hingga selesai.
6. **Catatan:** Pada tahap ini, web akan berhasil terbuka, tetapi saat Anda mencoba login atau membuka database, akan muncul pesan *Error* karena kita belum menyambungkan databasenya. Lanjut ke Langkah 3!

---

## Langkah 3: Setup Vercel Postgres (Database)
Karena Vercel tidak bisa menggunakan database SQLite bawaan proyek ini (file `dev.db`), kita harus menggunakan database awan (cloud) resmi mereka yaitu **Vercel Postgres**.

1. Di dasbor project Vercel Anda, klik tab **"Storage"** yang ada di bagian atas.
2. Klik **"Create Database"** dan pilih **"Postgres"**.
3. Beri nama databasenya (misal: `absensi_db`) lalu klik "Create".
4. Vercel secara otomatis akan menambahkan kunci akses (Environment Variables) ke proyek Anda, yang salah satunya adalah `DATABASE_URL`.

---

## Langkah 4: Sinkronisasi Skema ke Postgres
Sekarang kita harus menyambungkan laptop Anda ke database Vercel Postgres tersebut untuk memasukkan struktur tabel dan data daftar anggota KKN.

1. Buka tab **"Settings" > "Environment Variables"** di Vercel atau tab `.env.local` pada halaman Storage Anda tadi.
2. Salin nilai dari variabel `POSTGRES_PRISMA_URL` atau `DATABASE_URL` yang diberikan oleh Vercel (bentuknya kira-kira `postgres://default:xxx...`).
3. Kembali ke proyek di komputer Anda, buka file `.env` dan ganti isinya menjadi URL yang baru Anda salin:
   ```env
   DATABASE_URL="postgres://default:xyz123@ep-cool-butterfly-1234.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
   ```
4. Buka file `prisma/schema.prisma` di laptop Anda, cari baris kode ini (biasanya di paling atas):
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
   **Ganti tulisan `"sqlite"` menjadi `"postgresql"`**
5. Buka terminal di laptop Anda, lalu jalankan perintah ini untuk memasukkan struktur tabel ke Vercel Postgres:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

## Langkah 5: Masukkan Data Anggota (Seeding)
Struktur database di Vercel sudah siap, tapi datanya masih kosong. Untuk memasukkan nama-nama anggota ke dalamnya, cukup jalankan perintah:

```bash
node seed.js
```
Jika muncul pesan `Database seeded with members.`, artinya semua daftar anggota (termasuk 2 admin) sudah berhasil masuk ke database Vercel Anda.

---

## Langkah 6: Update ke Vercel (Finalisasi)
Karena Anda baru saja mengganti `provider = "sqlite"` menjadi `postgresql` di file `schema.prisma`, Anda harus meng-*update* proyek Vercel Anda:

1. Simpan semua file yang diubah (`schema.prisma`).
2. Masukkan perubahan tersebut ke GitHub:
   ```bash
   git add .
   git commit -m "Ubah database ke PostgreSQL untuk Vercel"
   git push
   ```
3. Vercel akan secara otomatis mendeteksi perubahan tersebut dan men-*deploy* ulang proyek Anda.

🎉 **SELESAI!**
Tunggu beberapa menit hingga Vercel selesai memprosesnya. Kini aplikasi absensi Anda siap digunakan secara *online* oleh teman-teman KKN!
