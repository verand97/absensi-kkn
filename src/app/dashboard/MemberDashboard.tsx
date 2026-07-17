"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, CheckCircle2, AlertCircle, Eye, EyeOff, Download, Printer, QrCode, ArrowRight, Shield, Home, Scan, BarChart2, User } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { ThemeToggle } from "@/components/theme-toggle";
import QRCode from "react-qr-code";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import MemberAccountSettings from "./MemberAccountSettings";
import Link from "next/link";

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
  attendances: { day: number }[];
}

export default function MemberDashboard({ member, setting }: { member: MemberData, setting: SettingData }) {
  const presentDays = new Set(member.attendances.map((a: { day: number }) => a.day));
  const hasAttendedToday = presentDays.has(setting.currentDay);
  
  const [showScanner, setShowScanner] = useState(false);
  const [showMyQR, setShowMyQR] = useState(false);
  const [activeTab, setActiveTab] = useState<'beranda' | 'scan' | 'rekap' | 'profil'>('beranda');

  const lastScannedRef = useRef<string>("");
  const isProcessingRef = useRef<boolean>(false);
  const [status, setStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const router = useRouter();

  const handleTabChange = (tab: 'beranda' | 'scan' | 'rekap' | 'profil') => {
    setActiveTab(tab);
    if (tab !== 'scan') {
      setShowScanner(false);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector("#member-qr-wrapper svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${member.nim}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrintQR = () => {
    const svg = document.querySelector("#member-qr-wrapper svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
      }
      const pngFile = canvas.toDataURL("image/png");
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Cetak QR Code ${member.name}</title></head>
            <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh;">
              <img src="${pngFile}" style="max-width: 100%; width: 400px;" />
              <script>
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 250);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  useEffect(() => {
    if (!showScanner || activeTab !== 'scan') {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      return;
    }

    async function onScanSuccess(decodedText: string) {
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
          setStatus({ type: 'success', msg: `BERHASIL ABSEN HARI KE-${data.day}` });
          setTimeout(() => {
            router.refresh();
            setShowScanner(false);
            setStatus(null);
            handleTabChange('beranda');
          }, 2000);
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
    }

    function onScanFailure() {}

    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [showScanner, activeTab, router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D14] text-slate-900 dark:text-white font-sans overflow-x-hidden relative selection:bg-[#7F56FF]/30 pb-24 md:pb-8">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-[#7F56FF]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#80FF56]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
        
        {/* Header - Always visible */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 p-px bg-slate-200 dark:bg-slate-700/50" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-[#12141C] p-6 md:p-8 w-full" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white drop-shadow-md mb-1">Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400 text-xs tracking-widest uppercase font-bold">Halo, <span className="text-[#80FF56]">{member.name}</span></p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {member.isAdmin && (
                <Link 
                  href="/dashboard/admin" 
                  className="flex items-center justify-center gap-2 bg-[#7F56FF]/20 hover:bg-[#7F56FF]/30 text-[#7F56FF] px-5 py-3 border border-[#7F56FF]/50 text-xs font-bold tracking-widest uppercase transition-all"
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
          
          {/* TAB 1: BERANDA */}
          <div className={`${activeTab === 'beranda' ? 'block' : 'hidden'} md:block p-px bg-slate-200 dark:bg-slate-700/50`} style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
            <div className="bg-white dark:bg-[#12141C] w-full" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
              {/* Banner Top */}
              <div className="bg-slate-100 dark:bg-[#1A1C23] border-b border-slate-200 dark:border-slate-800 p-6 text-center">
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-1">Status Absensi (Hari {setting.currentDay})</h2>
                <p className="text-[#80FF56] font-mono text-xs tracking-widest">
                  [ JAM BUKA: {setting.startTime} - {setting.endTime} ]
                </p>
              </div>
              
              <div className="p-6 md:p-8">
                {hasAttendedToday ? (
                  <div className="text-center p-8 bg-[#80FF56]/10 border border-[#80FF56]/20 text-[#80FF56] shadow-[0_0_20px_rgba(128,255,86,0.05)]" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                    <CheckCircle2 className="mx-auto mb-4 text-[#80FF56]" size={48} />
                    <h3 className="text-xl font-black uppercase tracking-widest mb-2">Absensi Berhasil</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#80FF56]/70">Data telah direkam untuk hari ke-{setting.currentDay}</p>
                  </div>
                ) : !setting.isActive ? (
                  <div className="text-center p-8 bg-red-500/10 border border-red-500/20 text-red-400" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                    <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
                    <h3 className="text-xl font-black uppercase tracking-widest mb-2">Sesi Ditutup</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-red-400/70">Admin belum membuka sesi absen hari ini</p>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-[#7F56FF]/10 border border-[#7F56FF]/20 text-[#7F56FF]" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                    <Camera className="mx-auto mb-4 text-[#7F56FF]" size={48} />
                    <h3 className="text-xl font-black uppercase tracking-widest mb-2">Sesi Aktif</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#7F56FF]/70 mb-6">Silakan buka menu Scan untuk absensi</p>
                    <button 
                      onClick={() => setActiveTab('scan')}
                      className="inline-flex md:hidden items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-[#7F56FF] text-slate-900 dark:text-white px-6 py-3 text-xs font-bold tracking-widest uppercase"
                      style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                    >
                      Buka Kamera
                    </button>
                    <p className="hidden md:block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">
                      Gunakan modul di bawah untuk memindai
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TAB 2: SCAN (Only visible if active or on desktop, and only if not attended yet & session is active) */}
          {(!hasAttendedToday && setting.isActive) && (
            <div className={`${activeTab === 'scan' ? 'block' : 'hidden'} md:block p-px bg-slate-200 dark:bg-slate-700/50`} style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
              <div className="bg-white dark:bg-[#12141C] w-full p-6 md:p-8" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Box: My QR */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-200 dark:bg-[#090A0F] border border-slate-200 dark:border-slate-800" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                      <h3 className="font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#7F56FF] rounded-full"></div>
                        Identitas Anda
                      </h3>
                      
                      {!showMyQR ? (
                        <div className="flex flex-col items-center text-center">
                          <div className="w-40 h-40 bg-white dark:bg-[#12141C] border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center opacity-60 mb-6 relative" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                             <QrCode size={40} className="text-slate-500 dark:text-slate-500 mb-2" />
                             <span className="text-[10px] text-slate-500 dark:text-slate-500 font-bold tracking-widest">TERKUNCI</span>
                          </div>
                          <button 
                            onClick={() => setShowMyQR(true)}
                            className="flex items-center gap-2 bg-slate-100 dark:bg-[#1A1C23] hover:bg-[#252836] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors"
                            style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                          >
                            <Eye size={16} /> Buka QR Code
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center w-full">
                          <div id="member-qr-wrapper" className="bg-white p-3 mb-6" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                            <QRCode value={member.nim} size={160} />
                          </div>
                          <div className="flex flex-wrap justify-center gap-3 mb-4">
                            <button onClick={handleDownloadQR} className="p-2.5 bg-slate-100 dark:bg-[#1A1C23] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#252836] transition-colors"><Download size={16} /></button>
                            <button onClick={handlePrintQR} className="p-2.5 bg-slate-100 dark:bg-[#1A1C23] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#252836] transition-colors"><Printer size={16} /></button>
                            <button onClick={() => setShowMyQR(false)} className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                              <EyeOff size={16} /> Tutup
                            </button>
                          </div>
                          <p className="text-[10px] text-center text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
                            Scan melalui admin
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Right Box: Scan Self */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-200 dark:bg-[#090A0F] border border-slate-200 dark:border-slate-800" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                      <h3 className="font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#80FF56] rounded-full"></div>
                        Scan Mandiri
                      </h3>
                      
                      {!showScanner ? (
                        <div className="text-center flex flex-col items-center w-full justify-center h-full">
                          <p className="text-xs text-slate-500 dark:text-slate-500 font-bold tracking-widest uppercase mb-6 max-w-[200px]">
                            Pindai kode QR dari layar admin
                          </p>
                          <button
                            onClick={() => { setShowScanner(true); setActiveTab('scan'); }}
                            className="flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-[#7F56FF] text-slate-900 dark:text-white px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(127,86,255,0.3)] w-full max-w-[220px]"
                            style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                          >
                            <Camera size={16} /> Aktifkan Kamera
                          </button>
                        </div>
                      ) : (
                        <div className="w-full flex flex-col">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-[10px] uppercase tracking-widest text-[#80FF56]">Arahkan ke target</h4>
                            <button onClick={() => { setShowScanner(false); }} className="text-red-400 hover:text-red-300 p-1 bg-red-500/10 border border-red-500/30 rounded-full">
                              <X size={14} />
                            </button>
                          </div>
                          
                          <div id="reader" className="w-full overflow-hidden border border-slate-300 dark:border-slate-700 bg-black" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}></div>
                          
                          {status && (
                            <div className={`mt-4 p-3 text-xs font-bold tracking-widest uppercase flex items-start gap-2 border ${status.type === 'success' ? 'bg-[#80FF56]/10 text-[#80FF56] border-[#80FF56]/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`} style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                              {status.type === 'success' ? <CheckCircle2 size={16} className="mt-0.5" /> : <AlertCircle size={16} className="mt-0.5" />}
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
          <div className={`${activeTab === 'rekap' ? 'block' : 'hidden'} md:block p-px bg-slate-200 dark:bg-slate-700/50`} style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
            <div className="bg-white dark:bg-[#12141C] w-full p-6 md:p-8" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-6 flex items-center justify-between">
                <span>Riwayat Kehadiran</span>
                <span className="text-[#80FF56]">Total: {presentDays.size} Hari</span>
              </h2>
              
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {Array.from({ length: 40 }).map((_, i) => {
                  const isPresent = presentDays.has(i + 1);
                  return (
                    <div 
                      key={i} 
                      className={`flex flex-col items-center justify-center py-2.5 border transition-colors ${
                        isPresent 
                          ? 'bg-[#80FF56]/10 border-[#80FF56]/30 text-[#80FF56] shadow-[0_0_10px_rgba(128,255,86,0.1)]' 
                          : 'bg-slate-200 dark:bg-[#090A0F] border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                      style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                    >
                      <span className="text-[9px] font-bold tracking-widest mb-1 opacity-70">H{i + 1}</span>
                      <span className="text-sm font-black">{isPresent ? '✓' : '-'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TAB 4: PROFIL */}
          <div className={`${activeTab === 'profil' ? 'block' : 'hidden'} md:block`}>
            <MemberAccountSettings member={member} />
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation (Sticky for small screens) */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-200 dark:bg-[#090A0F]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/80 flex justify-between items-center px-6 py-3 md:hidden z-50">
        <button onClick={() => handleTabChange('beranda')} className={`flex flex-col items-center gap-1 w-16 relative ${activeTab === 'beranda' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
          {activeTab === 'beranda' && <div className="w-10 h-0.5 bg-[#7F56FF] absolute -top-3 rounded-b-sm shadow-[0_0_5px_#7F56FF]"></div>}
          <Home className={`w-6 h-6 ${activeTab === 'beranda' ? 'text-[#7F56FF]' : 'text-slate-700 dark:text-slate-300'}`} strokeWidth={activeTab === 'beranda' ? 2 : 1.5} />
          <span className={`text-[10px] font-medium ${activeTab === 'beranda' ? 'text-[#7F56FF]' : 'text-slate-700 dark:text-slate-300'}`}>Beranda</span>
        </button>
        {(!hasAttendedToday && setting.isActive) && (
          <button onClick={() => handleTabChange('scan')} className={`flex flex-col items-center gap-1 w-16 relative ${activeTab === 'scan' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
            {activeTab === 'scan' && <div className="w-10 h-0.5 bg-[#80FF56] absolute -top-3 rounded-b-sm shadow-[0_0_5px_#80FF56]"></div>}
            <Scan className={`w-6 h-6 ${activeTab === 'scan' ? 'text-[#80FF56]' : 'text-slate-700 dark:text-slate-300'}`} strokeWidth={activeTab === 'scan' ? 2 : 1.5} />
            <span className={`text-[10px] font-medium ${activeTab === 'scan' ? 'text-[#80FF56]' : 'text-slate-700 dark:text-slate-300'}`}>Scan</span>
          </button>
        )}
        <button onClick={() => handleTabChange('rekap')} className={`flex flex-col items-center gap-1 w-16 relative ${activeTab === 'rekap' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
          {activeTab === 'rekap' && <div className="w-10 h-0.5 bg-[#7F56FF] absolute -top-3 rounded-b-sm shadow-[0_0_5px_#7F56FF]"></div>}
          <BarChart2 className={`w-6 h-6 ${activeTab === 'rekap' ? 'text-[#7F56FF]' : 'text-slate-700 dark:text-slate-300'}`} strokeWidth={activeTab === 'rekap' ? 2 : 1.5} />
          <span className={`text-[10px] font-medium ${activeTab === 'rekap' ? 'text-[#7F56FF]' : 'text-slate-700 dark:text-slate-300'}`}>Rekap</span>
        </button>
        <button onClick={() => handleTabChange('profil')} className={`flex flex-col items-center gap-1 w-16 relative ${activeTab === 'profil' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
          {activeTab === 'profil' && <div className="w-10 h-0.5 bg-[#80FF56] absolute -top-3 rounded-b-sm shadow-[0_0_5px_#80FF56]"></div>}
          <User className={`w-6 h-6 ${activeTab === 'profil' ? 'text-[#80FF56]' : 'text-slate-700 dark:text-slate-300'}`} strokeWidth={activeTab === 'profil' ? 2 : 1.5} />
          <span className={`text-[10px] font-medium ${activeTab === 'profil' ? 'text-[#80FF56]' : 'text-slate-700 dark:text-slate-300'}`}>Profil</span>
        </button>
      </div>

    </div>
  );
}
