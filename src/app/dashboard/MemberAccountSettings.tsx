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
      setStatus({ type: 'error', msg: 'Username dan Sandi tidak boleh kosong.' });
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
        setStatus({ type: 'success', msg: 'Profil berhasil diperbarui!' });
        setTimeout(() => {
          setIsEditing(false);
          setStatus(null);
          router.refresh();
        }, 1500);
      } else {
        setStatus({ type: 'error', msg: data.error || 'Gagal memperbarui profil' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Terjadi kesalahan jaringan' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 p-6 mt-8 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <UserCog className="text-blue-600 dark:text-blue-400" size={24} />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Pengaturan Akun</h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
          >
            Edit Profil
          </button>
        )}
      </div>

      {status && (
        <div className={`mb-4 p-3 rounded-xl flex items-start gap-2 text-sm ${status.type === 'success' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20'}`}>
          {status.type === 'success' ? <CheckCircle2 className="shrink-0 text-green-600 dark:text-green-400 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 text-red-600 dark:text-red-400 mt-0.5" size={18} />}
          <p className="font-bold">{status.msg}</p>
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username (Nama)</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Nama lengkap"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kata Sandi (NIM)</label>
            <input
              type="text"
              value={editNim}
              onChange={(e) => setEditNim(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="NIM / Kata Sandi"
              required
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mengubah Sandi (NIM) juga akan merubah QR Code Anda.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              <Save size={18} />
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
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2.5 px-4 rounded-xl transition-colors w-full sm:w-auto"
            >
              <X size={18} />
              Batal
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-white/5">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Username (Nama)</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{member.name}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-white/5 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Kata Sandi (NIM)</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 tracking-widest">••••••••••</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
