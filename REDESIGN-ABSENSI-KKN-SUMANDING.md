# Spesifikasi Redesign — Absensi KKN Sumanding 2026
### Menyelaraskan Identitas Visual: dari "Dashboard Neon Generik" ke "Digital Identity Desa Sumanding"

---

## 1. Latar Belakang & Tujuan Redesign

Aplikasi saat ini (`absensi-kkn-sumanding.vercel.app`) sudah **matang secara fungsional** — QR session, rekap kehadiran, export data, kontrol jam sesi semua berjalan baik. Masalah utamanya di **identitas visual**: UI memakai bahasa "dark neon dashboard" generik (ungu-cyan-oranye) yang tidak nyambung dengan logo resmi (badge hijau organik berisi hutan pinus & air terjun — dua ikon wisata yang sama dengan yang dipakai di landing page desa Sumanding).

**Tujuan redesign:**
1. Satukan identitas visual absensi ini dengan brand Desa Sumanding secara keseluruhan (selaras dengan spesifikasi landing page desa yang sudah dibuat sebelumnya).
2. Sederhanakan sistem warna dari dekoratif → semantik.
3. Perbaiki kepadatan konten yang berulang (countdown 3x) dan keterbacaan di lapangan (kontras rendah).
4. Jadikan detail "corner-cut" yang sudah ada sebagai signature element yang konsisten, bukan setengah-setengah.

**Prinsip redesign:** Ini bukan ganti total ke tema "desa alami" seperti landing page wisata (KKN adalah tool administratif, harus tetap terasa presisi & efisien untuk dipakai tiap hari oleh 128 anggota) — tapi **warna primer & mood dasarnya harus selaras** dengan brand Sumanding, bukan tema neon-dashboard yang tidak ada hubungannya sama sekali dengan desa.

---

## 2. Design System Baru (Token)

### 2.1 Palet Warna — dari Dekoratif ke Semantik

**Masalah lama:** ungu, cyan, oranye, hijau semua dipakai bersamaan sebagai warna "penting" tanpa aturan, sehingga tidak ada hierarki visual yang jelas.

**Aturan baru — setiap warna punya SATU peran, tidak dobel fungsi:**

| Token | Hex | Peran (SATU fungsi saja) |
|---|---|---|
| `--forest-900` | `#0F1A14` | Background utama — pertahankan gelap, tapi dengan rona hijau-gelap (bukan abu-hitam netral seperti sekarang), agar terasa "hutan malam" bukan "terminal komputer" |
| `--forest-700` | `#1C3324` | Warna card/panel di atas background |
| `--pine-500` | `#3E7A4F` | **Warna primer** — SEMUA tombol aksi utama (Login, Mulai Absensi, Buka Scanner) pakai ini, gradientnya boleh ke `--pine-300` untuk kesan glow, menggantikan gradient ungu yang sekarang |
| `--sprout-400` | `#8FE398` | **Khusus status "hadir/sukses/aktif"** — dipakai HANYA untuk checklist kehadiran, badge "Sesi Aktif", progress bar. Ini sudah kamu pakai dengan benar di tabel rekap — pertahankan, tinggal perluas ke halaman lain secara konsisten |
| `--amber-400` | `#E3A23E` | **Khusus waktu/countdown** — SATU warna saja untuk semua angka countdown (hari/jam/menit/detik), jangan 4 warna berbeda tiap digit seperti sekarang |
| `--rose-500` | `#D9534F` | **Khusus destruktif** — Reset Data, Keluar/Logout. Sudah benar dipakai, pertahankan |
| `--mist-200` | `#D7DDD6` | Teks primer di atas background gelap |
| `--mist-500` | `#9BA79C` | Teks sekunder — **dinaikkan kontrasnya** dari abu-gelap sekarang, supaya tetap terbaca jelas di HP saat siang hari lapangan |

**Yang dihapus/dibatasi:** ungu terang (`purple-500` khas UI kit default) dan cyan tidak lagi dipakai sebagai warna acak di berbagai tempat. Kalau tetap ingin ada 1 warna aksen "berbeda" untuk elemen dekoratif (misal ikon fingerprint), gunakan `--pine-500` yang sama dengan primer — bukan warna baru lagi.

### 2.2 Tipografi

