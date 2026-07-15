import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    let setting = await prisma.setting.findUnique({ where: { id: "global" } });
    if (!setting) {
      setting = await prisma.setting.create({
        data: { id: "global", startTime: "07:00", endTime: "09:00", isActive: true, currentDay: 1, qrToken: "" }
      });
    }
    return NextResponse.json(setting);
  }

  export async function POST(request: Request) {
    try {
      const session = await getSession();
      if (!session || !session.user?.isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { startTime, endTime, isActive, currentDay, qrToken } = await request.json();

      const setting = await prisma.setting.upsert({
        where: { id: "global" },
        update: { startTime, endTime, isActive, currentDay: Number(currentDay) || 1, qrToken: qrToken || "" },
        create: { id: "global", startTime, endTime, isActive, currentDay: Number(currentDay) || 1, qrToken: qrToken || "" }
      });

    return NextResponse.json(setting);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
