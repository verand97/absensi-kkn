"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-[#1A1C23] hover:bg-red-500/20 text-slate-700 dark:text-slate-300 hover:text-red-400 border border-slate-300 dark:border-slate-700 hover:border-red-500/50 px-5 py-3 transition-colors text-xs font-bold tracking-widest uppercase disabled:opacity-50"
      style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
    >
      <LogOut size={16} />
      {loading ? "KELUAR..." : "KELUAR"}
    </button>
  );
}
