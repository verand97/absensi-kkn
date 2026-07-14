import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  let setting = await prisma.setting.findUnique({ where: { id: "global" } });
  if (!setting) {
    setting = await prisma.setting.create({
      data: { id: "global", startTime: "07:00", endTime: "09:00", isActive: true }
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

    const { startTime, endTime, isActive } = await request.json();

    const setting = await prisma.setting.upsert({
      where: { id: "global" },
      update: { startTime, endTime, isActive },
      create: { id: "global", startTime, endTime, isActive }
    });

    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
