"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Film,
  MapPin,
  Heart,
  Star,
  Calendar,
  Users,
  Sparkles,
} from "lucide-react";

// ============================================================
// KONFIGURASI — Ganti dengan data asli Anda
// ============================================================

// ID video YouTube (bagian setelah "?v=" atau "/shorts/")
// Contoh: "dQw4w9WgXcQ" dari https://youtu.be/dQw4w9WgXcQ
const YOUTUBE_VIDEO_ID = "YOUR_VIDEO_ID_HERE";

// Data foto kenang-kenangan
// Ganti `src` dengan path foto asli di /public/memories/ atau URL eksternal
// `tall` = true jika foto potret (lebih tinggi dari lebar)
const PHOTOS: {
  id: number;
  src: string;
  caption: string;
  week: number;
  tall: boolean;
}[] = [
  // Minggu 1 — Kedatangan & Orientasi
  {
    id: 1,
    src: "https://picsum.photos/seed/kkn-s2026-01/800/550",
    caption: "Hari Pertama — Kedatangan di Desa Sumanding",
    week: 1,
    tall: false,
  },
  {
    id: 2,
    src: "https://picsum.photos/seed/kkn-s2026-02/550/750",
    caption: "Malam Perkenalan dengan Warga Desa",
    week: 1,
    tall: true,
  },
  {
    id: 3,
    src: "https://picsum.photos/seed/kkn-s2026-03/800/550",
    caption: "Rapat Koordinasi Program Kerja Pertama",
    week: 1,
    tall: false,
  },
  {
    id: 4,
    src: "https://picsum.photos/seed/kkn-s2026-04/800/600",
    caption: "Kunjungan ke Balai Desa & Pertemuan Aparat",
    week: 1,
    tall: false,
  },
  // Minggu 2 — Program Kerja Dimulai
  {
    id: 5,
    src: "https://picsum.photos/seed/kkn-s2026-05/800/550",
    caption: "Program Bimbingan Belajar Anak-anak SD",
    week: 2,
    tall: false,
  },
  {
    id: 6,
    src: "https://picsum.photos/seed/kkn-s2026-06/550/800",
    caption: "Kerja Bakti Membersihkan Lingkungan Desa",
    week: 2,
    tall: true,
  },
  {
    id: 7,
    src: "https://picsum.photos/seed/kkn-s2026-07/800/600",
    caption: "Pelatihan UMKM untuk Ibu-ibu PKK",
    week: 2,
    tall: false,
  },
  {
    id: 8,
    src: "https://picsum.photos/seed/kkn-s2026-08/750/550",
    caption: "Gotong Royong Pembangunan Fasilitas Desa",
    week: 2,
    tall: false,
  },
  // Minggu 3 — Kegiatan Inti
  {
    id: 9,
    src: "https://picsum.photos/seed/kkn-s2026-09/550/800",
    caption: "Penyuluhan Kesehatan di Posyandu",
    week: 3,
    tall: true,
  },
  {
    id: 10,
    src: "https://picsum.photos/seed/kkn-s2026-10/800/600",
    caption: "Lomba Seni dan Budaya Anak-anak",
    week: 3,
    tall: false,
  },
  {
    id: 11,
    src: "https://picsum.photos/seed/kkn-s2026-11/800/550",
    caption: "Pembuatan Pupuk Organik Bersama Petani",
    week: 3,
    tall: false,
  },
  {
    id: 12,
    src: "https://picsum.photos/seed/kkn-s2026-12/800/600",
    caption: "Malam Keakraban di Posko KKN",
    week: 3,
    tall: false,
  },
  // Minggu 4 — Bakti Sosial
  {
    id: 13,
    src: "https://picsum.photos/seed/kkn-s2026-13/800/550",
    caption: "Bakti Sosial — Pembagian Sembako untuk Warga",
    week: 4,
    tall: false,
  },
  {
    id: 14,
    src: "https://picsum.photos/seed/kkn-s2026-14/550/800",
    caption: "Penanaman Pohon di Tepi Sungai Desa",
    week: 4,
    tall: true,
  },
  {
    id: 15,
    src: "https://picsum.photos/seed/kkn-s2026-15/800/600",
    caption: "Festival Kuliner Tradisional Sumanding",
    week: 4,
    tall: false,
  },
  {
    id: 16,
    src: "https://picsum.photos/seed/kkn-s2026-16/800/550",
    caption: "Pelatihan Digital Marketing untuk Pemuda",
    week: 4,
    tall: false,
  },
  // Minggu 5 — Menuju Penutupan
  {
    id: 17,
    src: "https://picsum.photos/seed/kkn-s2026-17/800/600",
    caption: "Pameran Hasil Program Kerja KKN",
    week: 5,
    tall: false,
  },
  {
    id: 18,
    src: "https://picsum.photos/seed/kkn-s2026-18/550/800",
    caption: "Malam Perpisahan Penuh Haru",
    week: 5,
    tall: true,
  },
  {
    id: 19,
    src: "https://picsum.photos/seed/kkn-s2026-19/800/550",
    caption: "Pemasangan Papan Nama & Rambu Jalan Desa",
    week: 5,
    tall: false,
  },
  {
    id: 20,
    src: "https://picsum.photos/seed/kkn-s2026-20/800/600",
    caption: "Foto Bersama Kepala Desa Sumanding",
    week: 5,
    tall: false,
  },
  // Penutupan
  {
    id: 21,
    src: "https://picsum.photos/seed/kkn-s2026-21/1000/650",
    caption: "Upacara Penutupan Resmi KKN Sumanding 2026",
    week: 6,
    tall: false,
  },
  {
    id: 22,
    src: "https://picsum.photos/seed/kkn-s2026-22/550/800",
    caption: "Tangis Haru Saat Perpisahan",
    week: 6,
    tall: true,
  },
  {
    id: 23,
    src: "https://picsum.photos/seed/kkn-s2026-23/800/600",
    caption: "Foto Keluarga Besar KKN Sumanding 2026",
    week: 6,
    tall: false,
  },
  {
    id: 24,
    src: "https://picsum.photos/seed/kkn-s2026-24/1000/600",
    caption: "Kenangan Abadi — 40 Hari di Bumi Sumanding",
    week: 6,
    tall: false,
  },
];

