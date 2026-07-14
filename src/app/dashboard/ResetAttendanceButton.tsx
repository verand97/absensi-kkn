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
    } catch (error) {
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
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70"
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleReset}
      className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-red-200"
    >
      <Trash2 size={16} />
      Reset Absensi
    </button>
  );
}
