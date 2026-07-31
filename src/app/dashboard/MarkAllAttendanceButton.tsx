"use client";

import { useState } from "react";
import { CheckCheck } from "lucide-react";

interface Props {
  currentDay: number;
  totalMembers: number;
}

export default function MarkAllAttendanceButton({ currentDay, totalMembers }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/mark-all-attendance", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ ${data.message}`);
        window.location.reload();
      } else {
        alert(`❌ Gagal: ${data.error}`);
      }
    } catch {
      alert("❌ Terjadi kesalahan jaringan");
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
        className="flex items-center gap-2 bg-linear-to-r from-[#80FF56] to-emerald-400 hover:from-emerald-400 hover:to-[#80FF56] text-slate-900 text-xs font-black uppercase tracking-wider px-4 py-2.5 transition-all shadow-[0_0_15px_rgba(128,255,86,0.3)] hover:shadow-[0_0_20px_rgba(128,255,86,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
        title={`Absen semua ${totalMembers} anggota sekaligus untuk Hari ke-${currentDay}`}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
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
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="bg-white dark:bg-[#12141C] border border-slate-200 dark:border-slate-700/50 shadow-2xl shadow-black/40 max-w-sm w-full p-px"
            style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
          >
            <div
              className="bg-white dark:bg-[#12141C] p-6"
              style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-[#80FF56]/10 border border-[#80FF56]/30 flex items-center justify-center shadow-[0_0_20px_rgba(128,255,86,0.2)]">
                  <CheckCheck className="w-7 h-7 text-[#80FF56]" />
                </div>
              </div>

              {/* Text */}
              <h3 className="text-center text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">
                Absen Semua Anggota?
              </h3>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-1">
                Tindakan ini akan mencatat kehadiran untuk
              </p>
              <p className="text-center text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                <span className="text-[#80FF56]">{totalMembers} anggota</span> pada{" "}
                <span className="text-[#80FF56]">Hari ke-{currentDay}</span>
              </p>
              <p className="text-center text-xs text-slate-400 dark:text-slate-500 mb-6">
                Anggota yang sudah absen tidak akan dicatat ulang.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 text-xs font-black uppercase tracking-widest bg-[#80FF56] hover:bg-emerald-400 text-slate-900 transition-all shadow-[0_0_12px_rgba(128,255,86,0.3)] hover:shadow-[0_0_18px_rgba(128,255,86,0.5)] cursor-pointer"
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
