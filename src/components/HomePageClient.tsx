"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Activity,
  QrCode,
  ArrowUpRight,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import CountdownTimer from "@/components/CountdownTimer";
import MemoriesPage from "@/components/MemoriesPage";

// Target date harus sama dengan CountdownTimer
const TARGET_DATE = "2026-09-04T23:59:59+07:00";

interface HomePageClientProps {
  totalMembers: number;
  currentDay: number;
  progressPercent: number;
  isActive: boolean;
  todayFullFormatted: string;
  todayDayName: string;
}

export default function HomePageClient({
  totalMembers,
  currentDay,
  progressPercent,
  isActive,
  todayFullFormatted,
  todayDayName,
}: HomePageClientProps) {
  // Check apakah countdown sudah selesai (client-side)
  const [memoriesMode, setMemoriesMode] = useState(() => {
    return new Date().getTime() >= new Date(TARGET_DATE).getTime();
  });

  useEffect(() => {
    if (memoriesMode) return;

    // Poll setiap detik untuk mendeteksi countdown selesai secara real-time
    const interval = setInterval(() => {
      if (new Date().getTime() >= new Date(TARGET_DATE).getTime()) {
        setMemoriesMode(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [memoriesMode]);

  // Ketika countdown selesai, tampilkan halaman kenang-kenangan
  if (memoriesMode) {
    return <MemoriesPage />;
  }

  // ---- Halaman absensi (tampilan saat ini) ----
  return (
    <div className="min-h-screen lg:h-screen w-full lg:w-screen overflow-y-auto lg:overflow-hidden bg-slate-50 dark:bg-forest-900 text-slate-900 dark:text-mist-200 font-sans relative selection:bg-sprout-400/30">
      {/* Background Gradients & Textures */}
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-pine-500/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-sprout-400/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Grid Lines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Tech Accent Lines */}
      <div className="absolute bottom-[4%] right-[5%] hidden md:flex gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-pine-500" />
        <div className="w-1.5 h-1.5 rounded-full bg-pine-500" />
        <div className="w-1.5 h-1.5 rounded-full bg-pine-500" />
        <div className="w-1.5 h-1.5 rounded-full bg-pine-500" />
      </div>
      <div className="absolute bottom-[4%] right-[8%] hidden md:block w-32 h-px bg-slate-200 dark:bg-forest-700" />

      <div className="container mx-auto px-4 md:px-6 h-full flex flex-col relative z-10 py-3 md:py-5">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-2 md:mb-6 shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center justify-center shrink-0">
              <Image
                src="/newlogokkn.png"
                alt="Logo KKN"
                width={64}
                height={64}
                className="object-contain w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_0_10px_rgba(143,227,152,0.3)]"
              />
            </div>

            {/* Mobile Logo Text */}
            <div className="flex flex-col leading-[1.1] md:hidden">
              <span className="font-bold font-display text-xs tracking-widest text-slate-900 dark:text-white uppercase">
                KKN
              </span>
              <span className="font-medium text-[8px] tracking-widest text-slate-600 dark:text-mist-500 uppercase">
                SUMANDING
              </span>
              <span className="font-bold font-mono text-xs tracking-widest text-sprout-400">
                2026
              </span>
            </div>

            {/* Desktop Logo Text */}
            <div className="hidden md:flex flex-col leading-none">
              <span className="font-bold font-display text-base tracking-widest text-slate-900 dark:text-white uppercase">
                KKN SUMANDING
              </span>
              <span className="font-bold font-mono text-base tracking-widest text-sprout-400">
                2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </nav>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-3 lg:gap-8 flex-1 min-h-0 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start relative z-20 w-full h-full justify-start lg:justify-center overflow-hidden py-1 lg:py-0">
            {/* Mobile QR Background overlay */}
            <div className="absolute top-2 right-[-8%] w-40 h-40 lg:hidden flex items-center justify-center opacity-[0.12] pointer-events-none overflow-hidden z-[-1]">
              <div className="absolute w-40 h-40 border border-pine-500/40 rounded-full" />
              <div className="absolute w-28 h-28 border border-sprout-400/50 rounded-full border-dashed" />
              <QrCode className="w-16 h-16 text-sprout-400" strokeWidth={1} />
            </div>

            {/* Tag Pill */}
            <div
              className="relative inline-flex items-center gap-3 mb-2 md:mb-4 p-px bg-slate-200 dark:bg-forest-700"
              style={{
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div
                className="flex items-center gap-2 md:gap-3 px-2.5 py-1 md:px-3 md:py-1.5 bg-slate-100 dark:bg-forest-800"
                style={{
                  clipPath:
                    "polygon(11px 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%, 0 11px)",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-sprout-400 shadow-[0_0_8px_#8FE398]" />
                <span className="text-[8px] md:text-xs font-bold tracking-widest text-slate-700 dark:text-mist-200 uppercase">
                  Sistem Absensi Terintegrasi
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] font-bold font-display uppercase tracking-tight leading-[0.95] mb-2 md:mb-4">
              <div className="text-slate-900 dark:text-white drop-shadow-md">
                REKAM
              </div>
              <div className="text-slate-900 dark:text-white drop-shadow-md">
                KEHADIRAN
              </div>
              <div className="text-pine-500 dark:text-sprout-400 drop-shadow-[0_0_20px_rgba(143,227,152,0.3)]">
                LEBIH CEPAT.
              </div>
            </h1>

            {/* Description */}
            <p className="text-slate-600 dark:text-mist-500 text-[11px] md:text-sm lg:text-base max-w-md mb-2.5 md:mb-5 leading-snug pr-2 md:pr-0">
              Platform absensi modern yang dirancang khusus untuk peserta KKN
              Sumanding 2026. Mendukung pemindaian QR Code cepat dan rekapan
              otomatis selama 40 hari pengabdian.
            </p>

            {/* Countdown Widget */}
            <div className="w-full max-w-md mb-2.5 md:mb-5">
              <CountdownTimer title="COUNTDOWN TO THE CLOSING OF KKN (04 SEPT 2026)" />
            </div>

            {/* Call to Action Button */}
            <div className="flex items-center gap-4 group cursor-pointer mb-2.5 lg:mb-0">
              <Link
                href="/dashboard"
                className="relative p-px bg-pine-500 group-hover:bg-sprout-400 transition-colors"
                style={{
                  clipPath:
                    "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                }}
              >
                <div
                  className="flex items-stretch bg-forest-800 group-hover:bg-forest-700 transition-colors"
                  style={{
                    clipPath:
                      "polygon(11px 0, calc(100% - 11px) 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 11px 100%, 0 calc(100% - 11px), 0 11px)",
                  }}
                >
                  <div className="px-6 py-2 md:px-8 md:py-3.5 font-bold tracking-widest text-white text-[11px] md:text-sm flex items-center justify-center">
                    LOGIN
                  </div>
                  <div className="px-3 py-2 md:px-4 md:py-3.5 border-l border-slate-300 dark:border-pine-500/40 flex items-center justify-center bg-slate-200/50 dark:bg-white/5">
                    <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-sprout-400" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Location (Desktop Only) */}
            <div className="mt-6 hidden md:flex items-center gap-3">
              <MapPin className="w-5 h-5 text-sprout-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-600 dark:text-mist-500 tracking-widest uppercase">
                  Sumanding
                </span>
                <span className="text-[10px] font-bold font-mono text-sprout-400 tracking-widest uppercase">
                  2026
                </span>
              </div>
            </div>

            {/* Mobile Compact Stat Row */}
            <div className="grid grid-cols-3 gap-1.5 w-full lg:hidden mt-2">
              <div className="flex flex-col items-center justify-center p-1.5 bg-slate-100 dark:bg-forest-800 rounded-lg border border-slate-200 dark:border-forest-700 shadow-md">
                <Users className="w-3.5 h-3.5 text-sprout-400 mb-0.5" />
                <span className="text-sm sm:text-base font-black font-mono text-sprout-400 leading-none">
                  {totalMembers}
                </span>
                <span className="text-[7px] font-bold text-slate-500 dark:text-mist-500 tracking-wide uppercase mt-0.5 text-center">
                  Anggota
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-1.5 bg-slate-100 dark:bg-forest-800 rounded-lg border border-slate-200 dark:border-forest-700 shadow-md">
                <Calendar className="w-3.5 h-3.5 text-sprout-400 mb-0.5" />
                <span className="text-sm sm:text-base font-black font-mono text-sprout-400 leading-none">
                  H-{currentDay}
                </span>
                <span className="text-[7px] font-bold text-slate-500 dark:text-mist-500 tracking-wide uppercase mt-0.5 text-center">
                  {todayDayName}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-1.5 bg-slate-100 dark:bg-forest-800 rounded-lg border border-slate-200 dark:border-forest-700 shadow-md">
                <Activity className="w-3.5 h-3.5 text-sprout-400 mb-0.5" />
                <span className="text-sm sm:text-base font-black font-mono text-sprout-400 leading-none">
                  {progressPercent}%
                </span>
                <span className="text-[7px] font-bold text-slate-500 dark:text-mist-500 tracking-wide uppercase mt-0.5 text-center">
                  {currentDay}/40 Hari
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Desktop Dashboard Cards */}
          <div className="hidden lg:block lg:col-span-6 relative h-full max-h-[85vh] w-full z-10">
            {/* SVG Gradient Defs */}
            <svg width="0" height="0" className="absolute">
              <linearGradient
                id="forest-sprout-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop stopColor="#3E7A4F" offset="0%" />
                <stop stopColor="#8FE398" offset="100%" />
              </linearGradient>
            </svg>

            {/* Circular Grid Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 xl:w-96 xl:h-96 border border-slate-200 dark:border-forest-700/60 rounded-full flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 xl:w-64 xl:h-64 border border-slate-300 dark:border-pine-500/30 rounded-full border-dashed" />
              <div className="absolute w-96 xl:w-md h-px bg-slate-200 dark:bg-forest-700/40 rotate-45" />
              <div className="absolute w-96 xl:w-md h-px bg-slate-200 dark:bg-forest-700/40 -rotate-45" />
            </div>

            {/* Card 1: ANGGOTA KKN */}
            <div
              className="absolute top-0 right-0 xl:right-4 w-56 xl:w-70 p-px bg-slate-200 dark:bg-forest-700 shadow-2xl"
              style={{
                clipPath:
                  "polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)",
              }}
            >
              <div
                className="bg-white dark:bg-forest-800 p-4 xl:p-5 h-full flex justify-between items-start"
                style={{
                  clipPath:
                    "polygon(17px 0, 100% 0, 100% calc(100% - 17px), calc(100% - 17px) 100%, 0 100%, 0 17px)",
                }}
              >
                <div>
                  <div className="text-[9px] font-bold text-slate-600 dark:text-mist-500 tracking-widest uppercase mb-1">
                    Anggota KKN
                  </div>
                  <div className="text-xs xl:text-sm font-bold font-display text-slate-900 dark:text-white mb-2">
                    Sumanding 2026
                  </div>
                  <div className="text-3xl xl:text-4xl font-black font-mono text-sprout-400 mb-1">
                    {totalMembers}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-mist-500">
                    Anggota Aktif
                  </div>
                </div>
                <Users
                  className="w-12 h-12 xl:w-14 xl:h-14 drop-shadow-[0_0_15px_rgba(143,227,152,0.3)] mt-2"
                  stroke="url(#forest-sprout-grad)"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Card 2: KEHADIRAN HARI INI */}
            <div
              className="absolute top-[42%] left-0 -translate-y-1/2 w-46 xl:w-56 p-px bg-slate-200 dark:bg-forest-700 shadow-2xl z-20"
              style={{
                clipPath:
                  "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
              }}
            >
              <div
                className="bg-white dark:bg-forest-800 p-4 h-full"
                style={{
                  clipPath:
                    "polygon(13px 0, 100% 0, 100% calc(100% - 13px), calc(100% - 13px) 100%, 0 100%, 0 13px)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-3.5 h-3.5 text-sprout-400" />
                  <span className="text-[9px] font-bold text-slate-600 dark:text-mist-500 tracking-widest uppercase">
                    Kehadiran Hari Ini
                  </span>
                </div>
                <div className="text-lg xl:text-xl font-bold font-mono text-sprout-400 mb-1">
                  Hari ke-{currentDay}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-mist-500">
                  {todayFullFormatted}
                </div>
              </div>
            </div>

            {/* Card 3: SESI AKTIF / DITUTUP */}
            <div
              className="absolute bottom-0 right-0 xl:right-4 w-56 xl:w-72 p-px bg-slate-200 dark:bg-forest-700 shadow-2xl"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
              }}
            >
              <div
                className="bg-white dark:bg-forest-800 p-4 xl:p-5 h-full"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 17px) 0, 100% 17px, 100% 100%, 17px 100%, 0 calc(100% - 17px))",
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-sprout-400" />
                    <span className="text-[9px] font-bold text-slate-900 dark:text-white tracking-widest uppercase font-display">
                      {isActive ? "Sesi Aktif" : "Sesi Ditutup"}
                    </span>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive
                        ? "bg-sprout-400 shadow-[0_0_8px_#8FE398]"
                        : "bg-rose-500 shadow-[0_0_8px_#D9534F]"
                    }`}
                  />
                </div>
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-[10px] text-slate-600 dark:text-mist-500">
                    Progress Absensi
                  </span>
                  <span className="text-base xl:text-lg font-bold font-mono text-sprout-400">
                    {progressPercent}%
                  </span>
                </div>
                <div
                  className="h-2 w-full bg-slate-50 dark:bg-forest-900 mb-2 relative"
                  style={{
                    clipPath:
                      "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-sprout-400 shadow-[0_0_10px_#8FE398] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-mist-500">
                  {currentDay} / 40 Hari
                </div>
              </div>
            </div>

            {/* QR Scanner Graphic */}
            <div className="flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 xl:w-32 xl:h-32 items-center justify-center z-0">
              <div className="absolute top-0 left-0 w-4 h-4 xl:w-5 xl:h-5 border-t-2 border-l-2 border-sprout-400" />
              <div className="absolute top-0 right-0 w-4 h-4 xl:w-5 xl:h-5 border-t-2 border-r-2 border-sprout-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 xl:w-5 xl:h-5 border-b-2 border-l-2 border-sprout-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 xl:w-5 xl:h-5 border-b-2 border-r-2 border-sprout-400" />
              <QrCode
                className="w-16 h-16 xl:w-20 xl:h-20 text-pine-500 dark:text-sprout-400 drop-shadow-[0_0_15px_rgba(143,227,152,0.5)]"
                strokeWidth={1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
