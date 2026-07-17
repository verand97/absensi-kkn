"use client";

import { useState } from "react";
import Link from "next/link";
import { QrCode, CalendarDays, ArrowLeft, Shield, Settings, Users, LayoutDashboard } from "lucide-react";
import LogoutButton from "../LogoutButton";
import SettingsPanel from "../SettingsPanel";
import ResetAttendanceButton from "../ResetAttendanceButton";
import { ThemeToggle } from "@/components/theme-toggle";
import DeleteMemberAttendanceButton from "../DeleteMemberAttendanceButton";

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
  isAdmin: boolean;
  attendances: { day: number }[];
}

interface AdminDashboardClientProps {
  setting: SettingData;
  members: MemberData[];
}

export default function AdminDashboardClient({ setting, members }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'sesi' | 'anggota'>('sesi');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D14] text-slate-900 dark:text-white font-sans overflow-x-hidden relative selection:bg-[#7F56FF]/30 pb-24 md:pb-8">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-[#7F56FF]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#80FF56]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      {/* Grid Lines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        
        {/* Header - Always visible */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 p-px bg-slate-200 dark:bg-slate-700/50" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-[#12141C] p-6 md:p-8 w-full" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border border-[#7F56FF]/30 bg-[#7F56FF]/10 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-[#7F56FF]" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white drop-shadow-md mb-1">Dashboard Admin</h1>
                <p className="text-[#80FF56] text-xs tracking-widest uppercase font-bold">Kelola absensi KKN Sumanding 2026</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <Link 
                href="/dashboard" 
                className="hidden md:flex items-center justify-center gap-2 bg-slate-100 dark:bg-[#1A1C23] hover:bg-[#252836] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
              >
                <ArrowLeft size={16} />
                Dasbor Member
              </Link>
              
              <Link 
                href="/scan" 
                className="hidden md:flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-[#7F56FF] text-slate-900 dark:text-white px-5 py-3 text-xs font-bold tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(127,86,255,0.3)]"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
              >
                <QrCode size={16} className="text-[#80FF56]" />
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
          <div className={`${activeTab === 'anggota' ? 'block' : 'hidden'} md:block p-px bg-slate-200 dark:bg-slate-700/50`} style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
            <div className="bg-white dark:bg-[#12141C] w-full" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
              
              <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-[#7F56FF] w-6 h-6" />
                  <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900 dark:text-white">Rekap Kehadiran</h2>
                </div>
                <ResetAttendanceButton />
              </div>
              
              <div className="overflow-x-auto p-4 md:p-6 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800 pb-4">Nama Lengkap</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800 text-center pb-4">Total Hadir</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800 text-center pb-4">Aksi</th>
                      {Array.from({ length: 40 }).map((_, i) => (
                        <th key={i} className="p-4 border-b border-slate-200 dark:border-slate-800 text-center min-w-[45px] pb-4">
                          H{i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-800/50">
                    {members.map((member) => {
                      const presentDays = new Set(member.attendances.map((a: { day: number }) => a.day));
                      return (
                        <tr key={member.id} className="hover:bg-slate-200 dark:bg-slate-800/30 transition-colors group">
                          <td className="p-4 font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            {member.name}
                            {member.isAdmin && (
                              <span className="ml-3 text-[9px] bg-[#7F56FF]/20 text-[#7F56FF] border border-[#7F56FF]/30 px-2 py-0.5 rounded-sm font-black tracking-widest uppercase shadow-[0_0_8px_rgba(127,86,255,0.2)]">
                                ADMIN
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center font-black text-xl text-[#80FF56]">
                            {presentDays.size}
                          </td>
                          <td className="p-4 text-center">
                            <DeleteMemberAttendanceButton memberId={member.id} memberName={member.name} />
                          </td>
                          {Array.from({ length: 40 }).map((_, i) => (
                            <td key={i} className="p-4 text-center">
                              {presentDays.has(i + 1) ? (
                                <div className="w-5 h-5 bg-[#80FF56]/20 border border-[#80FF56]/50 text-[#80FF56] flex items-center justify-center mx-auto shadow-[0_0_5px_rgba(128,255,86,0.2)]" style={{ clipPath: "polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)" }}>
                                  <span className="text-xs font-black">✓</span>
                                </div>
                              ) : (
                                <div className="w-5 h-5 bg-slate-200 dark:bg-slate-800/50 flex items-center justify-center mx-auto text-slate-600" style={{ clipPath: "polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)" }}>
                                  -
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
        </div>

      </div>

      {/* Mobile Bottom Navigation (Sticky for small screens) */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-200 dark:bg-[#090A0F]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/80 flex justify-between items-center px-6 py-3 md:hidden z-50">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 w-16 opacity-40 hover:opacity-100 transition-opacity">
          <LayoutDashboard className="w-6 h-6 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
          <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">Member</span>
        </Link>
        <button onClick={() => setActiveTab('sesi')} className={`flex flex-col items-center gap-1 w-16 relative ${activeTab === 'sesi' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
          {activeTab === 'sesi' && <div className="w-10 h-0.5 bg-[#7F56FF] absolute -top-3 rounded-b-sm shadow-[0_0_5px_#7F56FF]"></div>}
          <Settings className={`w-6 h-6 ${activeTab === 'sesi' ? 'text-[#7F56FF]' : 'text-slate-700 dark:text-slate-300'}`} strokeWidth={activeTab === 'sesi' ? 2 : 1.5} />
          <span className={`text-[10px] font-medium ${activeTab === 'sesi' ? 'text-[#7F56FF]' : 'text-slate-700 dark:text-slate-300'}`}>Sesi</span>
        </button>
        <button onClick={() => setActiveTab('anggota')} className={`flex flex-col items-center gap-1 w-16 relative ${activeTab === 'anggota' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
          {activeTab === 'anggota' && <div className="w-10 h-0.5 bg-[#80FF56] absolute -top-3 rounded-b-sm shadow-[0_0_5px_#80FF56]"></div>}
          <Users className={`w-6 h-6 ${activeTab === 'anggota' ? 'text-[#80FF56]' : 'text-slate-700 dark:text-slate-300'}`} strokeWidth={activeTab === 'anggota' ? 2 : 1.5} />
          <span className={`text-[10px] font-medium ${activeTab === 'anggota' ? 'text-[#80FF56]' : 'text-slate-700 dark:text-slate-300'}`}>Anggota</span>
        </button>
        <Link href="/scan" className="flex flex-col items-center gap-1 w-16 opacity-40 hover:opacity-100 transition-opacity">
          <QrCode className="w-6 h-6 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
          <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">Scanner</span>
        </Link>
      </div>

    </div>
  );
}
