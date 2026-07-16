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
      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl transition-colors text-sm font-semibold disabled:opacity-70 border border-slate-700 w-full sm:w-auto"
    >
      <LogOut size={18} />
      Keluar
    </button>
  );
}
