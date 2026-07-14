"use client";

import { useState } from "react";
import { UserCog, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminAccountSettings({ currentName, currentNim }: { currentName: string, currentNim: string }) {
  const [name, setName] = useState(currentName);
  const [nim, setNim] = useState(currentNim);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/update-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nim })
      });
      if (res.ok) {
        setMsg("Berhasil diperbarui.");
        setTimeout(() => setMsg(""), 3000);
        router.refresh();
      } else {
        const data = await res.json();
        setMsg(data.error || "Gagal memperbarui.");
      }
    } catch (e) {
      setMsg("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
        <UserCog className="text-blue-500" />
        <h2 className="text-lg font-bold">Pengaturan Akun Anda</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">User Login (Nama)</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Password (NIM)</label>
          <input 
            type="text" 
            value={nim} 
            onChange={e => setNim(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm font-bold w-full sm:w-auto sm:ml-auto"
          >
            <Save size={18} />
            {loading ? "Menyimpan..." : "Simpan Akun"}
          </button>
        </div>
      </div>
      {msg && (
        <div className="mt-4 text-sm font-medium text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
          {msg}
        </div>
      )}
    </div>
  );
}