const WEEK_LABELS: Record<number, string> = {
  1: "Minggu 1 — Kedatangan & Orientasi",
  2: "Minggu 2 — Program Kerja Dimulai",
  3: "Minggu 3 — Kegiatan Inti",
  4: "Minggu 4 — Bakti Sosial",
  5: "Minggu 5 — Menuju Penutupan",
  6: "Penutupan — Selamat Tinggal Sumanding",
};

const TIMELINE = [
  {
    day: "Hari 1",
    date: "26 Juli 2026",
    title: "Pelepasan & Keberangkatan",
    desc: "Upacara pelepasan resmi dari kampus, perjalanan menuju Desa Sumanding penuh semangat.",
    icon: "🚌",
  },
  {
    day: "Hari 7",
    date: "1 Agustus 2026",
    title: "Program Kerja Pertama",
    desc: "Bimbingan belajar pertama untuk anak-anak SD, disambut antusias oleh warga.",
    icon: "📚",
  },
  {
    day: "Hari 14",
    date: "8 Agustus 2026",
    title: "Bakti Sosial & Kerja Bakti",
    desc: "Gotong royong bersama warga membersihkan lingkungan dan membangun fasilitas desa.",
    icon: "🏗️",
  },
  {
    day: "Hari 21",
    date: "15 Agustus 2026",
    title: "Pelatihan Masyarakat",
    desc: "Pelatihan UMKM, digital marketing, dan penyuluhan kesehatan untuk ibu-ibu PKK.",
    icon: "💡",
  },
  {
    day: "Hari 28",
    date: "22 Agustus 2026",
    title: "Festival Budaya Sumanding",
    desc: "Festival kuliner dan seni tradisional yang mempererat ikatan warga dan mahasiswa KKN.",
    icon: "🎉",
  },
  {
    day: "Hari 35",
    date: "29 Agustus 2026",
    title: "Pameran Program Kerja",
    desc: "Pameran hasil 35 hari pengabdian, dihadiri kepala desa dan tokoh masyarakat.",
    icon: "🏆",
  },
  {
    day: "Hari 40",
    date: "4 September 2026",
    title: "Penutupan & Perpisahan",
    desc: "Upacara penutupan penuh haru. 40 hari pengabdian resmi berakhir, kenangan selamanya abadi.",
    icon: "🎓",
  },
];

