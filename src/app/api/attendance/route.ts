import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nim, day, qrToken } = await request.json();

    const setting = await prisma.setting.findUnique({ where: { id: "global" } });

    // Handle new feature: Member scanning Admin's QR code
    if (qrToken) {
      if (!setting || !setting.isActive) {
        return NextResponse.json({ error: "Sesi absensi belum dibuka oleh admin." }, { status: 400 });
      }
      if (setting.qrToken !== qrToken) {
        return NextResponse.json({ error: "QR Code tidak valid atau sudah kadaluarsa." }, { status: 400 });
      }

      // Check time limit (adjusted for WIB UTC+7)
      const now = new Date();
      const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      const currentHour = wibTime.getUTCHours().toString().padStart(2, '0');
      const currentMinute = wibTime.getUTCMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHour}:${currentMinute}`;
      if (currentTime < setting.startTime || currentTime > setting.endTime) {
        return NextResponse.json({ error: `Absensi hanya diperbolehkan dari jam ${setting.startTime} sampai ${setting.endTime}.` }, { status: 400 });
      }

      // Cek apakah sudah absen hari ini
      const existingAttendance = await prisma.attendance.findUnique({
        where: {
          memberId_day: {
            memberId: session.user.id,
            day: setting.currentDay
          }
        }
      });

      if (existingAttendance) {
        return NextResponse.json({ error: "Anda sudah melakukan absensi untuk hari ini." }, { status: 400 });
      }

      const attendance = await prisma.attendance.create({
        data: {
          memberId: session.user.id,
          day: setting.currentDay
        }
      });

      return NextResponse.json({ success: true, memberName: session.user.name, day: attendance.day });
    }

    // Handle old feature: Admin scanning Member's QR code or direct manual submit
    if (!nim || !day) {
      return NextResponse.json({ error: "Missing nim or day" }, { status: 400 });
    }

    const member = await prisma.member.findUnique({ where: { nim } });
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (!session.user.isAdmin && member.id !== session.user.id) {
      return NextResponse.json({ error: "Anda hanya bisa melakukan absensi untuk diri sendiri" }, { status: 403 });
    }

    if (setting && setting.isActive) {
      // Check time limit (adjusted for WIB UTC+7)
      const now = new Date();
      const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      const currentHour = wibTime.getUTCHours().toString().padStart(2, '0');
      const currentMinute = wibTime.getUTCMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHour}:${currentMinute}`;
      
      if (currentTime < setting.startTime || currentTime > setting.endTime) {
        return NextResponse.json({ 
          error: `Absensi hanya diperbolehkan dari jam ${setting.startTime} sampai ${setting.endTime}.` 
        }, { status: 400 });
      }
    }

    // Cek apakah sudah absen hari ini
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        memberId_day: {
          memberId: member.id,
          day: Number(day)
        }
      }
    });

    if (existingAttendance) {
      return NextResponse.json({ error: "Anggota ini sudah melakukan absensi untuk hari ini." }, { status: 400 });
    }

    const attendance = await prisma.attendance.create({
      data: {
        memberId: member.id,
        day: Number(day)
      }
    });

    return NextResponse.json({ success: true, memberName: member.name, day: attendance.day });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
