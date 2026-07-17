"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResetAttendanceButton() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/reset-attendance", {
        method: "DELETE",
      });

      if (res.ok) {
        setIsConfirming(false);
        router.refresh();
      } else {
        alert("GAGAL MENGHAPUS ABSENSI");
      }
    } catch {
      alert("ERROR JARINGAN/SISTEM");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 text-slate-900 dark:text-white px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
          style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
        >
          {isDeleting ? "PROSES..." : "YA, HAPUS!"}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isDeleting}
          className="bg-slate-100 dark:bg-[#1A1C23] hover:bg-[#252836] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
          style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
        >
          BATAL
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleReset}
      className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors border border-red-500/30"
      style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
    >
      <Trash2 size={16} />
      RESET DATA
    </button>
  );
}
