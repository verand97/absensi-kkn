"use client";

import { useState } from "react";
import { Clock, Save, QrCode, Download, Printer } from "lucide-react";
import QRCode from "react-qr-code";
import { getTodayIndonesianDate } from "@/lib/dateUtils";

interface SettingData {
  startTime: string;
  endTime: string;
  isActive: boolean;
  currentDay: number;
  qrToken: string;
}

export default function SettingsPanel({ initialSetting }: { initialSetting: SettingData | null }) {
  const [startTime, setStartTime] = useState(initialSetting?.startTime || "07:00");
  const [endTime, setEndTime] = useState(initialSetting?.endTime || "09:00");
  const [isActive, setIsActive] = useState(initialSetting?.isActive ?? true);
  const [currentDay, setCurrentDay] = useState(initialSetting?.currentDay || 1);
  const [qrToken, setQrToken] = useState(initialSetting?.qrToken || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const todayInfo = getTodayIndonesianDate();

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    const token = "QR-ABSEN-KKN-SUMANDING-2026";
    
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime, endTime, isActive, currentDay, qrToken: token })
      });
      if (res.ok) {
        setQrToken(token);
        if (isActive) {
          setMsg(`Sesi absensi Hari ${currentDay} BERHASIL DIAKTIFKAN.`);
        } else {
          setMsg(`Sesi absensi Hari ${currentDay} BERHASIL DIMATIKAN.`);
        }
        setTimeout(() => setMsg(""), 5000);
      } else {
        setMsg("Gagal menyimpan pengaturan.");
      }
    } catch {
      setMsg("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const svg = document.querySelector("#qr-wrapper svg");
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
      downloadLink.download = `QR-Absensi-Hari-${currentDay}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    const svg = document.querySelector("#qr-wrapper svg");
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
            <head><title>Cetak QR Code Admin</title></head>
            <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh;">
              <img src="${pngFile}" style="max-width: 100%; width: 500px;" />
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

  return (
    <div className="p-px bg-slate-200 dark:bg-[#1C3324] mb-10 shadow-xl" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
      <div className="bg-white dark:bg-[#14241B] p-6 md:p-8 animate-fade-in" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-[#1C3324] pb-4">
          <div className="flex items-center gap-3">
            <Clock className="text-[#8FE398] w-6 h-6 shrink-0" />
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase tracking-widest">Mulai Sesi Absensi</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#3E7A4F]/20 text-[#8FE398] border border-[#3E7A4F]/30 px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs">
              Hari: {todayInfo.dayName}
            </span>
            <span className="bg-[#8FE398]/20 text-[#8FE398] border border-[#8FE398]/30 px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs">
              Tgl: {todayInfo.dateNum}
            </span>
            <span className="bg-[#E3A23E]/20 text-[#E3A23E] border border-[#E3A23E]/30 px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs">
              Bulan: {todayInfo.monthName}
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs">
              Tahun: {todayInfo.yearNum}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-[#9BA79C] uppercase tracking-widest mb-2">Hari Ke-</label>
            <select 
              value={currentDay} 
              onChange={(e) => setCurrentDay(Number(e.target.value))}
              className="w-full p-3 bg-slate-200 dark:bg-[#0F1A14] border border-slate-300 dark:border-[#1C3324] text-slate-900 dark:text-white focus:outline-none focus:border-[#3E7A4F] transition-colors font-mono appearance-none"
              style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
            >
              {Array.from({ length: 40 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>HARI {i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-[#9BA79C] uppercase tracking-widest mb-2">Jam Buka</label>
            <input 
              type="time" 
              value={startTime} 
              onChange={e => setStartTime(e.target.value)}
              className="w-full p-3 bg-slate-200 dark:bg-[#0F1A14] border border-slate-300 dark:border-[#1C3324] text-slate-900 dark:text-white focus:outline-none focus:border-[#3E7A4F] transition-colors font-mono scheme-dark"
              style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-[#9BA79C] uppercase tracking-widest mb-2">Jam Tutup</label>
            <input 
              type="time" 
              value={endTime} 
              onChange={e => setEndTime(e.target.value)}
              className="w-full p-3 bg-slate-200 dark:bg-[#0F1A14] border border-slate-300 dark:border-[#1C3324] text-slate-900 dark:text-white focus:outline-none focus:border-[#3E7A4F] transition-colors font-mono scheme-dark"
              style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-[#D7DDD6] uppercase tracking-widest cursor-pointer group mt-2">
              <div className={`w-5 h-5 flex items-center justify-center border transition-colors ${isActive ? 'bg-[#8FE398]/20 border-[#8FE398]' : 'bg-slate-200 dark:bg-[#0F1A14] border-slate-300 dark:border-[#1C3324]'}`}>
                <input 
                  type="checkbox" 
                  checked={isActive} 
                  onChange={e => setIsActive(e.target.checked)}
                  className="opacity-0 absolute cursor-pointer"
                />
                {isActive && <div className="w-2.5 h-2.5 bg-[#8FE398] shadow-[0_0_8px_#8FE398]"></div>}
              </div>
              Aktifkan Sesi
            </label>
            
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#326440] to-[#3E7A4F] hover:from-[#3E7A4F] hover:to-[#5FA872] text-white px-5 py-3.5 text-xs font-bold tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(62,122,79,0.3)] disabled:opacity-50 cursor-pointer"
              style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
            >
              <Save size={16} className={loading ? "animate-spin" : ""} />
              {loading ? "Menyimpan..." : "Mulai Absensi"}
            </button>
          </div>
        </div>
        
        {msg && (
          <div className={`mt-6 text-xs font-bold tracking-widest uppercase p-4 border ${msg.includes("Gagal") || msg.includes("kesalahan") ? "bg-[#D9534F]/10 text-[#D9534F] border-[#D9534F]/30" : "bg-[#8FE398]/10 text-[#8FE398] border-[#8FE398]/30"}`} style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
            {msg}
          </div>
        )}

        {isActive && qrToken ? (
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-[#1C3324] flex flex-col items-center justify-center">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white uppercase tracking-widest drop-shadow-md mb-2">QR Code Hari {currentDay}</h3>
            <p className="text-slate-600 dark:text-[#9BA79C] text-xs tracking-widest uppercase font-medium mb-6 text-center max-w-md">
              Arahkan anggota untuk memindai kode ini.
            </p>
            <div id="qr-wrapper" className="bg-white p-4 mb-6" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
              <QRCode value={qrToken} size={250} />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <div className="flex items-center justify-center gap-3 text-[#8FE398] bg-[#8FE398]/10 px-5 py-3 font-mono font-bold text-sm border border-[#8FE398]/30 tracking-widest uppercase" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                <QrCode size={18} />
                <span>{qrToken}</span>
              </div>
              <button 
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-[#1C3324] hover:bg-slate-200 dark:hover:bg-[#24422E] border border-slate-300 dark:border-[#3E7A4F]/50 text-slate-900 dark:text-white px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
              >
                <Download size={16} />
                Download
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-[#1C3324] hover:bg-slate-200 dark:hover:bg-[#24422E] border border-slate-300 dark:border-[#3E7A4F]/50 text-slate-900 dark:text-white px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
              >
                <Printer size={16} />
                Cetak
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-[#1C3324] flex flex-col items-center justify-center animate-fade-in">
            <div className="w-20 h-20 bg-slate-100 dark:bg-[#1C3324] border border-slate-300 dark:border-[#3E7A4F]/30 flex items-center justify-center mb-6 opacity-60" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
              <QrCode className="w-10 h-10 text-slate-400 dark:text-[#9BA79C]" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white uppercase tracking-widest drop-shadow-md mb-2 text-center">Sesi Absensi Ditutup</h3>
            <p className="text-slate-600 dark:text-[#9BA79C] text-xs tracking-widest uppercase font-medium text-center max-w-md">
              Sesi absensi untuk saat ini sedang tidak aktif. <br className="hidden md:block" /> Centang &quot;Aktifkan Sesi&quot; dan simpan untuk menampilkan QR Code.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
