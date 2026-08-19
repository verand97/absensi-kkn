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
        className="flex items-center gap-2 bg-gradient-to-r from-[#8FE398] to-[#74D47E] hover:from-[#74D47E] hover:to-[#8FE398] text-[#0F1A14] text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-all shadow-[0_0_15px_rgba(143,227,152,0.3)] hover:shadow-[0_0_20px_rgba(143,227,152,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
        title={`Absen semua ${totalMembers} anggota sekaligus untuk Hari ke-${currentDay}`}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-[#0F1A14]/30 border-t-[#0F1A14] rounded-full animate-spin" />
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
            className="bg-white dark:bg-[#14241B] border border-slate-200 dark:border-[#1C3324] shadow-2xl max-w-sm w-full overflow-y-auto max-h-[90vh]"
            style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-[#8FE398]/10 border border-[#8FE398]/30 flex items-center justify-center shadow-[0_0_20px_rgba(143,227,152,0.2)]">
                  <CheckCheck className="w-7 h-7 text-[#8FE398]" />
                </div>
              </div>

              {/* Text */}
              <h3 className="text-center text-lg font-bold font-display uppercase tracking-widest text-slate-900 dark:text-white mb-2">
                Absen Semua Anggota?
              </h3>
              <p className="text-center text-sm text-slate-500 dark:text-[#9BA79C] leading-relaxed mb-1">
                Tindakan ini akan mencatat kehadiran untuk
              </p>
              <p className="text-center text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                <span className="text-[#8FE398] font-bold">{totalMembers} anggota</span> pada{" "}
                <span className="text-[#8FE398] font-bold">Hari ke-{currentDay}</span>
              </p>
              <p className="text-center text-xs text-slate-400 dark:text-[#9BA79C]/70 mb-6">
                Anggota yang sudah absen tidak akan dicatat ulang.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border border-slate-300 dark:border-[#3E7A4F]/50 text-slate-600 dark:text-[#D7DDD6] hover:bg-slate-100 dark:hover:bg-[#1C3324] transition-colors cursor-pointer"
                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest bg-[#8FE398] hover:bg-[#74D47E] text-[#0F1A14] transition-all shadow-[0_0_12px_rgba(143,227,152,0.3)] cursor-pointer"
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
