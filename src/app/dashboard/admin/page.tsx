import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { QrCode, CalendarDays, ArrowLeft, Shield } from "lucide-react";
import LogoutButton from "../LogoutButton";
import SettingsPanel from "../SettingsPanel";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ResetAttendanceButton from "../ResetAttendanceButton";
import DeleteMemberAttendanceButton from "../DeleteMemberAttendanceButton";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const currentUser = await prisma.member.findUnique({
    where: { id: session.user.id }
  });

  if (!currentUser || !currentUser.isAdmin) {
    redirect("/dashboard");
  }

  let setting = await prisma.setting.findUnique({ where: { id: "global" } });
  if (!setting) {
    setting = await prisma.setting.create({
      data: { id: "global", startTime: "07:00", endTime: "09:00", isActive: true }
    });
  }

  const members = await prisma.member.findMany({
    include: { attendances: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen bg-[#0B0D14] text-white font-sans overflow-x-hidden relative selection:bg-[#7F56FF]/30 pb-20">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-[#7F56FF]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#80FF56]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      {/* Grid Lines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 p-px bg-slate-700/50" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#12141C] p-6 md:p-8 w-full" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border border-[#7F56FF]/30 bg-[#7F56FF]/10 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-[#7F56FF]" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-widest text-white drop-shadow-md mb-1">Dashboard Admin</h1>
                <p className="text-[#80FF56] text-xs tracking-widest uppercase font-bold">Kelola absensi KKN Sumanding 2026</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <Link 
                href="/dashboard" 
                className="flex items-center justify-center gap-2 bg-[#1A1C23] hover:bg-[#252836] border border-slate-700 text-slate-300 px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
              >
                <ArrowLeft size={16} />
                Kembali
              </Link>
              
              <Link 
                href="/scan" 
                className="flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-[#7F56FF] text-white px-5 py-3 text-xs font-bold tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(127,86,255,0.3)]"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
              >
                <QrCode size={16} className="text-[#80FF56]" />
                Buka Scanner
              </Link>
              
              <div className="flex items-center justify-end">
                <LogoutButton />
              </div>
            </div>

          </div>
        </header>

        {/* Settings Panel is a client component, we'll keep it as is but wrap it or let it handle its own styling if needed. But wait, SettingsPanel might look out of place if not styled. We'll leave it for now or assume it will be styled later, but let's wrap it in a dark border just in case. */}
        <SettingsPanel initialSetting={setting} />

        {/* Table Section */}
        <div className="p-px bg-slate-700/50 mt-10" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
          <div className="bg-[#12141C] w-full" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
            
            <div className="p-6 md:p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-[#7F56FF] w-6 h-6" />
                <h2 className="text-xl font-bold uppercase tracking-widest text-white">Rekap Kehadiran</h2>
              </div>
              <ResetAttendanceButton />
            </div>
            
            <div className="overflow-x-auto p-4 md:p-6 custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    <th className="p-4 border-b border-slate-800 pb-4">Nama Lengkap</th>
                    <th className="p-4 border-b border-slate-800 text-center pb-4">Total Hadir</th>
                    <th className="p-4 border-b border-slate-800 text-center pb-4">Aksi</th>
                    {Array.from({ length: 40 }).map((_, i) => (
                      <th key={i} className="p-4 border-b border-slate-800 text-center min-w-[45px] pb-4">
                        H{i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-800/50">
                  {members.map((member) => {
                    const presentDays = new Set(member.attendances.map(a => a.day));
                    return (
                      <tr key={member.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="p-4 font-bold text-slate-200 group-hover:text-white transition-colors">
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
                              <div className="w-5 h-5 bg-slate-800/50 flex items-center justify-center mx-auto text-slate-600" style={{ clipPath: "polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)" }}>
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
  );
}
