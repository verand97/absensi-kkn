"use client";

import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { useToast } from "@/components/toast";

interface Props {
  currentDay: number;
  totalMembers: number;
}

export default function MarkAllAttendanceButton({ currentDay, totalMembers }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { success, error } = useToast();

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/mark-all-attendance", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        success(data.message);
        window.location.reload();
      } else {
        error(`Gagal: ${data.error}`);
      }
    } catch {
      error("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Tombol utama */}
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isLoading}
        className="flex items-center gap-2 bg-linear-to-r from-sprout-400 to-sprout-500 hover:from-sprout-500 hover:to-sprout-400 text-forest-900 text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-all shadow-[0_0_15px_rgba(143,227,152,0.3)] hover:shadow-[0_0_20px_rgba(143,227,152,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
        title={`Absen semua ${totalMembers} anggota sekaligus untuk Hari ke-${currentDay}`}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-forest-900/30 border-t-forest-900 rounded-full animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <CheckCheck size={16} />
            Absen Semua (H{currentDay})
          </>
        )}
      </button>

      {/* Dialog konfirmasi */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white dark:bg-forest-800 border border-slate-200 dark:border-forest-700 shadow-2xl max-w-sm w-full overflow-y-auto max-h-[90vh]"
            style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-sprout-400/10 border border-sprout-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(143,227,152,0.2)]">
                  <CheckCheck className="w-7 h-7 text-sprout-400" />
                </div>
              </div>

              {/* Text */}
              <h3 className="text-center text-lg font-bold font-display uppercase tracking-widest text-slate-900 dark:text-white mb-2">
                Absen Semua Anggota?
              </h3>
              <p className="text-center text-sm text-slate-500 dark:text-mist-500 leading-relaxed mb-1">
                Tindakan ini akan mencatat kehadiran untuk
              </p>
              <p className="text-center text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                <span className="text-sprout-400 font-bold">{totalMembers} anggota</span> pada{" "}
                <span className="text-sprout-400 font-bold">Hari ke-{currentDay}</span>
              </p>
              <p className="text-center text-xs text-slate-400 dark:text-mist-500/70 mb-6">
                Anggota yang sudah absen tidak akan dicatat ulang.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border border-slate-300 dark:border-pine-500/50 text-slate-600 dark:text-mist-200 hover:bg-slate-100 dark:hover:bg-forest-700 transition-colors cursor-pointer"
                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest bg-sprout-400 hover:bg-sprout-500 text-forest-900 transition-all shadow-[0_0_12px_rgba(143,227,152,0.3)] cursor-pointer"
                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                >
                  Ya, Absenkan!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
