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
        className="text-slate-500 dark:text-[#9BA79C] hover:text-[#D9534F] bg-slate-200 dark:bg-[#0F1A14] hover:bg-[#D9534F]/10 border border-slate-200 dark:border-[#1C3324] hover:border-[#D9534F]/30 p-2 transition-colors disabled:opacity-50 inline-flex items-center justify-center cursor-pointer"
        style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
      >
        {isDeleting
          ? <span className="w-3.5 h-3.5 border border-[#D9534F]/50 border-t-[#D9534F] rounded-full animate-spin" />
          : <UserMinus size={14} />
        }
      </button>

      {/* Modal konfirmasi */}
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
                <div className="w-14 h-14 rounded-full bg-[#D9534F]/10 border border-[#D9534F]/30 flex items-center justify-center shadow-[0_0_20px_rgba(217,83,79,0.15)]">
                  <AlertTriangle className="w-7 h-7 text-[#D9534F]" />
                </div>
              </div>

              {/* Text */}
              <h3 className="text-center text-base font-bold font-display uppercase tracking-widest text-slate-900 dark:text-white mb-2">
                Kurangi Absensi?
              </h3>
              <p className="text-center text-sm text-slate-500 dark:text-[#9BA79C] leading-relaxed mb-1">
                1 kehadiran terbaru dari
              </p>
              <p className="text-center text-sm font-bold text-[#D9534F] mb-4">
                {memberName}
              </p>
              <p className="text-center text-xs text-slate-400 dark:text-[#9BA79C]/70 mb-6">
                akan dihapus. Tindakan ini tidak bisa dibatalkan.
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
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest bg-[#D9534F] hover:bg-[#C9423E] text-white transition-all shadow-[0_0_12px_rgba(217,83,79,0.3)] cursor-pointer"
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
