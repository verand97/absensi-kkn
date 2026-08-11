import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, Calendar, Activity, 
  Fingerprint, ArrowUpRight, Users
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import CountdownTimer from "@/components/CountdownTimer";
import { prisma } from "@/lib/prisma";
import { getTodayIndonesianDate, getCurrentDayFromStartDate } from "@/lib/dateUtils";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const totalMembers = await prisma.member.count();
  const autoDay = getCurrentDayFromStartDate();
  let setting = await prisma.setting.findUnique({ where: { id: "global" } });

  if (!setting) {
    setting = await prisma.setting.create({
      data: { id: "global", startTime: "07:00", endTime: "09:00", isActive: false, currentDay: autoDay }
    });
  } else if (setting.currentDay !== autoDay) {
    setting = await prisma.setting.update({
      where: { id: "global" },
      data: { currentDay: autoDay, isActive: false }
    });
  }

  const currentDay = setting.currentDay;
  const todayInfo = getTodayIndonesianDate();
  const progressPercent = Math.min(Math.round((currentDay / 40) * 100), 100);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#0B0D14] text-slate-900 dark:text-white font-sans relative selection:bg-purple-500/30">
      
      {/* Background Gradients & Textures */}
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-[#7F56FF]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#80FF56]/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* Grid Lines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      {/* Cyberpunk Tech Lines */}
      <div className="absolute bottom-[4%] right-[5%] hidden md:flex gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
      </div>
      <div className="absolute bottom-[4%] right-[8%] hidden md:block w-32 h-px bg-slate-200 dark:bg-slate-800"></div>

      <div className="container mx-auto px-5 md:px-6 h-full flex flex-col relative z-10 py-3 md:py-5">
        
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-3 md:mb-6 shrink-0">
          
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center justify-center shrink-0">
              <Image src="/newlogokkn.png" alt="Logo KKN" width={64} height={64} className="object-contain w-10 h-10 md:w-14 md:h-14" />
            </div>
            
            {/* Mobile Logo Text */}
            <div className="flex flex-col leading-[1.1] md:hidden">
              <span className="font-bold text-xs tracking-widest text-slate-900 dark:text-white uppercase">KKN</span>
              <span className="font-medium text-[8px] tracking-widest text-slate-600 dark:text-slate-400 uppercase">SUMANDING</span>
              <span className="font-bold text-xs tracking-widest text-[#80FF56]">2026</span>
            </div>

            {/* Desktop Logo Text */}
            <div className="hidden md:flex flex-col leading-none">
              <span className="font-bold text-base tracking-widest text-slate-900 dark:text-white uppercase">KKN SUMANDING</span>
              <span className="font-bold text-base tracking-widest text-[#80FF56]">2026</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>

        </nav>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-8 flex-1 min-h-0 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start relative z-20 w-full h-full justify-center overflow-hidden">
            
            {/* Mobile Fingerprint Background overlay */}
            <div className="absolute top-2 right-[-8%] w-40 h-40 lg:hidden flex items-center justify-center opacity-[0.2] pointer-events-none overflow-hidden z-[-1]">
              <div className="absolute w-40 h-40 border border-[#7F56FF]/40 rounded-full"></div>
              <div className="absolute w-28 h-28 border border-[#7F56FF]/50 rounded-full border-dashed"></div>
              <Fingerprint className="w-16 h-16 text-[#7F56FF]" strokeWidth={1} />
            </div>

            {/* Tag Pill */}
            <div 
              className="relative inline-flex items-center gap-3 mb-2.5 md:mb-5 p-px bg-slate-200 dark:bg-slate-700/50"
              style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
            >
              <div 
                className="flex items-center gap-2 md:gap-3 px-2.5 py-1 md:px-3 md:py-1.5 bg-slate-100 dark:bg-[#101217]"
                style={{ clipPath: "polygon(11px 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%, 0 11px)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#80FF56] shadow-[0_0_8px_#80FF56]"></div>
                <span className="text-[8px] md:text-xs font-bold tracking-widest text-slate-700 dark:text-slate-300 uppercase">Sistem Absensi Terintegrasi</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] font-black uppercase tracking-tight leading-[0.95] mb-2 md:mb-4">
              <div className="text-slate-900 dark:text-white drop-shadow-md">REKAM</div>
              <div className="text-slate-900 dark:text-white drop-shadow-md">KEHADIRAN</div>
              <div className="text-[#7F56FF] drop-shadow-[0_0_20px_rgba(127,86,255,0.4)]">LEBIH CEPAT.</div>
            </h1>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 text-[11px] md:text-sm lg:text-base max-w-md mb-3 md:mb-5 leading-relaxed pr-4 md:pr-0 line-clamp-3 md:line-clamp-none">
              Platform absensi modern yang dirancang khusus untuk peserta KKN Sumanding 2026. Mendukung pemindaian QR Code cepat dan rekapan otomatis selama 40 hari pengabdian.
            </p>

            {/* Countdown Widget */}
            <div className="w-full max-w-md mb-3 md:mb-5 scale-90 origin-left md:scale-100">
              <CountdownTimer title="COUNTDOWN TO THE CLOSING OF KKN (04 SEPT 2026)" />
            </div>

            {/* Call to Action Button */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <Link href="/dashboard" className="relative p-px bg-[#7F56FF] group-hover:bg-[#80FF56] transition-colors" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                <div 
                  className="flex items-stretch bg-[#150F26] group-hover:bg-[#1D1438] transition-colors"
                  style={{ clipPath: "polygon(11px 0, calc(100% - 11px) 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 11px 100%, 0 calc(100% - 11px), 0 11px)" }}
                >
                  <div className="px-6 py-2.5 md:px-8 md:py-3.5 font-bold tracking-widest text-white text-[11px] md:text-sm flex items-center justify-center">
                    LOGIN
                  </div>
                  <div className="px-3 py-2.5 md:px-4 md:py-3.5 border-l border-slate-300 dark:border-white/10 flex items-center justify-center bg-slate-200/50 dark:bg-white/5">
                     <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-[#80FF56]" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Location (Desktop Only) */}
            <div className="mt-6 hidden md:flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#80FF56]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 tracking-widest uppercase">Sumanding</span>
                <span className="text-[10px] font-bold text-[#80FF56] tracking-widest uppercase">2026</span>
              </div>
            </div>
            
            {/* Mobile Compact Stat Row (Hidden on Desktop) */}
            <div className="grid grid-cols-3 gap-1.5 w-full lg:hidden mt-4">
              
              {/* Stat 1 */}
              <div className="flex flex-col items-center justify-center p-2 bg-slate-100 dark:bg-[#101217] rounded-lg border border-slate-200 dark:border-slate-800 shadow-md">
                <Users className="w-3.5 h-3.5 text-purple-400 mb-1" />
                <span className="text-base font-black text-[#80FF56] leading-none">{totalMembers}</span>
                <span className="text-[7px] font-bold text-slate-500 dark:text-slate-500 tracking-wide uppercase mt-0.5 text-center">Anggota</span>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center justify-center p-2 bg-slate-100 dark:bg-[#101217] rounded-lg border border-slate-200 dark:border-slate-800 shadow-md">
                <Calendar className="w-3.5 h-3.5 text-purple-400 mb-1" />
                <span className="text-base font-black text-[#80FF56] leading-none">H-{currentDay}</span>
                <span className="text-[7px] font-bold text-slate-500 dark:text-slate-500 tracking-wide uppercase mt-0.5 text-center">{todayInfo.dayName}</span>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center justify-center p-2 bg-slate-100 dark:bg-[#101217] rounded-lg border border-slate-200 dark:border-slate-800 shadow-md">
                <Activity className="w-3.5 h-3.5 text-purple-400 mb-1" />
                <span className="text-base font-black text-[#80FF56] leading-none">{progressPercent}%</span>
                <span className="text-[7px] font-bold text-slate-500 dark:text-slate-500 tracking-wide uppercase mt-0.5 text-center">{currentDay}/40 Hari</span>
              </div>

            </div>
          </div>

          {/* Right Column - Desktop Dashboard Cards (Hidden on Mobile) */}
          <div className="hidden lg:block lg:col-span-6 relative h-full max-h-[85vh] w-full z-10">
            
            {/* SVG Gradient Defs */}
            <svg width="0" height="0" className="absolute">
              <linearGradient id="purple-green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop stopColor="#7F56FF" offset="0%" />
                <stop stopColor="#80FF56" offset="100%" />
              </linearGradient>
            </svg>

            {/* Circular Grid Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 xl:w-96 xl:h-96 border border-slate-200 dark:border-slate-800/50 rounded-full flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 xl:w-64 xl:h-64 border border-slate-300 dark:border-slate-700/30 rounded-full border-dashed"></div>
              <div className="absolute w-96 xl:w-md h-px bg-slate-200 dark:bg-slate-800/30 rotate-45"></div>
              <div className="absolute w-96 xl:w-md h-px bg-slate-200 dark:bg-slate-800/30 -rotate-45"></div>
            </div>

            {/* Card 1: ANGGOTA KKN */}
            <div 
              className="absolute top-0 right-0 xl:right-4 w-56 xl:w-70 p-px bg-slate-200 dark:bg-slate-700/50 shadow-2xl" 
              style={{ clipPath: "polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)" }}
            >
              <div 
                className="bg-white dark:bg-[#12141C] p-4 xl:p-5 h-full flex justify-between items-start" 
                style={{ clipPath: "polygon(17px 0, 100% 0, 100% calc(100% - 17px), calc(100% - 17px) 100%, 0 100%, 0 17px)" }}
              >
                <div>
                  <div className="text-[9px] font-bold text-slate-600 dark:text-slate-400 tracking-widest uppercase mb-1">Anggota KKN</div>
                  <div className="text-xs xl:text-sm font-bold text-slate-900 dark:text-white mb-2">Sumanding 2026</div>
                  <div className="text-3xl xl:text-4xl font-black text-[#80FF56] mb-1">{totalMembers}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-500">Anggota Aktif</div>
                </div>
                <Users className="w-12 h-12 xl:w-14 xl:h-14 drop-shadow-[0_0_15px_rgba(127,86,255,0.4)] mt-2" stroke="url(#purple-green-grad)" strokeWidth={1.5} />
              </div>
            </div>

            {/* Card 2: KEHADIRAN HARI INI */}
            <div 
              className="absolute top-[42%] left-0 -translate-y-1/2 w-46 xl:w-56 p-px bg-slate-200 dark:bg-slate-700/50 shadow-2xl z-20" 
              style={{ clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)" }}
            >
              <div 
                className="bg-white dark:bg-[#12141C] p-4 h-full" 
                style={{ clipPath: "polygon(13px 0, 100% 0, 100% calc(100% - 13px), calc(100% - 13px) 100%, 0 100%, 0 13px)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-3.5 h-3.5 text-[#7F56FF]" />
                  <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 tracking-widest uppercase">Kehadiran Hari Ini</span>
                </div>
                <div className="text-lg xl:text-xl font-bold text-[#80FF56] mb-1">Hari ke-{currentDay}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-500">{todayInfo.fullFormatted}</div>
              </div>
            </div>

            {/* Card 3: SESI AKTIF / DITUTUP */}
            <div 
              className="absolute bottom-0 right-0 xl:right-4 w-56 xl:w-72 p-px bg-slate-200 dark:bg-slate-700/50 shadow-2xl" 
              style={{ clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))" }}
            >
              <div 
                className="bg-white dark:bg-[#12141C] p-4 xl:p-5 h-full" 
                style={{ clipPath: "polygon(0 0, calc(100% - 17px) 0, 100% 17px, 100% 100%, 17px 100%, 0 calc(100% - 17px))" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#7F56FF]" />
                    <span className="text-[9px] font-bold text-slate-900 dark:text-white tracking-widest uppercase">
                      {setting.isActive ? "Sesi Aktif" : "Sesi Ditutup"}
                    </span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${setting.isActive ? 'bg-[#80FF56] shadow-[0_0_8px_#80FF56]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></div>
                </div>
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">Progress Absensi</span>
                  <span className="text-base xl:text-lg font-bold text-[#80FF56]">{progressPercent}%</span>
                </div>
                <div 
                  className="h-2 w-full bg-slate-50 dark:bg-[#0B0D14] mb-2 relative" 
                  style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                >
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#80FF56] shadow-[0_0_10px_#80FF56] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-500">{currentDay} / 40 Hari</div>
              </div>
            </div>

            {/* Fingerprint Scanner Graphic */}
            <div className="flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 xl:w-32 xl:h-32 items-center justify-center z-0">
               <div className="absolute top-0 left-0 w-4 h-4 xl:w-5 xl:h-5 border-t-2 border-l-2 border-[#80FF56]"></div>
               <div className="absolute top-0 right-0 w-4 h-4 xl:w-5 xl:h-5 border-t-2 border-r-2 border-[#80FF56]"></div>
               <div className="absolute bottom-0 left-0 w-4 h-4 xl:w-5 xl:h-5 border-b-2 border-l-2 border-[#80FF56]"></div>
               <div className="absolute bottom-0 right-0 w-4 h-4 xl:w-5 xl:h-5 border-b-2 border-r-2 border-[#80FF56]"></div>
               <Fingerprint className="w-16 h-16 xl:w-20 xl:h-20 text-[#7F56FF] drop-shadow-[0_0_15px_rgba(127,86,255,0.8)]" strokeWidth={1} />
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}