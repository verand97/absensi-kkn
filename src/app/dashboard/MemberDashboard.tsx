"use client";

import { QrCode } from "lucide-react";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

interface SettingData {
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface MemberData {
  name: string;
  nim: string;
  attendances: { day: number }[];
}

export default function MemberDashboard({ member, setting }: { member: MemberData, setting: SettingData }) {
  const presentDays = new Set(member.attendances.map((a: { day: number }) => a.day));

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
          
          <div className="p-6 text-center">
            <p className="text-slate-600 mb-6 font-medium">
              Silakan minta QR Code Absensi dari Admin, lalu scan menggunakan tombol di bawah ini.
            </p>
            <Link
              href="/scan-member"
              className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <QrCode size={20} />
              Scan QR Absensi
            </Link>
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
