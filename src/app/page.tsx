import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, Calendar, Activity, 
  Fingerprint, ArrowUpRight, Users, ChevronRight
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D14] text-slate-900 dark:text-white font-sans overflow-hidden relative selection:bg-purple-500/30">
      
      {/* Background Gradients & Textures */}
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-[#7F56FF]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#80FF56]/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* Grid Lines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      {/* Cyberpunk Tech Lines */}
      <div className="absolute bottom-[5%] right-[5%] flex gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
      </div>
      <div className="absolute bottom-[5%] right-[8%] w-32 h-px bg-slate-200 dark:bg-slate-800"></div>

      <div className="container mx-auto px-6 py-6 md:py-8 min-h-screen flex flex-col relative z-10">
        
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-8 md:mb-12">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center shrink-0">
              <Image src="/newlogokkn.png" alt="Logo KKN" width={64} height={64} className="object-contain w-14 h-14 md:w-16 md:h-16" />
            </div>
            
            {/* Mobile Logo Text */}
            <div className="flex flex-col leading-[1.1] md:hidden">
              <span className="font-bold text-sm tracking-widest text-slate-900 dark:text-white uppercase">KKN</span>
              <span className="font-medium text-[9px] tracking-widest text-slate-600 dark:text-slate-400 uppercase">SUMANDING</span>
              <span className="font-bold text-sm tracking-widest text-[#80FF56]">2026</span>
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
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 flex-1 items-center pb-20 md:pb-0">
          
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start relative z-20 w-full">
            
            {/* Mobile Fingerprint Background overlay */}
            <div className="absolute top-10 right-[-10%] w-64 h-64 lg:hidden flex items-center justify-center opacity-[0.25] pointer-events-none overflow-hidden z-[-1]">
              <div className="absolute w-[250px] h-[250px] border border-[#7F56FF]/40 rounded-full"></div>
              <div className="absolute w-[180px] h-[180px] border border-[#7F56FF]/50 rounded-full border-dashed"></div>
              <Fingerprint className="w-28 h-28 text-[#7F56FF]" strokeWidth={1} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px]">
                 <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#80FF56]"></div>
                 <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#80FF56]"></div>
                 <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#80FF56]"></div>
                 <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#80FF56]"></div>
               </div>
            </div>

            {/* Tag Pill */}
            <div 
              className="relative inline-flex items-center gap-3 mb-5 md:mb-6 p-px bg-slate-200 dark:bg-slate-700/50"
              style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
            >
              <div 
                className="flex items-center gap-3 px-3 py-1.5 bg-slate-100 dark:bg-[#101217]"
                style={{ clipPath: "polygon(11px 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%, 0 11px)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#80FF56] shadow-[0_0_8px_#80FF56]"></div>
                <span className="text-[9px] md:text-xs font-bold tracking-widest text-slate-700 dark:text-slate-300 uppercase">Sistem Absensi Terintegrasi</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black uppercase tracking-tight leading-[0.95] mb-4 md:mb-5">
              <div className="text-slate-900 dark:text-white drop-shadow-md">REKAM</div>
              <div className="text-slate-900 dark:text-white drop-shadow-md">KEHADIRAN</div>
              <div className="text-[#7F56FF] drop-shadow-[0_0_20px_rgba(127,86,255,0.4)]">LEBIH CEPAT.</div>
            </h1>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 text-[13px] md:text-base max-w-md mb-6 md:mb-8 leading-relaxed pr-4 md:pr-0">
              Platform absensi modern yang dirancang khusus untuk peserta KKN Sumanding 2026. Mendukung pemindaian QR Code cepat dan rekapan otomatis selama 40 hari pengabdian.
            </p>

            {/* Action Button */}
            <Link href="/login" className="inline-flex group relative">
              <div 
                className="flex items-center bg-linear-to-r from-purple-600 to-[#7F56FF] p-[2px] transition-transform group-hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(127,86,255,0.3)]" 
                style={{ clipPath: "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)" }}
              >
                <div 
                  className="flex items-stretch bg-[#150F26] group-hover:bg-[#1D1438] transition-colors"
                  style={{ clipPath: "polygon(11px 0, calc(100% - 11px) 0, 100% 11px, 100% calc(100% - 11px), calc(100% - 11px) 100%, 11px 100%, 0 calc(100% - 11px), 0 11px)" }}
                >
                  <div className="px-8 py-3.5 md:py-4 font-bold tracking-widest text-slate-900 dark:text-white text-xs md:text-sm flex items-center justify-center">
                    LOGIN
                  </div>
                  <div className="px-4 py-3.5 md:py-4 border-l border-slate-300 dark:border-white/10 flex items-center justify-center bg-slate-200/50 dark:bg-white/5">
                     <ArrowUpRight className="w-5 h-5 text-[#80FF56]" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Location (Desktop Only) */}
            <div className="mt-12 hidden md:flex items-center gap-3">
              <MapPin className="w-6 h-6 text-[#80FF56]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 tracking-widest uppercase">Sumanding</span>
                <span className="text-[10px] font-bold text-[#80FF56] tracking-widest uppercase">2026</span>
              </div>
            </div>
            
            {/* Mobile Dashboard Cards (Hidden on Desktop) */}
            <div className="flex flex-col gap-3 w-full lg:hidden mt-10">
              
              {/* Mobile Card 1 */}
              <div className="w-full flex items-center p-4 bg-slate-100 dark:bg-[#101217] rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
                <div className="absolute left-0 top-0 w-[2px] h-full bg-linear-to-b from-purple-500 to-transparent"></div>
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 shrink-0 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 tracking-widest uppercase mb-0.5">Anggota KKN</span>
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white mb-1">Sumanding 2026</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#80FF56] leading-none">128</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500">Anggota Aktif</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-purple-600 shrink-0" />
                </div>
              </div>

              {/* Mobile Card 2 */}
              <div className="w-full flex items-center p-4 bg-slate-100 dark:bg-[#101217] rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
                <div className="absolute left-0 top-0 w-[2px] h-full bg-linear-to-b from-green-500 to-transparent"></div>
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 shrink-0 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 tracking-widest uppercase mb-0.5">Kehadiran Hari Ini</span>
                    <span className="text-lg font-bold text-[#80FF56] mb-0.5">Hari ke-12</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">Rabu, 16 Juli 2026</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-purple-600 shrink-0" />
                </div>
              </div>

              {/* Mobile Card 3 */}
              <div className="w-full flex items-center p-4 bg-slate-100 dark:bg-[#101217] rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
                <div className="absolute left-0 top-0 w-[2px] h-full bg-linear-to-b from-purple-500 to-transparent"></div>
                <div className="flex items-center gap-4 w-full">
                  <div className="w-14 h-14 shrink-0 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 tracking-widest uppercase">Sesi Aktif</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#80FF56]"></div>
                    </div>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 mb-2">Progress Absensi</span>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-[#1A1C23] rounded-full overflow-hidden">
                        <div className="h-full w-[70%] bg-[#80FF56]"></div>
                      </div>
                      <span className="text-lg font-bold text-[#80FF56] leading-none">70%</span>
                    </div>
                    <span className="text-[9px] text-slate-500 dark:text-slate-500 mt-1">28 / 40 Hari</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column - Desktop Cyberpunk Dashboard Cards (Hidden on Mobile) */}
          <div className="hidden lg:block lg:col-span-6 relative min-h-[480px] w-full mt-12 lg:mt-0 z-10">
            
            {/* SVG Gradient Defs */}
            <svg width="0" height="0" className="absolute">
              <linearGradient id="purple-green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop stopColor="#7F56FF" offset="0%" />
                <stop stopColor="#80FF56" offset="100%" />
              </linearGradient>
            </svg>

            {/* Circular Grid Background (Desktop only) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-slate-200 dark:border-slate-800/50 rounded-full flex items-center justify-center pointer-events-none">
              <div className="w-[300px] h-[300px] border border-slate-300 dark:border-slate-700/30 rounded-full border-dashed"></div>
              <div className="absolute w-[500px] h-px bg-slate-200 dark:bg-slate-800/30 rotate-45"></div>
              <div className="absolute w-[500px] h-px bg-slate-200 dark:bg-slate-800/30 -rotate-45"></div>
            </div>

            {/* Card 1: ANGGOTA KKN */}
            <div 
              className="absolute -top-4 right-0 xl:right-4 w-[280px] xl:w-[320px] p-px bg-slate-200 dark:bg-slate-700/50 shadow-2xl" 
              style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
            >
              <div 
                className="bg-white dark:bg-[#12141C] p-7 h-full flex justify-between items-start" 
                style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}
              >
                <div>
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 tracking-widest uppercase mb-1">Anggota KKN</div>
                  <div className="text-sm xl:text-base font-bold text-slate-900 dark:text-white mb-3">Sumanding 2026</div>
                  <div className="text-4xl xl:text-5xl font-black text-[#80FF56] mb-1">128</div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">Anggota Aktif</div>
                </div>
                <div className="mt-4">
                  <Users className="w-16 h-16 xl:w-20 xl:h-20 drop-shadow-[0_0_15px_rgba(127,86,255,0.4)]" stroke="url(#purple-green-grad)" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Card 2: KEHADIRAN HARI INI */}
            <div 
              className="absolute top-[40%] xl:top-[42%] left-0 -translate-y-1/2 w-[220px] xl:w-[260px] p-px bg-slate-200 dark:bg-slate-700/50 shadow-2xl z-20" 
              style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
            >
              <div 
                className="bg-white dark:bg-[#12141C] p-5 h-full" 
                style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <Calendar className="w-4 h-4 text-[#7F56FF]" />
                  <span className="text-[9px] xl:text-[10px] font-bold text-slate-600 dark:text-slate-400 tracking-widest uppercase">Kehadiran Hari Ini</span>
                </div>
                <div className="text-xl xl:text-2xl font-bold text-[#80FF56] mb-1">Hari ke-12</div>
                <div className="text-xs text-slate-500 dark:text-slate-500">Rabu, 16 Juli 2026</div>
              </div>
            </div>

            {/* Card 3: SESI AKTIF */}
            <div 
              className="absolute bottom-0 right-0 xl:right-4 w-[280px] xl:w-[340px] p-px bg-slate-200 dark:bg-slate-700/50 shadow-2xl" 
              style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
            >
              <div 
                className="bg-white dark:bg-[#12141C] p-6 h-full" 
                style={{ clipPath: "polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))" }}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-[#7F56FF]" />
                    <span className="text-[9px] xl:text-[10px] font-bold text-slate-900 dark:text-white tracking-widest uppercase">Sesi Aktif</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#80FF56] shadow-[0_0_8px_#80FF56]"></div>
                </div>
                <div className="mb-3 flex justify-between items-center">
                  <span className="text-[10px] xl:text-xs text-slate-600 dark:text-slate-400">Progress Absensi</span>
                  <span className="text-lg xl:text-xl font-bold text-[#80FF56]">70%</span>
                </div>
                <div 
                  className="h-2.5 w-full bg-slate-50 dark:bg-[#0B0D14] mb-3 relative" 
                  style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                >
                  <div className="absolute top-0 left-0 h-full w-[70%] bg-[#80FF56] shadow-[0_0_10px_#80FF56]"></div>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-500">28 / 40 Hari</div>
              </div>
            </div>

            {/* Fingerprint Scanner Graphic (Desktop only) */}
            <div className="flex absolute top-[55%] xl:top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 xl:w-40 xl:h-40 items-center justify-center z-0">
               <div className="absolute top-0 left-0 w-5 h-5 xl:w-6 xl:h-6 border-t-2 border-l-2 border-[#80FF56]"></div>
               <div className="absolute top-0 right-0 w-5 h-5 xl:w-6 xl:h-6 border-t-2 border-r-2 border-[#80FF56]"></div>
               <div className="absolute bottom-0 left-0 w-5 h-5 xl:w-6 xl:h-6 border-b-2 border-l-2 border-[#80FF56]"></div>
               <div className="absolute bottom-0 right-0 w-5 h-5 xl:w-6 xl:h-6 border-b-2 border-r-2 border-[#80FF56]"></div>
               <Fingerprint className="w-20 h-20 xl:w-24 xl:h-24 text-[#7F56FF] drop-shadow-[0_0_15px_rgba(127,86,255,0.8)]" strokeWidth={1} />
            </div>

          </div>
        </div>
      </div>



    </div>
  );
}
