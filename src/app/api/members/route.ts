import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { getSession, login } from "@/lib/auth";

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      select: { name: true, nim: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(members);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, nim } = await request.json();

    if (!name || !nim) {
      return NextResponse.json({ error: "Name and NIM are required" }, { status: 400 });
    }

    // Update the member in the database
    const updatedMember = await prisma.member.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        nim: nim.trim(),
      },
    });

    // Refresh the session if the name changed
    if (updatedMember.name !== session.user.name) {
      await login({
        id: updatedMember.id,
        name: updatedMember.name,
        isAdmin: updatedMember.isAdmin,
      });
    }

    return NextResponse.json({ success: true, member: { name: updatedMember.name, nim: updatedMember.nim } });
  } catch (error) {
    if (typeof error === 'object' && error !== null && (error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: "NIM (Sandi) ini sudah digunakan oleh orang lain." }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal menyimpan perubahan." }, { status: 500 });
  }
}

