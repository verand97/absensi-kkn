import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    // Hapus data absensi untuk anggota spesifik
    await prisma.attendance.deleteMany({
      where: {
        memberId: memberId
      }
    });

    return NextResponse.json({ success: true, message: "Absensi anggota berhasil dihapus" });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat mereset data" }, { status: 500 });
  }
}
