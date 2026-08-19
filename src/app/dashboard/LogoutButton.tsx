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
      className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-[#1C3324] hover:bg-[#D9534F]/20 text-slate-700 dark:text-[#D7DDD6] hover:text-[#D9534F] border border-slate-300 dark:border-[#3E7A4F]/50 hover:border-[#D9534F]/50 px-4 md:px-5 py-3 transition-colors text-xs font-bold tracking-widest uppercase disabled:opacity-50 cursor-pointer"
      style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
    >
      <LogOut size={16} />
      {loading ? "KELUAR..." : "KELUAR"}
    </button>
  );
}
