import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { QrCode, CalendarDays } from "lucide-react";
import LogoutButton from "./LogoutButton";
import SettingsPanel from "./SettingsPanel";
import AdminAccountSettings from "./AdminAccountSettings";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import MemberDashboard from "./MemberDashboard";

import ResetAttendanceButton from "./ResetAttendanceButton";
import DeleteMemberAttendanceButton from "./DeleteMemberAttendanceButton";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const currentUser = await prisma.member.findUnique({
    where: { id: session.user.id },
    include: { attendances: true }
  });

  if (!currentUser) {
    redirect("/login");
  }

  let setting = await prisma.setting.findUnique({ where: { id: "global" } });
  if (!setting) {
    setting = await prisma.setting.create({
      data: { id: "global", startTime: "07:00", endTime: "09:00", isActive: true }
    });
  }

  if (!currentUser.isAdmin) {
    return <MemberDashboard member={currentUser} setting={setting} />;
  }

  const members = await prisma.member.findMany({
    include: { attendances: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Admin</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola absensi KKN Sumanding 2026</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Link 
              href="/scan" 
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm font-semibold"
            >
              <QrCode size={18} />
              Buka Scanner
            </Link>
            <LogoutButton />
          </div>
        </header>

        <AdminAccountSettings currentName={currentUser.name} currentNim={currentUser.nim} />

        <SettingsPanel initialSetting={setting} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-blue-500" />
              <h2 className="text-lg font-bold">Rekapitulasi Kehadiran</h2>
            </div>
            <ResetAttendanceButton />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-slate-200">Nama Lengkap</th>
                  <th className="p-4 font-semibold border-b border-slate-200 text-center">Total Hadir</th>
                  <th className="p-4 font-semibold border-b border-slate-200 text-center">Aksi</th>
                  {Array.from({ length: 40 }).map((_, i) => (
                    <th key={i} className="p-4 font-semibold border-b border-slate-200 text-center min-w-[50px]">
                      H{i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {members.map((member) => {
                  const presentDays = new Set(member.attendances.map(a => a.day));
                  return (
                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-medium whitespace-nowrap">
                        {member.name}
                        {member.isAdmin && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">ADMIN</span>}
                      </td>
                      <td className="p-4 text-center font-bold text-blue-600">
                        {presentDays.size}
                      </td>
                      <td className="p-4 text-center">
                        <DeleteMemberAttendanceButton memberId={member.id} memberName={member.name} />
                      </td>
                      {Array.from({ length: 40 }).map((_, i) => (
                        <td key={i} className="p-4 text-center">
                          {presentDays.has(i + 1) ? (
                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-sm">
                              ✓
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
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
  );
}

