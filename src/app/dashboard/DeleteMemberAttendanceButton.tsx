"use client";

import { useState } from "react";
import { UserMinus, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";

export default function DeleteMemberAttendanceButton({ memberId, memberName }: { memberId: string, memberName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { error } = useToast();

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/reset-member-attendance?memberId=${memberId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        router.refresh();
      } else {
        error(data.error || "Gagal mengurangi absensi");
      }
    } catch {
      error("Terjadi kesalahan jaringan/sistem");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        title={`Kurangi 1 absensi ${memberName}`}
        className="text-slate-500 dark:text-slate-500 hover:text-red-400 bg-slate-200 dark:bg-[#090A0F] hover:bg-red-500/10 border border-slate-200 dark:border-slate-800 hover:border-red-500/30 p-2 transition-colors disabled:opacity-50 inline-flex items-center justify-center cursor-pointer"
        style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
      >
        {isDeleting
          ? <span className="w-3.5 h-3.5 border border-red-400/50 border-t-red-400 rounded-full animate-spin" />
          : <UserMinus size={14} />
        }
      </button>

      {/* Modal konfirmasi */}
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
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                  <AlertTriangle className="w-7 h-7 text-red-400" />
                </div>
              </div>

              {/* Text */}
              <h3 className="text-center text-base font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">
                Kurangi Absensi?
              </h3>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-1">
                1 kehadiran terbaru dari
              </p>
              <p className="text-center text-sm font-bold text-red-400 mb-6">
                {memberName}
              </p>
              <p className="text-center text-xs text-slate-400 dark:text-slate-500 mb-6">
                akan dihapus. Tindakan ini tidak bisa dibatalkan.
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
                  className="flex-1 py-2.5 text-xs font-black uppercase tracking-widest bg-red-500 hover:bg-red-600 text-white transition-all shadow-[0_0_12px_rgba(239,68,68,0.3)] hover:shadow-[0_0_18px_rgba(239,68,68,0.5)] cursor-pointer"
                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                >
                  Ya, Hapus!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