Satukan font di seluruh halaman (landing, login, dashboard admin, dashboard member) — saat ini terindikasi ada inkonsistensi antara headline landing dan judul "PORTAL ANGGOTA" di login.

- **Display/Judul besar:** **Space Grotesk** (bold) — geometris, cocok dengan mood "sistem presisi" yang sudah dibangun, sekaligus tetap modern.
- **Body & label:** **Inter** — netral, sangat terbaca di ukuran kecil (badge hari, label form).
- **Angka penting (countdown, NIM, kode QR, statistik):** **JetBrains Mono** — sudah cocok dengan gaya monospace yang sekarang dipakai, pertahankan tapi terapkan lebih konsisten (saat ini beberapa angka pakai font mono, beberapa tidak).

### 2.3 Signature Element: Corner-Cut, Diterapkan Total

Detail sudut terpotong (clipped corner) di card login sudah bagus dan punya potensi jadi ciri khas visual "Sumanding" (mengingatkan pada bentuk lipatan kertas/segel), tapi sekarang hanya muncul di sebagian tempat.

**Aturan baru:** SEMUA card, tombol besar, dan panel di seluruh aplikasi (landing, login, dashboard admin, dashboard member) memakai potongan sudut yang sama secara konsisten — satu sudut terpotong di kanan-bawah untuk semua elemen card, tanpa terkecuali. Ini yang akan membuat aplikasi terasa "dirancang", bukan "dari template".

**Elemen tambahan (opsional, ringan):** ambil motif garis kontur tipis (dari spesifikasi landing desa) sebagai watermark background yang sangat halus di balik dashboard — menyatukan visual identity antara landing page desa dan aplikasi absensi sebagai satu ekosistem produk.

### 2.4 Ikonografi

Ganti ikon **fingerprint** di landing page (Image 2) — ikon ini menjanjikan otentikasi biometrik padahal sistem login sebenarnya cuma Nama + NIM. Ganti dengan ikon **QR code** atau **badge/kartu anggota**, yang representatif terhadap alur nyata aplikasi (absensi berbasis scan QR, bukan biometrik).

---

## 3. Perbaikan Per Halaman

### 3.1 Landing Page (Image 2)

- Ganti warna gradient tombol "LOGIN" dari ungu → `--pine-500`.
- Satukan warna 4 digit countdown jadi satu warna (`--amber-400`) — saat ini tiap digit (hari/jam/menit/detik) punya warna berbeda (hijau, ungu, cyan, oranye) tanpa alasan fungsional.
- Ganti ikon fingerprint (lihat §2.4).
- Card statistik "Anggota KKN" dan "Sesi Aktif" di kanan: satukan gaya card-nya dengan corner-cut yang konsisten (§2.3).

### 3.2 Login (Image 1)

- Ganti gradient tombol LOGIN dari ungu-violet → `--pine-500` ke `--pine-300`.
- Label "SISTEM ABSENSI TERINTEGRASI" saat ini pakai warna hijau terang (`--sprout-400`) — ini sebenarnya sudah tepat karena itu bukan tombol aksi, biarkan.
- Naikkan kontras placeholder input ("Contoh: Mohamad Alfan Ni'am") sedikit, saat ini agak redup di atas background gelap.

### 3.3 Dashboard Admin (Image 3)

**Masalah kepadatan konten:** widget countdown "Closing of KKN" full-size di paling atas memakan ruang besar padahal bukan tugas utama admin di halaman ini (admin ke sini untuk kelola sesi & lihat rekap).

**Saran:**
- Kecilkan countdown jadi 1 baris ringkas di header (mis. `● H-25 menuju penutupan KKN`) di sebelah judul "DASHBOARD ADMIN", bukan blok besar 4 kotak terpisah.
- Satukan warna tombol "MULAI ABSENSI" dan "BUKA SCANNER" → `--pine-500` (saat ini keduanya ungu, sudah konsisten satu sama lain, tinggal ganti huenya).
- **Tabel Rekap Kehadiran** (bagian paling penting & paling padat):
  - Buat kolom **"NAMA LENGKAP & NIM" sticky/freeze** saat scroll horizontal — dengan 40 kolom hari, kolom nama akan hilang dari pandangan saat admin scroll ke hari-hari terakhir, sangat mengganggu saat cross-check data.
  - Pertimbangkan alternatif tampilan **card per-anggota** khusus mobile (bukan tabel horizontal), karena tabel 40 kolom pada layar HP kecil akan sangat sulit dipakai meski dengan sticky column.
  - Warna hijau/biru/merah pada tombol export & reset (DOWNLOAD XLSX / CSV / RESET DATA) **sudah benar secara semantik** — pertahankan pola ini persis, dan terapkan logika yang sama (1 warna = 1 makna) ke seluruh elemen lain di app.

