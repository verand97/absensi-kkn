"use client";

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        const data = await res.json();
        setError(data.error?.toUpperCase() || "GAGAL LOGIN");
      }
    } catch {
      setError("ERROR JARINGAN/SISTEM");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D14] text-white font-sans overflow-hidden flex items-center justify-center p-4 relative selection:bg-[#7F56FF]/30">
      
      {/* Background Gradients & Grid */}
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-[#7F56FF]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#80FF56]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <Link href="/" className="absolute -top-12 left-0 text-slate-500 hover:text-[#80FF56] transition-colors flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
          <ArrowLeft size={16} /> Kembali
        </Link>
        
        <div className="p-px bg-slate-700/50 shadow-2xl" style={{ clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)" }}>
          <div className="bg-[#12141C] p-8 md:p-10" style={{ clipPath: "polygon(23px 0, 100% 0, 100% calc(100% - 23px), calc(100% - 23px) 100%, 0 100%, 0 23px)" }}>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <Image 
                  src="/newlogokkn.png" 
                  alt="Logo KKN Sumanding 2026" 
                  width={80} 
                  height={80} 
                  className="object-contain w-20 h-20" 
                />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-widest text-white drop-shadow-md">Portal Anggota</h1>
              <p className="text-[#80FF56] text-xs font-bold uppercase tracking-widest mt-1">Sistem Absensi Terintegrasi</p>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 text-xs font-bold uppercase tracking-widest mb-6 border border-red-500/30 text-center" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-[#090A0F] border border-slate-700 text-white focus:outline-none focus:border-[#7F56FF] transition-colors font-mono appearance-none placeholder-slate-600"
                  style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                  placeholder="Contoh: Mohamad Alfan Ni'am"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">NIM (Kata Sandi)</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 pr-12 bg-[#090A0F] border border-slate-700 text-white focus:outline-none focus:border-[#7F56FF] transition-colors font-mono appearance-none placeholder-slate-600"
                    style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                    placeholder="Masukkan NIM"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-[#7F56FF] text-white font-black py-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(127,86,255,0.4)] disabled:opacity-50 text-xs tracking-widest uppercase"
                  style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                >
                  {loading ? "MEMPROSES..." : "LOGIN"}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
}
