"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function MemberDashboard({ member, setting }: { member: any, setting: any }) {
  const [day, setDay] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleAbsen = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim: member.nim, day }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: `Berhasil absen untuk Hari ke-${data.day}` });
      } else {
        setStatus({ type: 'error', msg: data.error || "Gagal melakukan absen" });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "Terjadi kesalahan jaringan" });
    } finally {
      setLoading(false);
    }
  };

  const presentDays = new Set(member.attendances.map((a: any) => a.day));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div className="max-w-2xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Anggota</h1>
            <p className="text-slate-500 text-sm mt-1">Selamat datang, {member.name}</p>
          </div>
          <LogoutButton />
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="bg-blue-600 p-6 text-white text-center">
            <h2 className="text-xl font-bold">Absen Mandiri</h2>
            <p className="text-blue-100 text-sm mt-1">
              Absensi dibuka jam {setting.startTime} - {setting.endTime}
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Hari Absensi</label>
              <select 
                value={day} 
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              >
                {Array.from({ length: 40 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>Hari ke-{i + 1}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAbsen}
              disabled={loading || !setting.isActive}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              {loading ? "Memproses..." : (!setting.isActive ? "Absen Ditutup Admin" : "Absen Sekarang")}
            </button>

            {status && (
              <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {status.type === 'success' ? <CheckCircle2 className="shrink-0 text-green-600" size={24} /> : <AlertCircle className="shrink-0 text-red-600" size={24} />}
                <p className="font-bold text-sm mt-0.5">{status.msg}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold mb-4">Riwayat Kehadiran Anda (Total: {presentDays.size})</h2>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {Array.from({ length: 40 }).map((_, i) => {
              const isPresent = presentDays.has(i + 1);
              return (
                <div 
                  key={i} 
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border ${
                    isPresent 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-bold mb-1">H{i + 1}</span>
                  {isPresent ? '✓' : '-'}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