### 3.4 Dashboard Member (Image 4)

- Sama seperti admin: kecilkan blok countdown jadi ringkas di header.
- Card "SESI AKTIF" (ungu, dengan ikon kamera): ganti ke `--pine-500`, dan konsisten dengan tombol "BUKA MODE SCAN" di bawahnya (sudah gradient ungu-violet yang sama, tinggal ganti hue).
- **Riwayat Kehadiran (grid H1–H40):** sudah bagus secara struktur (hijau untuk hadir, abu untuk belum) — pastikan konsisten pakai `--sprout-400` untuk status hadir dan tambah sedikit kontras pada angka tanggal kecil di tiap kotak (saat ini agak redup, sesuai catatan §2.1 soal `--mist-500`).
- **QR Code "Terkunci":** ikon & teks "TERKUNCI" sudah cukup jelas secara fungsi, tapi kontrasnya rendah — beri sedikit border/glow tipis `--amber-400` supaya jelas ini status "menunggu", bukan error/mati.
- Section "Pengaturan Akun" di paling bawah: field "Kata Sandi (NIM)" ditampilkan sebagai dot tersembunyi — sudah benar secara keamanan dasar UI, pertahankan.

---

## 4. Konsistensi Lintas Produk

Karena aplikasi ini bagian dari ekosistem branding Desa Sumanding (bersama landing page wisata yang sudah dirancang sebelumnya), selaraskan:
- Logo yang sama persis dipakai di navbar landing wisata & absensi.
- Font pairing yang sama (Space Grotesk + Inter + JetBrains Mono) di kedua produk.
- Warna primer hijau pinus yang sama sebagai benang merah brand "Sumanding" — sehingga siapa pun yang pindah dari landing page wisata ke aplikasi absensi (misal panitia KKN mengecek dari link yang sama) langsung merasakan itu satu identitas, bukan dua produk lepas.

---

## 5. Roadmap Implementasi

| Prioritas | Perubahan | Effort |
|---|---|---|
| **Tinggi** | Ganti semua warna ungu/cyan/oranye acak → sistem token baru (§2.1) | Rendah — sebagian besar tinggal ganti nilai warna di Tailwind config/CSS variable, tidak perlu ubah struktur |
| **Tinggi** | Sticky column nama di tabel rekap admin | Sedang — perlu `position: sticky` + shadow separator, uji di scroll horizontal |
| **Sedang** | Ringkas widget countdown di dashboard (dari 4-kotak besar → 1 baris) | Rendah |
| **Sedang** | Ganti ikon fingerprint → QR/badge di landing | Rendah |
| **Sedang** | Terapkan corner-cut konsisten ke semua card | Sedang — perlu bikin 1 komponen `Card.tsx` reusable dengan clip-path/border konsisten, pakai di semua tempat |
| **Rendah** | Tampilan card-per-anggota untuk mobile di tabel rekap | Tinggi — perlu layout kondisional terpisah |
| **Rendah** | Watermark garis kontur halus di background dashboard | Rendah, murni dekoratif |

---

## 6. Catatan untuk AI Coding Assistant

- Mulai dari §2.1 (token warna) — ini perubahan dengan dampak visual terbesar dan effort terkecil, cukup ganti CSS variable/Tailwind theme config tanpa perlu sentuh struktur komponen.
- Saat redesign tabel rekap (§3.3), pastikan fungsi existing (search nama/NIM, export XLSX/CSV, checklist per hari) tidak ada yang rusak — ini murni perbaikan visual & UX scroll, bukan perubahan logika data.
- Buat 1 komponen `Card.tsx` dan `Button.tsx` reusable dengan corner-cut & warna token baru, lalu ganti semua instance card/tombol manual yang tersebar di 4 halaman ini supaya konsisten dari satu sumber, bukan diulang-ulang per halaman.
