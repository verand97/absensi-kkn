"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, CheckCircle2, AlertCircle, ArrowRight, Shield, Home, Scan, BarChart2, User, Upload, CalendarDays } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { ThemeToggle } from "@/components/theme-toggle";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import MemberAccountSettings from "./MemberAccountSettings";
import Link from "next/link";
import Image from "next/image";
import { getIndonesianDateDetails, getTodayIndonesianDate, getScheduledDateForDay, IndonesianDateInfo } from "@/lib/dateUtils";
import CountdownTimer from "@/components/CountdownTimer";
import MemoriesManager from "@/components/MemoriesManager";

interface SettingData {
  startTime: string;
  endTime: string;
  isActive: boolean;
  currentDay: number;
}

interface MemberData {
  name: string;
  nim: string;
  isAdmin?: boolean;
  attendances: { day: number; createdAt?: string | Date }[];
}

export default function MemberDashboard({ 
  member, 
  setting,
  initialTab 
}: { 
  member: MemberData, 
  setting: SettingData,
  initialTab?: string 
}) {
  const presentDays = new Set(member.attendances.map((a: { day: number }) => a.day));
  const hasAttendedToday = presentDays.has(setting.currentDay);
  const todayInfo = getTodayIndonesianDate();
  
  const [selectedDayDetail, setSelectedDayDetail] = useState<{
    dayNum: number;
    isPresent: boolean;
    dateInfo?: IndonesianDateInfo;
    scanDateInfo?: IndonesianDateInfo;
  } | null>(null);

  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'beranda' | 'scan' | 'rekap' | 'profil' | 'kenangan'>(
    initialTab === 'kenangan' ? 'kenangan' : 'beranda'
  );

  const lastScannedRef = useRef<string>("");
  const isProcessingRef = useRef<boolean>(false);
  const [status, setStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleTabChange = (tab: 'beranda' | 'scan' | 'rekap' | 'profil' | 'kenangan') => {
    setActiveTab(tab);
    if (tab !== 'scan') {
      setShowScanner(false);
      stopCamera();
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("Error stopping camera:", err);
      } finally {
        html5QrCodeRef.current = null;
        setIsCameraActive(false);
      }
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    if (decodedText === lastScannedRef.current || isProcessingRef.current) return;
    
    lastScannedRef.current = decodedText;
    isProcessingRef.current = true;
    
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken: decodedText }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        const msg = data.allAttended
          ? `BERHASIL ABSEN HARI KE-${data.day}! SEMUA ANGGOTA TELAH ABSEN, SESI OTOMATIS DITUTUP`
          : `BERHASIL ABSEN HARI KE-${data.day}`;
        setStatus({ type: 'success', msg });
        setTimeout(() => {
          stopCamera();
          router.refresh();
          setShowScanner(false);
          setStatus(null);
          handleTabChange('beranda');
        }, 2500);
      } else {
        setStatus({ type: 'error', msg: data.error?.toUpperCase() || "GAGAL ABSEN" });
      }
      
    } catch {
      setStatus({ type: 'error', msg: "ERROR JARINGAN" });
    } finally {
      setTimeout(() => {
        setStatus(prev => prev?.type === 'success' ? prev : null);
        lastScannedRef.current = "";
      }, 3000);
      
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 1000);
    }
  };

  const startCamera = async (facing: 'environment' | 'user') => {
    await stopCamera();
    try {
      const qrCodeInstance = new Html5Qrcode("reader");
      html5QrCodeRef.current = qrCodeInstance;

      await qrCodeInstance.start(
        { facingMode: facing },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScanSuccess(decodedText);
        },
        () => {}
      );
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      setIsCameraActive(false);
      setStatus({ type: 'error', msg: "GAGAL MEMBUKA KAMERA. PASTIKAN IZIN KAMERA DIBERIKAN." });
    }
  };

  const handleChangeFacingMode = async (newFacing: 'environment' | 'user') => {
    setFacingMode(newFacing);
    if (isCameraActive) {
      await startCamera(newFacing);
    }
  };

  const handleSwitchScanMode = async (mode: 'camera' | 'upload') => {
    setScanMode(mode);
    setStatus(null);
    if (mode === 'upload') {
      await stopCamera();
    }
  };

  const handleCloseScanner = async () => {
    await stopCamera();
    setShowScanner(false);
    setStatus(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await stopCamera();
    setIsUploading(true);
    setStatus(null);

    try {
      const html5QrCodeFile = new Html5Qrcode("reader-file");
      const decodedText = await html5QrCodeFile.scanFile(file, true);
      await onScanSuccess(decodedText);
      await html5QrCodeFile.clear();
    } catch (err) {
      console.error("File decode error:", err);
      setStatus({ type: 'error', msg: "KODE QR TIDAK TERBACA ATAU TIDAK DITEMUKAN PADA GAMBAR" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (!showScanner || activeTab !== 'scan') {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [showScanner, activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-forest-900 text-slate-900 dark:text-mist-200 font-sans overflow-x-hidden relative selection:bg-sprout-400/30 pb-24 md:pb-8">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-pine-500/15 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-sprout-400/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 relative z-10">
        
        {/* Header - Always visible */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-6 p-px bg-slate-200 dark:bg-forest-700" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-forest-800 p-6 md:p-8 w-full" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
            <div className="flex flex-col gap-2">
              <Link href="/" className="flex items-center gap-4 group cursor-pointer" title="Ke Halaman Awal / Landing Page">
                <div className="flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Image src="/newlogokkn.png" alt="Logo" width={56} height={56} className="object-contain w-14 h-14 drop-shadow-[0_0_10px_rgba(143,227,152,0.3)]" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-slate-900 dark:text-white drop-shadow-md mb-1">Dashboard</h1>
                  <p className="text-slate-600 dark:text-mist-500 text-xs tracking-widest uppercase font-bold">Halo, <span className="text-sprout-400 font-bold">{member.name}</span></p>
                </div>
              </Link>
              {/* Compact 1-Line Countdown Badge */}
              <div className="mt-1">
                <CountdownTimer compact={true} />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link 
                href="/" 
                className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-forest-700 hover:bg-slate-200 dark:hover:bg-forest-600 border border-slate-300 dark:border-pine-500/50 text-slate-700 dark:text-mist-200 px-4 py-3 text-xs font-bold tracking-widest uppercase transition-colors"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                title="Kembali ke Landing Page / Halaman Awal"
              >
                <Home size={16} className="text-sprout-400" />
                <span className="hidden sm:inline">Halaman Awal</span>
              </Link>
              <button 
                type="button"
                onClick={() => handleTabChange(activeTab === 'kenangan' ? 'beranda' : 'kenangan')} 
                className={`flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${
                  activeTab === 'kenangan'
                    ? 'bg-sprout-400 text-forest-950 font-black border border-sprout-400 shadow-[0_0_15px_rgba(143,227,152,0.4)]'
                    : 'bg-sprout-400/15 hover:bg-sprout-400/25 text-sprout-400 border border-sprout-400/40'
                }`}
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                title="Kelola Video & Foto Kenangan KKN"
              >
                <Camera size={16} />
                <span>{activeTab === 'kenangan' ? 'Dasbor Absensi' : 'Kelola Kenangan'}</span>
              </button>
              {member.isAdmin && (
                <Link 
                  href="/dashboard/admin" 
                  className="flex items-center justify-center gap-2 bg-pine-500/20 hover:bg-pine-500/30 text-sprout-400 px-5 py-3 border border-pine-500/50 text-xs font-bold tracking-widest uppercase transition-all"
                  style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                >
                  <Shield size={16} />
                  Panel Admin
                  <ArrowRight size={16} />
                </Link>
              )}
              <div className="flex items-center justify-end gap-3">
                <ThemeToggle />
                <LogoutButton />
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content Wrapper */}
        <div className="space-y-8">
          {activeTab === 'kenangan' ? (
            <MemoriesManager />
          ) : (
            <>
          {/* TAB 1: BERANDA */}
          <div className={`${activeTab === 'beranda' ? 'block' : 'hidden'} md:block p-px bg-slate-200 dark:bg-forest-700 shadow-xl`} style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
            <div className="bg-white dark:bg-forest-800 w-full" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
              {/* Banner Top */}
              <div className="bg-slate-100 dark:bg-forest-900 border-b border-slate-200 dark:border-forest-700 p-6 text-center">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                  <span className="bg-pine-500/20 text-sprout-400 border border-pine-500/40 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-sm">
                    Hari: {todayInfo.dayName}
                  </span>
                  <span className="bg-sprout-400/20 text-sprout-400 border border-sprout-400/40 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-sm">
                    Tanggal: {todayInfo.dateNum}
                  </span>
                  <span className="bg-amber-400/20 text-amber-400 border border-amber-400/40 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-sm">
                    Bulan: {todayInfo.monthName}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-sm">
                    Tahun: {todayInfo.yearNum}
                  </span>
                </div>
                <h2 className="text-sm font-bold font-display text-slate-700 dark:text-mist-200 uppercase tracking-widest mb-1">
                  Status Absensi (Hari Ke-{setting.currentDay} • {todayInfo.fullFormatted})
                </h2>
                <p className="text-sprout-400 font-mono text-xs tracking-widest font-bold">
                  [ JAM BUKA: {setting.startTime} - {setting.endTime} ]
                </p>
              </div>
              
              <div className="p-6 md:p-8">
                {hasAttendedToday ? (
                  <div className="text-center p-8 bg-sprout-400/10 border border-sprout-400/30 text-sprout-400 shadow-[0_0_20px_rgba(143,227,152,0.1)]" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                    <CheckCircle2 className="mx-auto mb-4 text-sprout-400" size={48} />
                    <h3 className="text-xl font-bold font-display uppercase tracking-widest mb-2">Absensi Berhasil</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-sprout-400/80">Data telah direkam untuk hari ke-{setting.currentDay}</p>
                  </div>
                ) : !setting.isActive ? (
                  <div className="text-center p-8 bg-rose-500/10 border border-rose-500/30 text-rose-500" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                    <AlertCircle className="mx-auto mb-4 text-rose-500" size={48} />
                    <h3 className="text-xl font-bold font-display uppercase tracking-widest mb-2">Sesi Ditutup</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-rose-500/80">Admin belum membuka sesi absen hari ini</p>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-pine-500/15 border border-pine-500/40 text-sprout-400" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                    <Camera className="mx-auto mb-4 text-sprout-400" size={48} />
                    <h3 className="text-xl font-bold font-display uppercase tracking-widest mb-2 text-white">Sesi Aktif</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-sprout-400 mb-6">Silakan buka menu Scan untuk absensi</p>
                    <button 
                      onClick={() => setActiveTab('scan')}
                      className="inline-flex md:hidden items-center justify-center gap-2 bg-linear-to-r from-pine-600 to-pine-500 text-white px-6 py-3 text-xs font-bold tracking-widest uppercase cursor-pointer"
                      style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                    >
                      Buka Kamera
                    </button>
                    <p className="hidden md:block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-mist-500">
                      Gunakan modul di bawah untuk memindai
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TAB 2: SCAN */}
          {(!hasAttendedToday && setting.isActive) && (
            <div className={`${activeTab === 'scan' ? 'block' : 'hidden'} md:block p-px bg-slate-200 dark:bg-forest-700 shadow-xl`} style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
              <div className="bg-white dark:bg-forest-800 w-full p-6 md:p-8" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
                <div className="w-full max-w-xl mx-auto">
                    {/* Scan Self */}
                    <div className="w-full flex flex-col items-center justify-center p-6 bg-slate-200 dark:bg-forest-900 border border-slate-200 dark:border-forest-700" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                      <h3 className="font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-mist-500 mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-sprout-400 rounded-full shadow-[0_0_6px_#8FE398]"></div>
                        Scan Mandiri
                      </h3>
                      
                      {/* Hidden div for file scanner */}
                      <div id="reader-file" className="hidden"></div>

                      {!showScanner ? (
                        <div className="text-center flex flex-col items-center w-full justify-center h-full">
                          <p className="text-xs text-slate-500 dark:text-mist-500 font-bold tracking-widest uppercase mb-6 max-w-50">
                            Pindai kode QR dari layar admin
                          </p>
                          <button
                            onClick={() => { setShowScanner(true); setActiveTab('scan'); }}
                            className="flex items-center justify-center gap-2 bg-linear-to-r from-pine-600 to-pine-500 hover:from-pine-500 hover:to-pine-300 text-white px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(62,122,79,0.3)] w-full max-w-55 cursor-pointer"
                            style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                          >
                            <Camera size={16} /> Buka Mode Scan
                          </button>
                        </div>
                      ) : (
                        <div className="w-full flex flex-col items-center">
                          {/* Mode Switcher Header */}
                          <div className="w-full flex flex-col gap-3 mb-4">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold text-xs uppercase tracking-widest text-sprout-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-sprout-400 animate-pulse"></div>
                                Pilih Mode Presensi
                              </h4>
                              <button 
                                onClick={handleCloseScanner} 
                                className="text-rose-500 hover:text-rose-600 p-1.5 bg-rose-500/10 border border-rose-500/30 rounded-full transition-colors cursor-pointer"
                                title="Tutup Mode Scan"
                              >
                                <X size={16} />
                              </button>
                            </div>

                            {/* Mode Tabs */}
                            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-forest-800 p-1 border border-slate-300 dark:border-forest-700" style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                              <button
                                onClick={() => handleSwitchScanMode('camera')}
                                className={`py-2 px-3 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                  scanMode === 'camera'
                                    ? 'bg-pine-500 text-white shadow-md'
                                    : 'text-slate-600 dark:text-mist-500 hover:text-white hover:bg-slate-200 dark:hover:bg-forest-700'
                                }`}
                                style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                              >
                                <Camera size={14} /> Scan Kamera
                              </button>
                              <button
                                onClick={() => handleSwitchScanMode('upload')}
                                className={`py-2 px-3 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                  scanMode === 'upload'
                                    ? 'bg-pine-500 text-white shadow-md'
                                    : 'text-slate-600 dark:text-mist-500 hover:text-white hover:bg-slate-200 dark:hover:bg-forest-700'
                                }`}
                                style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                              >
                                <Upload size={14} /> Upload Foto
                              </button>
                            </div>
                          </div>

                          {/* MODE 1: SCAN KAMERA */}
                          {scanMode === 'camera' && (
                            <div className="w-full flex flex-col items-center animate-fade-in">
                              {/* Facing Mode Selector */}
                              <div className="w-full flex items-center justify-between gap-2 mb-3 bg-slate-100 dark:bg-forest-800 p-2 border border-slate-300 dark:border-forest-700" style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-mist-500 tracking-wider">Kamera:</span>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleChangeFacingMode('environment')}
                                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                      facingMode === 'environment'
                                        ? 'bg-sprout-400/20 text-sprout-400 border border-sprout-400/40'
                                        : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                    style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                                  >
                                    📷 Belakang
                                  </button>
                                  <button
                                    onClick={() => handleChangeFacingMode('user')}
                                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                      facingMode === 'user'
                                        ? 'bg-sprout-400/20 text-sprout-400 border border-sprout-400/40'
                                        : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                    style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                                  >
                                    🤳 Depan
                                  </button>
                                </div>
                              </div>

                              {/* Reader Element & Preview Box */}
                              <div className="w-full relative overflow-hidden border border-slate-300 dark:border-forest-700 bg-black min-h-60 flex flex-col items-center justify-center" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                                <div id="reader" className="w-full"></div>

                                {!isCameraActive && (
                                  <div className="p-6 text-center flex flex-col items-center justify-center z-10">
                                    <Camera size={36} className="text-sprout-400 mb-3 animate-pulse" />
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">
                                      Siap Pindai ({facingMode === 'environment' ? 'Kamera Belakang' : 'Kamera Depan'})
                                    </p>
                                    <button
                                      onClick={() => startCamera(facingMode)}
                                      className="bg-linear-to-r from-pine-600 to-pine-500 text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(62,122,79,0.3)] hover:scale-105 transition-all cursor-pointer"
                                      style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                                    >
                                      Buka Kamera Presensi
                                    </button>
                                  </div>
                                )}
                              </div>

                              {isCameraActive && (
                                <button
                                  onClick={stopCamera}
                                  className="mt-3 text-xs text-rose-500 hover:text-rose-600 font-bold uppercase tracking-wider flex items-center gap-1.5 py-1 px-3 bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
                                  style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                                >
                                  <X size={14} /> Hentikan Kamera
                                </button>
                              )}
                            </div>
                          )}

                          {/* MODE 2: UPLOAD FOTO */}
                          {scanMode === 'upload' && (
                            <div className="w-full flex flex-col items-center animate-fade-in">
                              <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full border-2 border-dashed border-slate-400 dark:border-forest-700 hover:border-pine-500 bg-slate-100/50 dark:bg-forest-800 p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center group min-h-60"
                                style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
                              >
                                <div className="w-12 h-12 rounded-full bg-pine-500/20 text-sprout-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                  <Upload size={24} />
                                </div>
                                <p className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-1 font-display">
                                  Pilih Gambar / Foto QR Code
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-mist-500 font-mono tracking-widest uppercase mb-4">
                                  PNG, JPG, JPEG, WEBP
                                </p>
                                <span 
                                  className="bg-slate-200 dark:bg-forest-700 border border-slate-300 dark:border-pine-500/50 text-slate-700 dark:text-mist-200 group-hover:text-white group-hover:bg-pine-500 px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all"
                                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                                >
                                  Pilih File Foto
                                </span>
                                <input 
                                  ref={fileInputRef}
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={handleFileUpload}
                                />
                              </div>

                              {isUploading && (
                                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-sprout-400 tracking-wider uppercase animate-pulse">
                                  <div className="w-3 h-3 border-2 border-sprout-400 border-t-transparent rounded-full animate-spin"></div>
                                  Memproses Gambar QR...
                                </div>
                              )}
                            </div>
                          )}

                          {/* Status Toast/Alert */}
                          {status && (
                            <div className={`w-full mt-4 p-3 text-xs font-bold tracking-widest uppercase flex items-start gap-2 border animate-fade-in ${status.type === 'success' ? 'bg-sprout-400/10 text-sprout-400 border-sprout-400/30' : 'bg-rose-500/10 text-rose-500 border-rose-500/30'}`} style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                              {status.type === 'success' ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
                              <span>{status.msg}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REKAP */}
          <div className={`${activeTab === 'rekap' ? 'block' : 'hidden'} md:block p-px bg-slate-200 dark:bg-forest-700 shadow-xl`} style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
            <div className="bg-white dark:bg-forest-800 w-full p-6 md:p-8" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
              
              {/* Header Rekap */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-forest-700 pb-4">
                <div>
                  <h2 className="text-sm font-bold font-display uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <CalendarDays size={18} className="text-sprout-400" />
                    <span>Riwayat Kehadiran</span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-mist-500 uppercase">Hari Ini:</span>
                    <span className="bg-pine-500/20 text-sprout-400 border border-pine-500/30 px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs">
                      Hari: {todayInfo.dayName}
                    </span>
                    <span className="bg-sprout-400/20 text-sprout-400 border border-sprout-400/30 px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs">
                      Tgl: {todayInfo.dateNum}
                    </span>
                    <span className="bg-amber-400/20 text-amber-400 border border-amber-400/30 px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs">
                      Bulan: {todayInfo.monthName}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs">
                      Tahun: {todayInfo.yearNum}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className="text-xs font-bold font-mono px-3 py-1.5 bg-sprout-400/10 border border-sprout-400/30 text-sprout-400" style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                    TOTAL: {presentDays.size} HARI
                  </span>
                </div>
              </div>
              
              {/* Grid H1–H40 Kehadiran */}
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {Array.from({ length: 40 }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateInfo = getScheduledDateForDay(dayNum);
                  const att = member.attendances.find((a: { day: number; createdAt?: string | Date }) => a.day === dayNum);
                  const isPresent = Boolean(att);
                  const scanDateInfo = att?.createdAt ? getIndonesianDateDetails(att.createdAt) : null;

                  return (
                    <button 
                      key={i} 
                      type="button"
                      onClick={() => setSelectedDayDetail({ dayNum, isPresent, dateInfo, scanDateInfo: scanDateInfo || undefined })}
                      className={`flex flex-col items-center justify-center py-2 px-1 border transition-all cursor-pointer hover:scale-105 active:scale-95 group relative ${
                        isPresent 
                          ? 'bg-sprout-400/15 border-sprout-400/50 text-sprout-400 shadow-[0_0_10px_rgba(143,227,152,0.15)] hover:bg-sprout-400/25' 
                          : 'bg-slate-200 dark:bg-forest-900 border-slate-200 dark:border-forest-700 text-slate-700 dark:text-mist-500 hover:border-pine-500'
                      }`}
                      style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                      title={`Hari Ke-${dayNum}: ${dateInfo.fullFormatted}`}
                    >
                      <span className="text-[9px] font-bold tracking-widest mb-0.5 opacity-90 text-slate-800 dark:text-mist-200">H{dayNum}</span>
                      <span className="text-xs font-black">{isPresent ? '✓' : '-'}</span>
                      <span className={`text-[7px] font-mono mt-1 opacity-100 truncate max-w-full px-1 rounded-xs font-bold ${
                        isPresent ? 'bg-sprout-400/20 text-sprout-400' : 'bg-slate-300 dark:bg-forest-700 text-slate-600 dark:text-mist-500'
                      }`}>
                        {dateInfo.dateNum}/{dateInfo.monthShort}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Day Detail Modal */}
              {selectedDayDetail && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
                  <div className="bg-white dark:bg-forest-800 border border-slate-300 dark:border-forest-700 w-full max-w-sm p-6 shadow-2xl relative text-slate-900 dark:text-white" style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}>
                    <button 
                      onClick={() => setSelectedDayDetail(null)}
                      className="absolute top-4 right-4 text-slate-400 dark:text-mist-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-11 h-11 flex items-center justify-center font-black text-base border ${selectedDayDetail.isPresent ? 'bg-sprout-400/20 border-sprout-400/50 text-sprout-400' : 'bg-slate-200 dark:bg-forest-900 border-slate-300 dark:border-forest-700 text-slate-500'}`}>
                        H{selectedDayDetail.dayNum}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider">Detail Presensi Hari Ke-{selectedDayDetail.dayNum}</h3>
                        <p className={`text-xs font-bold tracking-widest uppercase ${selectedDayDetail.isPresent ? 'text-sprout-400' : 'text-slate-400 dark:text-mist-500'}`}>
                          {selectedDayDetail.isPresent ? '✓ SUDAH ABSEN' : '- BELUM ADA RECORD'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5 bg-slate-100 dark:bg-forest-900 p-4 border border-slate-200 dark:border-forest-700 font-mono text-xs">
                      <div className="flex justify-between border-b border-slate-200 dark:border-forest-700 pb-1.5">
                        <span className="text-slate-500 dark:text-mist-500 font-sans">HARI:</span>
                        <span className="font-bold text-sprout-400">{selectedDayDetail.dateInfo?.dayName || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 dark:border-forest-700 pb-1.5">
                        <span className="text-slate-500 dark:text-mist-500 font-sans">TANGGAL:</span>
                        <span className="font-bold text-sprout-400">{selectedDayDetail.dateInfo?.dateNum || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 dark:border-forest-700 pb-1.5">
                        <span className="text-slate-500 dark:text-mist-500 font-sans">BULAN:</span>
                        <span className="font-bold text-amber-400">{selectedDayDetail.dateInfo?.monthName || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 dark:border-forest-700 pb-1.5">
                        <span className="text-slate-500 dark:text-mist-500 font-sans">TAHUN:</span>
                        <span className="font-bold text-emerald-400">{selectedDayDetail.dateInfo?.yearNum || '-'}</span>
                      </div>
                      <div className="flex justify-between pt-0.5">
                        <span className="text-slate-500 dark:text-mist-500 font-sans">TANGGAL JADWAL:</span>
                        <span className="font-bold text-slate-900 dark:text-white text-right">{selectedDayDetail.dateInfo?.fullFormatted || '-'}</span>
                      </div>
                      {selectedDayDetail.scanDateInfo && (
                        <div className="flex justify-between border-t border-slate-200 dark:border-forest-700 pt-1.5 text-[10px]">
                          <span className="text-slate-500 dark:text-mist-500 font-sans">WAKTU ABSEN:</span>
                          <span className="font-bold text-sprout-400 text-right">{selectedDayDetail.scanDateInfo.fullFormatted}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedDayDetail(null)}
                      className="w-full mt-5 bg-pine-500 hover:bg-pine-300 text-white py-2.5 font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
                      style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* TAB 4: PROFIL */}
          <div className={`${activeTab === 'profil' ? 'block' : 'hidden'} md:block`}>
            <MemberAccountSettings member={member} />
          </div>

            </>
          )}

        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-200 dark:bg-forest-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-forest-700 flex justify-between items-center px-6 py-3 md:hidden z-50">
        <button onClick={() => handleTabChange('beranda')} className={`flex flex-col items-center gap-1 w-16 relative ${activeTab === 'beranda' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
          {activeTab === 'beranda' && <div className="w-10 h-0.5 bg-sprout-400 absolute -top-3 rounded-b-sm shadow-[0_0_5px_#8FE398]"></div>}
          <Home className={`w-6 h-6 ${activeTab === 'beranda' ? 'text-sprout-400' : 'text-slate-700 dark:text-mist-200'}`} strokeWidth={activeTab === 'beranda' ? 2 : 1.5} />
          <span className={`text-[10px] font-medium ${activeTab === 'beranda' ? 'text-sprout-400' : 'text-slate-700 dark:text-mist-200'}`}>Beranda</span>
        </button>
        {(!hasAttendedToday && setting.isActive) && (
          <button onClick={() => handleTabChange('scan')} className={`flex flex-col items-center gap-1 w-16 relative ${activeTab === 'scan' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
            {activeTab === 'scan' && <div className="w-10 h-0.5 bg-sprout-400 absolute -top-3 rounded-b-sm shadow-[0_0_5px_#8FE398]"></div>}
            <Scan className={`w-6 h-6 ${activeTab === 'scan' ? 'text-sprout-400' : 'text-slate-700 dark:text-mist-200'}`} strokeWidth={activeTab === 'scan' ? 2 : 1.5} />
            <span className={`text-[10px] font-medium ${activeTab === 'scan' ? 'text-sprout-400' : 'text-slate-700 dark:text-mist-200'}`}>Scan</span>
          </button>
        )}
        <button onClick={() => handleTabChange('rekap')} className={`flex flex-col items-center gap-1 w-16 relative ${activeTab === 'rekap' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
          {activeTab === 'rekap' && <div className="w-10 h-0.5 bg-sprout-400 absolute -top-3 rounded-b-sm shadow-[0_0_5px_#8FE398]"></div>}
          <BarChart2 className={`w-6 h-6 ${activeTab === 'rekap' ? 'text-sprout-400' : 'text-slate-700 dark:text-mist-200'}`} strokeWidth={activeTab === 'rekap' ? 2 : 1.5} />
          <span className={`text-[10px] font-medium ${activeTab === 'rekap' ? 'text-sprout-400' : 'text-slate-700 dark:text-mist-200'}`}>Rekap</span>
        </button>
        <button onClick={() => handleTabChange('profil')} className={`flex flex-col items-center gap-1 w-14 relative ${activeTab === 'profil' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
          {activeTab === 'profil' && <div className="w-8 h-0.5 bg-sprout-400 absolute -top-3 rounded-b-sm shadow-[0_0_5px_#8FE398]"></div>}
          <User className={`w-5 h-5 ${activeTab === 'profil' ? 'text-sprout-400' : 'text-slate-700 dark:text-mist-200'}`} strokeWidth={activeTab === 'profil' ? 2 : 1.5} />
          <span className={`text-[9px] font-medium ${activeTab === 'profil' ? 'text-sprout-400' : 'text-slate-700 dark:text-mist-200'}`}>Profil</span>
        </button>
        <button onClick={() => handleTabChange('kenangan')} className={`flex flex-col items-center gap-1 w-14 relative ${activeTab === 'kenangan' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
          {activeTab === 'kenangan' && <div className="w-8 h-0.5 bg-sprout-400 absolute -top-3 rounded-b-sm shadow-[0_0_5px_#8FE398]"></div>}
          <Camera className={`w-5 h-5 ${activeTab === 'kenangan' ? 'text-sprout-400' : 'text-slate-700 dark:text-mist-200'}`} strokeWidth={activeTab === 'kenangan' ? 2 : 1.5} />
          <span className={`text-[9px] font-medium ${activeTab === 'kenangan' ? 'text-sprout-400' : 'text-slate-700 dark:text-mist-200'}`}>Kenangan</span>
        </button>
      </div>

    </div>
  );
}
