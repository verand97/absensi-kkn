"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";

export default function ResetAttendanceButton() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { error } = useToast();

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
        error("Gagal menghapus absensi");
      }
    } catch {
      error("Terjadi kesalahan jaringan/sistem");
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
          className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50 cursor-pointer"
          style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
        >
          {isDeleting ? "PROSES..." : "YA, HAPUS!"}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isDeleting}
          className="bg-slate-100 dark:bg-forest-700 hover:bg-slate-200 dark:hover:bg-forest-600 border border-slate-300 dark:border-pine-500/50 text-slate-700 dark:text-mist-200 px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50 cursor-pointer"
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
      className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors border border-rose-500/30 cursor-pointer"
      style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
    >
      <Trash2 size={16} />
      RESET DATA
    </button>
  );
}
