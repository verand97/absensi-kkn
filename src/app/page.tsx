import Link from "next/link";
import { ChevronRight, CheckCircle2, ScanFace } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen text-slate-100 overflow-hidden relative selection:bg-blue-500/30">
      
      <div className="container mx-auto px-6 py-12 md:py-24 min-h-screen flex flex-col justify-center">
        
        <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-3 opacity-0 animate-slide-up">
            <div className="bg-slate-800/50 p-2 rounded-xl backdrop-blur-md border border-white/5">
              <Image src="/newlogokkn.png" alt="Logo KKN" width={40} height={40} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">KKN Sumanding <span className="text-blue-400">2026</span></span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 items-center z-10 mt-16 lg:mt-0">
          
          {/* Left Column - Copy */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 opacity-0 animate-slide-up delay-100 shadow-[0_0_15px_rgba(127,86,255,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Sistem Absensi Terintegrasi
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 opacity-0 animate-slide-up delay-200 text-white">
              Presensi KKN, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400">
                Lebih Praktis dan Akurat.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 opacity-0 animate-slide-up delay-400 max-w-lg leading-relaxed">
              Sistem absensi digital yang dirancang khusus untuk mahasiswa KKN Sumanding 2026. Lakukan pemindaian QR Code secara instan dan pantau rekapitulasi kehadiran otomatis sepanjang 40 hari pengabdian.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-slide-up delay-300">
              <Link href="/login" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-white transition-all duration-300 bg-blue-600 rounded-2xl hover:bg-blue-500 shadow-[0_0_20px_rgba(127,86,255,0.3)] hover:shadow-[0_0_30px_rgba(127,86,255,0.6)] hover:-translate-y-1">
                <span>Masuk ke Dashboard</span>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6 opacity-0 animate-slide-up delay-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400 drop-shadow-[0_0_10px_rgba(127,86,255,0.8)]" />
                <span className="text-sm text-slate-300 font-medium">Data Real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400 drop-shadow-[0_0_10px_rgba(127,86,255,0.8)]" />
                <span className="text-sm text-slate-300 font-medium">Aman & Terenkripsi</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual/Mockup */}
          <div className="relative hidden lg:block opacity-0 animate-slide-up delay-300">
            <div className="absolute inset-0 bg-linear-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative w-full aspect-square max-w-md mx-auto mt-8">
              {/* Floating Card 1 */}
              <div className="absolute top-10 -left-10 w-64 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl animate-float z-20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Image src="/newlogokkn.png" alt="Avatar" width={24} height={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Anggota KKN</div>
                    <div className="text-xs text-slate-400">Sumanding 2026</div>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5">
                  <span className="text-xs text-slate-400">Kehadiran</span>
                  <span className="text-sm font-bold text-green-400 drop-shadow-[0_0_8px_rgba(128,255,86,0.6)]">Hari ke-12</span>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute bottom-20 -right-10 w-72 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl animate-float-delayed z-20">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-bold text-white">Sesi Aktif</div>
                  <div className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_10px_rgba(128,255,86,1)]"></span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-blue-500 to-indigo-500 w-[70%] shadow-[0_0_15px_rgba(127,86,255,0.8)]"></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Progress Absensi</span>
                    <span className="text-white font-bold">70%</span>
                  </div>
                </div>
              </div>

              {/* Center Element - Stylized Scan Placeholder */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-linear-to-br from-blue-500 to-purple-600 rounded-3xl p-[2px] shadow-[0_0_40px_-5px_rgba(127,86,255,0.6)] rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <ScanFace className="w-16 h-16 text-blue-400 animate-pulse mb-2 drop-shadow-[0_0_15px_rgba(127,86,255,1)]" />
                  <span className="text-xs font-bold text-blue-200 tracking-wider">SCAN QR</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
