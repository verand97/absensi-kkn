"use client";

import { useState } from "react";
import { UserCog, Save, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface MemberData {
  name: string;
  nim: string;
}

export default function MemberAccountSettings({ member }: { member: MemberData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(member.name);
  const [editNim, setEditNim] = useState(member.nim);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setIsLoading(true);

    if (!editName.trim() || !editNim.trim()) {
      setStatus({ type: 'error', msg: 'NAMA DAN NIM TIDAK BOLEH KOSONG' });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, nim: editNim })
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: 'PROFIL DIPERBARUI' });
        setTimeout(() => {
          setIsEditing(false);
          setStatus(null);
          router.refresh();
        }, 1500);
      } else {
        setStatus({ type: 'error', msg: data.error?.toUpperCase() || 'GAGAL MEMPERBARUI' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'ERROR JARINGAN' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-px bg-slate-700/50 mt-8 mb-8" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
      <div className="bg-[#12141C] p-6 md:p-8" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
        
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <UserCog className="text-[#80FF56] w-6 h-6" />
            <h2 className="text-lg font-bold text-white uppercase tracking-widest">Pengaturan Akun</h2>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-[10px] font-bold tracking-widest uppercase text-[#7F56FF] hover:text-[#80FF56] transition-colors border border-transparent hover:border-[#80FF56]/30 px-3 py-1.5 bg-transparent hover:bg-[#80FF56]/10"
              style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
            >
              [ EDIT PROFIL ]
            </button>
          )}
        </div>

        {status && (
          <div className={`mb-6 p-4 flex items-start gap-3 text-xs font-bold tracking-widest uppercase border ${status.type === 'success' ? 'bg-[#80FF56]/10 text-[#80FF56] border-[#80FF56]/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`} style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
            {status.type === 'success' ? <CheckCircle2 className="shrink-0 text-[#80FF56] mt-0.5" size={16} /> : <AlertCircle className="shrink-0 text-red-400 mt-0.5" size={16} />}
            <p>{status.msg}</p>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-3 bg-[#090A0F] border border-slate-700 text-white focus:outline-none focus:border-[#7F56FF] transition-colors font-mono appearance-none"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                placeholder="Nama lengkap"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Kata Sandi (NIM)</label>
              <input
                type="text"
                value={editNim}
                onChange={(e) => setEditNim(e.target.value)}
                className="w-full p-3 bg-[#090A0F] border border-slate-700 text-white focus:outline-none focus:border-[#7F56FF] transition-colors font-mono appearance-none"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                placeholder="NIM / Kata Sandi"
                required
              />
              <p className="text-[10px] font-bold text-red-400 mt-2 uppercase tracking-widest">PERINGATAN: Mengubah Sandi (NIM) akan me-reset QR Code Anda.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-[#7F56FF] text-white font-bold py-3 px-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(127,86,255,0.3)] disabled:opacity-50 text-xs tracking-widest uppercase"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
              >
                <Save size={16} className={isLoading ? "animate-spin" : ""} />
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditName(member.name);
                  setEditNim(member.nim);
                  setStatus(null);
                }}
                className="flex items-center justify-center gap-2 bg-[#1A1C23] hover:bg-[#252836] border border-slate-700 text-slate-300 font-bold py-3 px-6 transition-colors w-full sm:w-auto text-xs tracking-widest uppercase"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
              >
                <X size={16} />
                Batal
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#090A0F] border border-slate-800 p-4" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nama Lengkap</p>
              <p className="font-bold text-white text-sm">{member.name}</p>
            </div>
            <div className="bg-[#090A0F] border border-slate-800 p-4" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Kata Sandi (NIM)</p>
              <p className="font-mono font-bold text-white tracking-[0.3em] text-sm">••••••••</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
