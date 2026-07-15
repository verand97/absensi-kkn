"use client";

import { useState } from "react";
import { Clock, Save, QrCode, Download } from "lucide-react";
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
        <Clock className="text-blue-500" />
        <h2 className="text-lg font-bold">Mulai Absensi</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Hari Ke-</label>
          <select 
            value={currentDay} 
            onChange={(e) => setCurrentDay(Number(e.target.value))}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>Hari ke-{i + 1}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Jam Buka</label>
          <input 
            type="time" 
            value={startTime} 
            onChange={e => setStartTime(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Jam Tutup</label>
          <input 
            type="time" 
            value={endTime} 
            onChange={e => setEndTime(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isActive} 
              onChange={e => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            Aktifkan Sesi Absensi
          </label>
          
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm font-bold w-full"
          >
            <Save size={18} />
            {loading ? "Menyimpan..." : "Mulai Absensi"}
          </button>
        </div>
      </div>
      
      {msg && (
        <div className="mt-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
          {msg}
        </div>
      )}

      {isActive && qrToken && (
        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-slate-800 mb-2">QR Code Absensi Hari ke-{currentDay}</h3>
          <p className="text-slate-500 text-sm mb-6 text-center max-w-md">
            Minta anggota untuk scan QR ini dari perangkat mereka masing-masing untuk melakukan absensi otomatis.
          </p>
          <div id="qr-wrapper" className="bg-white p-4 rounded-2xl shadow-xl border border-slate-200">
            <QRCode value={qrToken} size={250} />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
            <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 px-4 py-2.5 rounded-xl font-mono font-bold text-sm border border-blue-100">
              <QrCode size={18} />
              <span>KODE: {qrToken}</span>
            </div>
            <button 
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm font-bold"
            >
              <Download size={18} />
              Download QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
