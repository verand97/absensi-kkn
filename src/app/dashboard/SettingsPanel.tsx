"use client";

import { useState, useEffect } from "react";
import { Clock, Save } from "lucide-react";

export default function SettingsPanel({ initialSetting }: { initialSetting: any }) {
  const [startTime, setStartTime] = useState(initialSetting?.startTime || "07:00");
  const [endTime, setEndTime] = useState(initialSetting?.endTime || "09:00");
  const [isActive, setIsActive] = useState(initialSetting?.isActive ?? true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime, endTime, isActive })
      });
      if (res.ok) {
        setMsg("Pengaturan berhasil disimpan.");
        setTimeout(() => setMsg(""), 3000);
      } else {
        setMsg("Gagal menyimpan.");
      }
    } catch (e) {
      setMsg("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
        <Clock className="text-blue-500" />
        <h2 className="text-lg font-bold">Pengaturan Waktu Absensi</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Jam Buka Absen</label>
          <input 
            type="time" 
            value={startTime} 
            onChange={e => setStartTime(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Jam Tutup Absen</label>
          <input 
            type="time" 
            value={endTime} 
            onChange={e => setEndTime(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isActive} 
              onChange={e => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            Aktifkan Pembatasan Waktu
          </label>
          
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm font-bold w-full sm:w-auto sm:ml-auto"
          >
            <Save size={18} />
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
      {msg && (
        <div className="mt-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
          {msg}
        </div>
      )}
    </div>
  );
}
