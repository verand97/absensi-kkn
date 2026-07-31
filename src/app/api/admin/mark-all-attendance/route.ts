import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getSession();
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ambil sesi absensi aktif untuk mendapatkan hari ini
    const setting = await prisma.setting.findFirst();
    if (!setting) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
    }

    const currentDay = setting.currentDay;

    // Ambil semua member
    const members = await prisma.member.findMany({ select: { id: true } });

    // Buat absensi untuk setiap member pada hari aktif (skip yang sudah absen)
    const results = await Promise.allSettled(
      members.map((member) =>
        prisma.attendance.upsert({
          where: {
            memberId_day: {
              memberId: member.id,
              day: currentDay,
            },
          },
          update: {}, // tidak ada yang di-update jika sudah ada
          create: {
            memberId: member.id,
            day: currentDay,
          },
        })
      )
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const alreadyExisted = results.filter(
      (r) => r.status === "fulfilled"
    ).length;

    return NextResponse.json({
      success: true,
      message: `Berhasil mengabsen ${succeeded} dari ${members.length} anggota untuk Hari ke-${currentDay}`,
      day: currentDay,
      total: members.length,
      succeeded,
      alreadyExisted,
    });
  } catch (error) {
    console.error("Mark all attendance error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengabsen semua anggota" },
      { status: 500 }
    );
  }
}
