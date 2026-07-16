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
        alert("Gagal menghapus absensi");
      }
    } catch {
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleReset}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70"
        >
          {isDeleting ? "Menghapus..." : "Ya, Hapus Semua!"}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isDeleting}
          className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70 border border-slate-600"
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleReset}
      className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-red-500/30"
    >
      <Trash2 size={16} />
      Reset Absensi
    </button>
  );
}