// ============================================================
// KOMPONEN UTAMA
// ============================================================

export default function MemoriesPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [filterWeek, setFilterWeek] = useState<number | null>(null);
  // Container ref used only in effects, never accessed during render
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredPhotos = filterWeek
    ? PHOTOS.filter((p) => p.week === filterWeek)
    : PHOTOS;

  // ---- Intersection Observer for scroll animations ----
  // Uses querySelectorAll after mount — avoids any ref-during-render issues
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.sectionId;
            if (id) setVisibleSections((prev) => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Query all section elements by data attribute after paint
    const sections = document.querySelectorAll<HTMLElement>("[data-section-id]");
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  // ---- Lightbox handlers ----
  const openLightbox = useCallback((globalIndex: number) => {
    setLightboxIndex(globalIndex);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const prevPhoto = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + filteredPhotos.length) % filteredPhotos.length);
  }, [filteredPhotos.length]);

  const nextPhoto = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % filteredPhotos.length);
  }, [filteredPhotos.length]);

  // ---- Keyboard navigation ----
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, closeLightbox, prevPhoto, nextPhoto]);

  return (
    <div ref={containerRef} className="min-h-screen bg-forest-900 text-mist-200 font-sans overflow-x-hidden">
      {/* ======================================================
          HERO SECTION
      ====================================================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-20">
        {/* Background layers */}
        <div className="absolute inset-0 bg-linear-to-b from-forest-950 via-forest-900 to-forest-800" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-sprout-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-sprout-400/30 to-transparent" />

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(143,227,152,1)_1px,transparent_1px),linear-gradient(90deg,rgba(143,227,152,1)_1px,transparent_1px)] bg-size-[40px_40px]" />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-sprout-400/40"
              style={{
                left: `${(i * 7 + 3) % 100}%`,
                top: `${(i * 11 + 5) % 100}%`,
                animation: `float ${4 + (i % 4)}s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-sprout-400/30 bg-sprout-400/10 text-sprout-400 text-xs font-bold tracking-widest uppercase">
            <Sparkles size={12} />
            <span>KKN Sumanding 2026 — Telah Resmi Selesai</span>
            <Sparkles size={12} />
          </div>

          {/* Main headline */}
          <h1 className="font-display font-bold uppercase tracking-tight leading-[0.9] mb-6">
            <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-2 drop-shadow-xl">
              40 Hari
            </div>
            <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-2 drop-shadow-xl">
              Mengabdi
            </div>
            <div
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-sprout-400"
              style={{ textShadow: "0 0 40px rgba(143,227,152,0.4)" }}
            >
              Sepenuh Hati.
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-mist-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            26 Juli – 4 September 2026 · Desa Sumanding · Kenangan yang tidak akan pernah terlupakan
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-10">
            {[
              { icon: Calendar, label: "Hari Pengabdian", value: "40" },
              { icon: Users, label: "Anggota KKN", value: "20+" },
              { icon: MapPin, label: "Desa Sumanding", value: "2026" },
              { icon: Heart, label: "Kenangan Abadi", value: "∞" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon size={16} className="text-sprout-400" />
                <span className="text-2xl sm:text-3xl font-black font-mono text-sprout-400">
                  {value}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-mist-500">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Scroll cue */}
          <div className="flex flex-col items-center gap-2 animate-bounce text-mist-600">
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Gulir untuk melihat kenangan
            </span>
            <div className="w-px h-8 bg-linear-to-b from-mist-600 to-transparent" />
          </div>
        </div>
      </section>

      {/* ======================================================
          VIDEO SECTION
      ====================================================== */}
      <section
        data-section-id="video"
        className={`relative py-20 px-4 transition-all duration-1000 ${
          isVisible("video") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-px bg-sprout-400" />
            <div className="flex items-center gap-2 text-sprout-400">
              <Film size={18} />
              <span className="text-xs font-bold tracking-widest uppercase">
                Video Highlight
              </span>
            </div>
            <div className="flex-1 h-px bg-forest-700" />
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight mb-4">
            Perjalanan 40 Hari
            <br />
            <span className="text-sprout-400">dalam 5 Menit.</span>
          </h2>
          <p className="text-mist-500 text-sm mb-10 max-w-xl">
            Rangkuman visual seluruh perjalanan KKN Sumanding 2026 — dari hari
            pertama hingga penutupan yang penuh haru.
          </p>

          {/* Video embed */}
          <div className="relative w-full aspect-video bg-forest-800 border border-forest-700 shadow-2xl overflow-hidden group cursor-pointer">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-sprout-400 z-10" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-sprout-400 z-10" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-sprout-400 z-10" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-sprout-400 z-10" />

            {!videoPlaying ? (
              /* Thumbnail / play button */
              <div
                className="absolute inset-0 flex items-center justify-center bg-forest-900/80 z-20"
                onClick={() => setVideoPlaying(true)}
              >
                {/* Background thumbnail */}
                <Image
                  src="https://picsum.photos/seed/kkn-video-cover/1280/720"
                  alt="Video thumbnail KKN Sumanding 2026"
                  fill
                  className="object-cover opacity-30"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
                {/* Play button */}
                <div className="relative z-10 flex flex-col items-center gap-4 group/play">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-sprout-400/20 border-2 border-sprout-400 flex items-center justify-center group-hover/play:bg-sprout-400/30 transition-all duration-300 group-hover/play:scale-110">
                    <div className="w-0 h-0 border-t-10 border-b-10 border-l-18 border-t-transparent border-b-transparent border-l-sprout-400 ml-1" />
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase text-sprout-400">
                    Putar Video Highlight
                  </span>
                </div>
              </div>
            ) : (
              /* YouTube embed */
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                title="Video Highlight KKN Sumanding 2026"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          {/* Note for admin */}
          <p className="text-mist-600 text-[10px] mt-4 text-center">
            💡 Ganti{" "}
            <code className="bg-forest-800 px-1 py-0.5 text-sprout-400">
              YOUTUBE_VIDEO_ID
            </code>{" "}
            di{" "}
            <code className="bg-forest-800 px-1 py-0.5 text-sprout-400">
              MemoriesPage.tsx
            </code>{" "}
            dengan ID video YouTube Anda
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="relative py-4">
        <div className="h-px bg-linear-to-r from-transparent via-forest-700 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-forest-900 px-4">
          <Star size={14} className="text-sprout-400/50" />
        </div>
      </div>

      {/* ======================================================
          GALLERY SECTION
      ====================================================== */}
      <section
        data-section-id="gallery"
        className={`py-20 px-4 transition-all duration-1000 delay-200 ${
          isVisible("gallery") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-sprout-400" />
            <div className="flex items-center gap-2 text-sprout-400">
              <Camera size={18} />
              <span className="text-xs font-bold tracking-widest uppercase">
                Galeri Foto
              </span>
            </div>
            <div className="flex-1 h-px bg-forest-700" />
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tight mb-2">
            Momen yang
            <br />
            <span className="text-sprout-400">Tak Terlupakan.</span>
          </h2>
          <p className="text-mist-500 text-sm mb-8 max-w-xl">
            {PHOTOS.length} foto terpilih dari 40 hari penuh kenangan bersama warga Desa Sumanding.
          </p>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setFilterWeek(null)}
              className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all duration-200 cursor-pointer ${
                filterWeek === null
                  ? "bg-sprout-400 text-forest-900 border-sprout-400"
                  : "bg-transparent text-mist-400 border-forest-600 hover:border-sprout-400/50 hover:text-mist-200"
              }`}
              style={{
                clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
              }}
            >
              Semua ({PHOTOS.length})
            </button>
            {Object.entries(WEEK_LABELS).map(([week, label]) => {
              const count = PHOTOS.filter((p) => p.week === Number(week)).length;
              return (
                <button
                  key={week}
                  onClick={() => setFilterWeek(Number(week))}
                  className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all duration-200 cursor-pointer ${
                    filterWeek === Number(week)
                      ? "bg-sprout-400 text-forest-900 border-sprout-400"
                      : "bg-transparent text-mist-400 border-forest-600 hover:border-sprout-400/50 hover:text-mist-200"
                  }`}
                  style={{
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
                >
                  {label.split(" — ")[0]} ({count})
                </button>
              );
            })}
          </div>

          {/* Masonry Photo Grid */}
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {filteredPhotos.map((photo, idx) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={idx}
                onClick={() => openLightbox(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative py-4">
        <div className="h-px bg-linear-to-r from-transparent via-forest-700 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-forest-900 px-4">
          <Star size={14} className="text-sprout-400/50" />
        </div>
      </div>

      {/* ======================================================
          TIMELINE SECTION
      ====================================================== */}
      <section
        data-section-id="timeline"
        className={`py-20 px-4 transition-all duration-1000 delay-100 ${
          isVisible("timeline") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-px bg-sprout-400" />
            <div className="flex items-center gap-2 text-sprout-400">
              <Calendar size={18} />
              <span className="text-xs font-bold tracking-widest uppercase">
                Timeline Perjalanan
              </span>
            </div>
            <div className="flex-1 h-px bg-forest-700" />
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tight mb-12">
            40 Hari Penuh
            <br />
            <span className="text-sprout-400">Cerita.</span>
          </h2>

          <div className="relative">
            {/* Timeline spine */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-linear-to-b from-sprout-400 via-pine-500 to-forest-700" />

            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative flex gap-6 group">
                  {/* Dot */}
                  <div className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-forest-800 border-2 border-forest-700 group-hover:border-sprout-400 transition-colors flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-2 pt-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="text-[10px] font-bold text-sprout-400 tracking-widest uppercase bg-sprout-400/10 px-2 py-0.5 border border-sprout-400/30">
                        {item.day}
                      </span>
                      <span className="text-[10px] font-mono text-mist-500">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-white text-lg mb-1">
                      {item.title}
                    </h3>
                    <p className="text-mist-500 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CLOSING SECTION
      ====================================================== */}
      <section
        data-section-id="closing"
        className={`relative py-28 px-4 text-center overflow-hidden transition-all duration-1000 delay-200 ${
          isVisible("closing") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-t from-forest-950 via-forest-900 to-forest-800" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-sprout-400/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-5xl mb-6">🎓</div>

          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-sprout-400/30 bg-sprout-400/10 text-sprout-400 text-xs font-bold tracking-widest uppercase">
            <Heart size={12} />
            <span>Terima Kasih, Sumanding</span>
            <Heart size={12} />
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight mb-6 leading-tight">
            Bukan Sekadar
            <br />
            Kewajiban.
            <br />
            <span className="text-sprout-400">Ini adalah Rumah.</span>
          </h2>

          <p className="text-mist-400 text-base sm:text-lg leading-relaxed mb-10">
            Empat puluh hari terasa sebentar, namun jejak yang kami tinggalkan —
            dan kenangan yang kami bawa — akan bertahan selamanya. Terima kasih,
            Desa Sumanding, untuk setiap tawa, setiap gotong royong, dan setiap
            momen berharga bersama.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <div className="px-4 py-2 border border-forest-600 text-mist-500 text-xs font-mono">
              26 Juli 2026
            </div>
            <div className="w-12 h-px bg-sprout-400/50" />
            <div className="px-4 py-2 border border-sprout-400/40 text-sprout-400 text-xs font-mono bg-sprout-400/10">
              4 September 2026
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center gap-2 text-mist-500 text-sm mb-10">
            <MapPin size={16} className="text-sprout-400" />
            <span>Desa Sumanding, Jawa Tengah · KKN 2026</span>
          </div>

          {/* Back to absensi (for Verri) */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-6 py-3 border border-forest-600 text-mist-500 hover:border-sprout-400/50 hover:text-mist-200 transition-all text-xs font-bold tracking-widest uppercase"
            style={{
              clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
            }}
          >
            <span>Portal Absensi</span>
            <span className="text-sprout-400/50">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-forest-800">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Image
              src="/newlogokkn.png"
              alt="Logo KKN"
              width={32}
              height={32}
              className="object-contain opacity-60"
            />
            <span className="text-[10px] font-bold tracking-widest text-mist-600 uppercase">
              KKN Sumanding 2026
            </span>
          </div>
          <span className="text-[10px] text-mist-600 font-mono">
            40 Hari · 1 Keluarga · Kenangan Abadi
          </span>
        </div>
      </footer>

      {/* ======================================================
          LIGHTBOX
      ====================================================== */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-forest-950/95 backdrop-blur-md" />

          {/* Content */}
          <div
            className="relative z-10 max-w-5xl w-full mx-4 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="w-full flex items-center justify-between mb-3 px-2">
              <span className="text-[10px] font-mono text-mist-500">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
              <button
                onClick={closeLightbox}
                className="w-8 h-8 flex items-center justify-center text-mist-400 hover:text-white hover:bg-forest-700 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Image container */}
            <div className="relative w-full max-h-[70vh] flex items-center justify-center">
              <div
                className="relative w-full max-h-[70vh]"
                style={{
                  aspectRatio: filteredPhotos[lightboxIndex].tall ? "3/4" : "4/3",
                  maxWidth: filteredPhotos[lightboxIndex].tall ? "400px" : "100%",
                  border: "1px solid rgba(62,122,79,0.3)",
                }}
              >
                <Image
                  src={filteredPhotos[lightboxIndex].src}
                  alt={filteredPhotos[lightboxIndex].caption}
                  fill
                  className="object-contain shadow-2xl"
                  sizes="(max-width: 800px) 100vw, 800px"
                />
              </div>

              {/* Prev button */}
              <button
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="absolute left-0 sm:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-forest-800/80 border border-forest-700 text-mist-400 hover:text-sprout-400 hover:border-sprout-400/50 transition-all cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Next button */}
              <button
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="absolute right-0 sm:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-forest-800/80 border border-forest-700 text-mist-400 hover:text-sprout-400 hover:border-sprout-400/50 transition-all cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Caption */}
            <div className="mt-4 text-center px-4">
              <p className="text-mist-200 text-sm font-medium mb-1">
                {filteredPhotos[lightboxIndex].caption}
              </p>
              <span className="text-[10px] font-bold tracking-widest text-sprout-400 uppercase">
                {WEEK_LABELS[filteredPhotos[lightboxIndex].week]}
              </span>
            </div>

            {/* Keyboard hint */}
            <p className="mt-3 text-[10px] text-mist-600">
              ← → untuk navigasi · Esc untuk tutup
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SUB-KOMPONEN: PhotoCard
// ============================================================

function PhotoCard({
  photo,
  index,
  onClick,
}: {
  photo: (typeof PHOTOS)[0];
  index: number;
  onClick: () => void;
}) {
  return (
    <div
      className="break-inside-avoid mb-3 relative overflow-hidden group cursor-pointer bg-forest-800 border border-forest-700 hover:border-sprout-400/50 transition-all duration-300"
      onClick={onClick}
      style={{
        clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
      }}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-sprout-400/0 group-hover:border-sprout-400/80 transition-all duration-300 z-10" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-sprout-400/0 group-hover:border-sprout-400/80 transition-all duration-300 z-10" />

      {/* Image with proper Next.js Image component */}
      <div className={`relative w-full ${photo.tall ? "aspect-3/4" : "aspect-4/3"}`}>
        <Image
          src={photo.src}
          alt={photo.caption}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-forest-950/90 via-forest-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
        <div>
          <p className="text-white text-xs font-medium leading-tight mb-1">
            {photo.caption}
          </p>
          <span className="text-[9px] font-bold tracking-widest text-sprout-400 uppercase">
            {WEEK_LABELS[photo.week]?.split(" — ")[0]}
          </span>
        </div>
      </div>

      {/* Index badge */}
      <div className="absolute top-2 right-2 w-5 h-5 bg-forest-900/70 text-[8px] font-mono text-mist-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {index + 1}
      </div>
    </div>
  );
}
