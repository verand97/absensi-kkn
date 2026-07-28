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
    const dayParam = searchParams.get("day");

    if (!memberId) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    // Jika dayParam diberikan, hapus absensi hari spesifik
    if (dayParam) {
      const dayNum = parseInt(dayParam, 10);
      await prisma.attendance.deleteMany({
        where: {
          memberId: memberId,
          day: dayNum,
        },
      });
      return NextResponse.json({ success: true, message: `Absensi hari ke-${dayNum} berhasil dihapus` });
    }

    // Jika tanpa dayParam, cari absensi dengan hari tertinggi / terbaru milik anggota ini lalu hapus 1 saja
    const latestAttendance = await prisma.attendance.findFirst({
      where: { memberId: memberId },
      orderBy: { day: 'desc' },
    });

    if (!latestAttendance) {
      return NextResponse.json({ error: "Anggota belum memiliki data absensi" }, { status: 400 });
    }

    await prisma.attendance.delete({
      where: { id: latestAttendance.id },
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil mengurangi 1 absensi (Hari ke-${latestAttendance.day})`,
    });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat mengurangi data absensi" }, { status: 500 });
  }
}
