"use client";

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card";
import Button from "@/components/Button";

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F1A14] text-slate-900 dark:text-[#D7DDD6] font-sans overflow-hidden flex items-center justify-center p-4 relative selection:bg-[#8FE398]/30">
      
      {/* Background Gradients & Grid */}
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-[#3E7A4F]/15 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8FE398]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <Link href="/" className="absolute -top-12 left-0 text-slate-500 dark:text-[#9BA79C] hover:text-[#8FE398] transition-colors flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
          <ArrowLeft size={16} /> Kembali
        </Link>
        
        <Card cutSize="lg" className="shadow-2xl">
          <div className="p-8 md:p-10">
            
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center justify-center mb-4 group cursor-pointer" title="Kembali ke Halaman Awal">
                <Image 
                  src="/newlogokkn.png" 
                  alt="Logo KKN Sumanding 2026" 
                  width={80} 
                  height={80} 
                  className="object-contain w-20 h-20 group-hover:scale-105 transition-transform drop-shadow-[0_0_10px_rgba(143,227,152,0.3)]" 
                />
              </Link>
              <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-slate-900 dark:text-white drop-shadow-md">Portal Anggota</h1>
              <p className="text-[#8FE398] text-xs font-bold uppercase tracking-widest mt-1">Sistem Absensi Terintegrasi</p>
            </div>

            {error && (
              <div 
                className="bg-[#D9534F]/10 text-[#D9534F] p-4 text-xs font-bold uppercase tracking-widest mb-6 border border-[#D9534F]/30 text-center"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-[#9BA79C] uppercase tracking-widest mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-slate-200 dark:bg-[#0F1A14] border border-slate-300 dark:border-[#1C3324] text-slate-900 dark:text-white focus:outline-none focus:border-[#3E7A4F] transition-colors font-mono appearance-none placeholder-slate-500 dark:placeholder-slate-400"
                  style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                  placeholder="Contoh: Mohamad Alfan Ni'am"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-[#9BA79C] uppercase tracking-widest mb-2">NIM (Kata Sandi)</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 pr-12 bg-slate-200 dark:bg-[#0F1A14] border border-slate-300 dark:border-[#1C3324] text-slate-900 dark:text-white focus:outline-none focus:border-[#3E7A4F] transition-colors font-mono appearance-none placeholder-slate-500 dark:placeholder-slate-400"
                    style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                    placeholder="Masukkan NIM"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-[#9BA79C] hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  {loading ? "MEMPROSES..." : "LOGIN"}
                </Button>
              </div>
            </form>
            
          </div>
        </Card>
      </div>
    </div>
  );
}
