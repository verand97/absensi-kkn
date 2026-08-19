"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { QrCode, CalendarDays, ArrowLeft, Settings, Users, LayoutDashboard, FileSpreadsheet, FileText, Search, Home } from "lucide-react";
import LogoutButton from "../LogoutButton";
import SettingsPanel from "../SettingsPanel";
import ResetAttendanceButton from "../ResetAttendanceButton";
import MarkAllAttendanceButton from "../MarkAllAttendanceButton";
import { ThemeToggle } from "@/components/theme-toggle";
import DeleteMemberAttendanceButton from "../DeleteMemberAttendanceButton";
import { exportToXLSX, exportToCSV } from "@/lib/exportAttendance";
import { getTodayIndonesianDate, getScheduledDateForDay } from "@/lib/dateUtils";
import CountdownTimer from "@/components/CountdownTimer";

interface SettingData {
  startTime: string;
  endTime: string;
  isActive: boolean;
  currentDay: number;
  qrToken: string;
}

interface MemberData {
  id: string;
  name: string;
  nim?: string;
  isAdmin: boolean;
  attendances: { day: number; createdAt?: string | Date }[];
}

interface AdminDashboardClientProps {
  setting: SettingData;
  members: MemberData[];
}

export default function AdminDashboardClient({ setting, members }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'sesi' | 'anggota'>('sesi');
  const [searchQuery, setSearchQuery] = useState("");
  const todayInfo = getTodayIndonesianDate();

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.nim && m.nim.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate daily attendance totals for summary row
  const dailyTotals = Array.from({ length: 40 }, (_, i) => {
    const dayNum = i + 1;
    return members.reduce(
      (acc, m) => acc + (m.attendances.some((a) => a.day === dayNum) ? 1 : 0),
      0
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F1A14] text-slate-900 dark:text-[#D7DDD6] font-sans overflow-x-hidden relative selection:bg-[#8FE398]/30 pb-24 md:pb-8">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-[#3E7A4F]/15 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8FE398]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      {/* Grid Lines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 relative z-10">
        
        {/* Header - Always visible */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-6 p-px bg-slate-200 dark:bg-[#1C3324]" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-[#14241B] p-6 md:p-8 w-full" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
            
            <div className="flex flex-col gap-2">
              <Link href="/" className="flex items-center gap-4 group cursor-pointer" title="Ke Halaman Awal / Landing Page">
                <div className="flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Image src="/newlogokkn.png" alt="Logo" width={56} height={56} className="object-contain w-14 h-14 drop-shadow-[0_0_10px_rgba(143,227,152,0.3)]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-slate-900 dark:text-white drop-shadow-md mb-1">Dashboard Admin</h1>
                  <p className="text-[#8FE398] text-xs tracking-widest uppercase font-bold">Kelola absensi KKN Sumanding 2026</p>
                </div>
              </Link>
              {/* Compact 1-line Header Countdown Widget (§3.3 Spec) */}
              <div className="mt-1">
                <CountdownTimer compact={true} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <Link 
                href="/" 
                className="hidden md:flex items-center justify-center gap-2 bg-slate-100 dark:bg-[#1C3324] hover:bg-slate-200 dark:hover:bg-[#24422E] border border-slate-300 dark:border-[#3E7A4F]/50 text-slate-700 dark:text-[#D7DDD6] px-4 py-3 text-xs font-bold tracking-widest uppercase transition-colors"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                title="Kembali ke Landing Page / Halaman Awal"
              >
                <Home size={16} className="text-[#8FE398]" />
                <span>Halaman Awal</span>
              </Link>
              <Link 
                href="/dashboard" 
                className="hidden md:flex items-center justify-center gap-2 bg-slate-100 dark:bg-[#1C3324] hover:bg-slate-200 dark:hover:bg-[#24422E] border border-slate-300 dark:border-[#3E7A4F]/50 text-slate-700 dark:text-[#D7DDD6] px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
              >
                <ArrowLeft size={16} />
                Dasbor Member
              </Link>
              
              <Link 
                href="/scan" 
                className="hidden md:flex items-center justify-center gap-2 bg-gradient-to-r from-[#326440] to-[#3E7A4F] hover:from-[#3E7A4F] hover:to-[#5FA872] text-white px-5 py-3 text-xs font-bold tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(62,122,79,0.3)]"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
              >
                <QrCode size={16} className="text-[#8FE398]" />
                Buka Scanner
              </Link>
              
              <div className="flex items-center justify-end gap-3">
                <ThemeToggle />
                <LogoutButton />
              </div>
            </div>

          </div>
        </header>

        {/* Desktop View: Show Both, Mobile View: Show based on activeTab */}
        <div className="space-y-10">
          
          {/* Sesi Panel */}
          <div className={`${activeTab === 'sesi' ? 'block' : 'hidden'} md:block`}>
            <SettingsPanel initialSetting={setting} />
          </div>

          {/* Table Section */}
          <div className={`${activeTab === 'anggota' ? 'block' : 'hidden'} md:block p-px bg-slate-200 dark:bg-[#1C3324] shadow-xl`} style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
            <div className="bg-white dark:bg-[#14241B] w-full" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
              
              <div className="p-6 md:p-8 border-b border-slate-200 dark:border-[#1C3324] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-[#8FE398] w-6 h-6 shrink-0" />
                  <div>
                    <h2 className="text-xl font-bold font-display uppercase tracking-widest text-slate-900 dark:text-white">Rekap Kehadiran</h2>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-slate-500 dark:text-[#9BA79C] font-medium mr-1">Total: {members.length} Anggota</span>
                      <span className="bg-[#3E7A4F]/20 text-[#8FE398] border border-[#3E7A4F]/30 px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs">
                        Hari: {todayInfo.dayName}
                      </span>
                      <span className="bg-[#8FE398]/20 text-[#8FE398] border border-[#8FE398]/30 px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs">
                        Tgl: {todayInfo.dateNum}
                      </span>
                      <span className="bg-[#E3A23E]/20 text-[#E3A23E] border border-[#E3A23E]/30 px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs">
                        Bulan: {todayInfo.monthName}
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs">
                        Tahun: {todayInfo.yearNum}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search input */}
                  <div className="relative flex-1 sm:flex-initial min-w-50">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#9BA79C]" />
                    <input
                      type="text"
                      placeholder="Cari nama / NIM..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-[#0F1A14] border border-slate-300 dark:border-[#1C3324] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#3E7A4F] transition-colors"
                      style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                    />
                  </div>

                  <button
                    onClick={() => exportToXLSX(members)}
                    className="flex items-center gap-2 bg-[#3E7A4F] hover:bg-[#5FA872] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                    title="Download Rekap Format XLSX (Excel)"
                  >
                    <FileSpreadsheet size={16} />
                    Download XLSX
                  </button>

                  <button
                    onClick={() => exportToCSV(members)}
                    className="flex items-center gap-2 bg-[#326440] hover:bg-[#3E7A4F] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                    title="Download Rekap Format CSV"
                  >
                    <FileText size={16} />
                    Download CSV
                  </button>

                  <MarkAllAttendanceButton currentDay={setting.currentDay} totalMembers={members.length} />
                  <ResetAttendanceButton />
                </div>
              </div>
              
              <div className="overflow-x-auto p-4 md:p-6 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-220">
                  <thead>
                    <tr className="text-slate-500 dark:text-[#9BA79C] text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-[#1C3324]">
                      {/* Sticky Name Column (§3.3 Spec: freeze column saat scroll horizontal) */}
                      <th className="p-4 pb-4 sticky left-0 z-20 bg-white dark:bg-[#14241B] shadow-[2px_0_8px_-2px_rgba(0,0,0,0.2)] dark:shadow-[2px_0_8px_-2px_rgba(0,0,0,0.6)] min-w-55">
                        Nama Lengkap & NIM
                      </th>
                      <th className="p-4 text-center pb-4 min-w-22.5">Total Hadir</th>
                      <th className="p-4 text-center pb-4 min-w-25">Aksi</th>
                      {Array.from({ length: 40 }).map((_, i) => {
                        const dayNum = i + 1;
                        const isCurrent = dayNum === setting.currentDay;
                        const dateInfo = getScheduledDateForDay(dayNum);
                        return (
                          <th 
                            key={i} 
                            className={`p-2 text-center min-w-14 pb-3 transition-colors ${
                              isCurrent 
                                ? 'text-[#8FE398] bg-[#8FE398]/10 border-b-2 border-[#8FE398]' 
                                : ''
                            }`}
                            title={`Hari Ke-${dayNum}: ${dateInfo.fullFormatted}`}
                          >
                            <span className="block font-bold">H{dayNum}</span>
                            <span className="block text-[8px] font-mono opacity-70">{dateInfo.dateNum}/{dateInfo.monthShort}</span>
                            {isCurrent && <span className="block text-[8px] text-[#8FE398] font-bold">AKTIF</span>}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-200 dark:divide-[#1C3324]/60">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={43} className="p-8 text-center text-slate-500 text-xs uppercase tracking-widest">
                          Tidak ada data anggota yang cocok dengan pencarian
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((member) => {
                        const presentDays = new Set(member.attendances.map((a: { day: number }) => a.day));
                        return (
                          <tr key={member.id} className="hover:bg-slate-100 dark:hover:bg-[#1C3324]/40 transition-colors group">
                            {/* Sticky Member Name & NIM */}
                            <td className="p-4 sticky left-0 z-10 bg-white dark:bg-[#14241B] group-hover:bg-slate-100 dark:group-hover:bg-[#1C3324] transition-colors shadow-[2px_0_8px_-2px_rgba(0,0,0,0.2)] dark:shadow-[2px_0_8px_-2px_rgba(0,0,0,0.6)]">
                              <div className="flex flex-col">
                                <span className="font-bold flex items-center text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                  {member.name}
                                  {member.isAdmin && (
                                    <span className="ml-2 text-[9px] bg-[#3E7A4F]/20 text-[#8FE398] border border-[#3E7A4F]/40 px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase">
                                      ADMIN
                                    </span>
                                  )}
                                </span>
                                {member.nim && (
                                  <span className="text-xs font-mono text-slate-500 dark:text-[#9BA79C] mt-0.5">
                                    NIM: {member.nim}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-center font-black text-xl text-[#8FE398]">
                              <span className="bg-[#8FE398]/10 px-3 py-1 border border-[#8FE398]/30 inline-block font-mono">
                                {presentDays.size}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <DeleteMemberAttendanceButton memberId={member.id} memberName={member.name} />
                            </td>
                            {Array.from({ length: 40 }).map((_, i) => (
                              <td key={i} className="p-3 text-center">
                                {presentDays.has(i + 1) ? (
                                  <div className="w-5 h-5 bg-[#8FE398]/20 border border-[#8FE398]/50 text-[#8FE398] flex items-center justify-center mx-auto shadow-[0_0_5px_rgba(143,227,152,0.3)]" style={{ clipPath: "polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)" }}>
                                    <span className="text-xs font-black">✓</span>
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 bg-slate-100 dark:bg-[#0F1A14] flex items-center justify-center mx-auto text-slate-400 dark:text-slate-600" style={{ clipPath: "polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)" }}>
                                    -
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {/* Footer Summary Row */}
                  <tfoot className="border-t-2 border-slate-300 dark:border-[#1C3324] bg-slate-100 dark:bg-[#0F1A14] font-bold text-xs">
                    <tr>
                      <td className="p-4 sticky left-0 z-10 bg-slate-100 dark:bg-[#0F1A14] text-slate-700 dark:text-[#D7DDD6] uppercase tracking-widest shadow-[2px_0_8px_-2px_rgba(0,0,0,0.2)] dark:shadow-[2px_0_8px_-2px_rgba(0,0,0,0.6)]">
                        TOTAL HADIR PER HARI
                      </td>
                      <td className="p-4 text-center text-slate-500 font-mono">-</td>
                      <td className="p-4 text-center text-slate-500 font-mono">-</td>
                      {dailyTotals.map((total, i) => (
                        <td key={i} className="p-3 text-center font-mono text-[#8FE398]">
                          {total}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          
        </div>

      </div>

      {/* Mobile Bottom Navigation (Sticky for small screens) */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-200 dark:bg-[#0F1A14]/95 backdrop-blur-xl border-t border-slate-200 dark:border-[#1C3324] flex justify-between items-center px-6 py-3 md:hidden z-50">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 w-16 opacity-40 hover:opacity-100 transition-opacity">
          <LayoutDashboard className="w-6 h-6 text-slate-700 dark:text-[#D7DDD6]" strokeWidth={1.5} />
          <span className="text-[10px] font-medium text-slate-700 dark:text-[#D7DDD6]">Member</span>
        </Link>
        <button onClick={() => setActiveTab('sesi')} className={`flex flex-col items-center gap-1 w-16 relative ${activeTab === 'sesi' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
          {activeTab === 'sesi' && <div className="w-10 h-0.5 bg-[#8FE398] absolute -top-3 rounded-b-sm shadow-[0_0_5px_#8FE398]"></div>}
          <Settings className={`w-6 h-6 ${activeTab === 'sesi' ? 'text-[#8FE398]' : 'text-slate-700 dark:text-[#D7DDD6]'}`} strokeWidth={activeTab === 'sesi' ? 2 : 1.5} />
          <span className={`text-[10px] font-medium ${activeTab === 'sesi' ? 'text-[#8FE398]' : 'text-slate-700 dark:text-[#D7DDD6]'}`}>Sesi</span>
        </button>
        <button onClick={() => setActiveTab('anggota')} className={`flex flex-col items-center gap-1 w-16 relative ${activeTab === 'anggota' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
          {activeTab === 'anggota' && <div className="w-10 h-0.5 bg-[#8FE398] absolute -top-3 rounded-b-sm shadow-[0_0_5px_#8FE398]"></div>}
          <Users className={`w-6 h-6 ${activeTab === 'anggota' ? 'text-[#8FE398]' : 'text-slate-700 dark:text-[#D7DDD6]'}`} strokeWidth={activeTab === 'anggota' ? 2 : 1.5} />
          <span className={`text-[10px] font-medium ${activeTab === 'anggota' ? 'text-[#8FE398]' : 'text-slate-700 dark:text-[#D7DDD6]'}`}>Anggota</span>
        </button>
        <Link href="/scan" className="flex flex-col items-center gap-1 w-16 opacity-40 hover:opacity-100 transition-opacity">
          <QrCode className="w-6 h-6 text-slate-700 dark:text-[#D7DDD6]" strokeWidth={1.5} />
          <span className="text-[10px] font-medium text-slate-700 dark:text-[#D7DDD6]">Scanner</span>
        </Link>
      </div>

    </div>
  );
}
