"use client";

import { useState } from "react";
import { UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteMemberAttendanceButton({ memberId, memberName }: { memberId: string, memberName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Yakin ingin mereset/menghapus semua data absensi untuk ${memberName}?`)) {
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
        alert("Gagal menghapus absensi");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      title={`Reset absensi ${memberName}`}
      className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center"
    >
      <UserMinus size={14} />
    </button>
  );
}
