import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE() {
  try {
    const session = await getSession();
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Hapus semua data absensi
    await prisma.attendance.deleteMany();

    return NextResponse.json({ success: true, message: "Semua data absensi berhasil dihapus" });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat mereset data" }, { status: 500 });
  }
}
