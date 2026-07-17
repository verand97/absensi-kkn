"use client";

import { useState } from "react";
import { UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteMemberAttendanceButton({ memberId, memberName }: { memberId: string, memberName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`[ PERINGATAN ]\nYakin ingin mereset/menghapus semua data absensi untuk ${memberName}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/reset-member-attendance?memberId=${memberId}`, {
        method: "DELETE",
      });

      if (res.ok) {
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

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      title={`Reset absensi ${memberName}`}
      className="text-slate-500 hover:text-red-400 bg-[#090A0F] hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 p-2 transition-colors disabled:opacity-50 inline-flex items-center justify-center"
      style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
    >
      <UserMinus size={14} />
    </button>
  );
}
