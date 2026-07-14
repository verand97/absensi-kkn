import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nim, day } = await request.json();

    if (!nim || !day) {
      return NextResponse.json({ error: "Missing nim or day" }, { status: 400 });
    }

    const member = await prisma.member.findUnique({ where: { nim } });
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const setting = await prisma.setting.findUnique({ where: { id: "global" } });
    if (setting && setting.isActive) {
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHour}:${currentMinute}`;
      
      if (currentTime < setting.startTime || currentTime > setting.endTime) {
        return NextResponse.json({ 
          error: `Absensi hanya diperbolehkan dari jam ${setting.startTime} sampai ${setting.endTime}.` 
        }, { status: 400 });
      }
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        memberId_day: {
          memberId: member.id,
          day: Number(day)
        }
      },
      update: {},
      create: {
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
