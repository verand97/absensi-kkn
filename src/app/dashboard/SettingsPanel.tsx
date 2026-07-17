"use client";

import { useState } from "react";
import { Clock, Save, QrCode, Download, Printer } from "lucide-react";
import QRCode from "react-qr-code";

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

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    const token = `ABSEN-HARI-${currentDay}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime, endTime, isActive, currentDay, qrToken: token })
      });
      if (res.ok) {
        setQrToken(token);
        setMsg("Pengaturan berhasil disimpan. QR Code Absensi siap digunakan!");
        setTimeout(() => setMsg(""), 5000);
      } else {
        setMsg("Gagal menyimpan.");
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
      canvas.width = img.width + 40; // Add padding
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "white"; // White background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20); // Draw with padding
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 p-6 mb-8 animate-fade-in transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-white/5 pb-4">
        <Clock className="text-blue-500 dark:text-blue-400" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Mulai Absensi</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hari Ke-</label>
          <select 
            value={currentDay} 
            onChange={(e) => setCurrentDay(Number(e.target.value))}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>Hari ke-{i + 1}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Jam Buka</label>
          <input 
            type="time" 
            value={startTime} 
            onChange={e => setStartTime(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium scheme-light dark:scheme-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Jam Tutup</label>
          <input 
            type="time" 
            value={endTime} 
            onChange={e => setEndTime(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium scheme-light dark:scheme-dark"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isActive} 
              onChange={e => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 dark:text-blue-500 focus:ring-blue-500 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            />
            Aktifkan Sesi Absensi
          </label>
          
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm font-bold w-full"
          >
            <Save size={18} />
            {loading ? "Menyimpan..." : "Mulai Absensi"}
          </button>
        </div>
      </div>
      
      {msg && (
        <div className={`mt-4 text-sm font-medium p-3 rounded-lg border ${msg.includes("Gagal") || msg.includes("kesalahan") ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20" : "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20"}`}>
          {msg}
        </div>
      )}

      {isActive && qrToken && (
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">QR Code Absensi Hari ke-{currentDay}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 text-center max-w-md">
            Minta anggota untuk scan QR ini dari perangkat mereka masing-masing untuk melakukan absensi otomatis.
          </p>
          <div id="qr-wrapper" className="bg-white p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
            <QRCode value={qrToken} size={250} />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
            <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-4 py-2.5 rounded-xl font-mono font-bold text-sm border border-blue-100 dark:border-blue-500/20">
              <QrCode size={18} />
              <span>KODE: {qrToken}</span>
            </div>
            <button 
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm font-bold border border-slate-700"
            >
              <Download size={18} />
              Download
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm font-bold border border-slate-700"
            >
              <Printer size={18} />
              Cetak
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
