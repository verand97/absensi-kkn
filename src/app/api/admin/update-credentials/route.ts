import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, login } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, nim } = await request.json();

    if (!name || !nim) {
      return NextResponse.json({ error: "Name and password (NIM) are required" }, { status: 400 });
    }

    // Update the admin's name and nim
    const updatedAdmin = await prisma.member.update({
      where: { id: session.user.id },
      data: { name, nim }
    });

    // Update the session so they don't get logged out incorrectly
    await login({ id: updatedAdmin.id, name: updatedAdmin.name, isAdmin: updatedAdmin.isAdmin });

    return NextResponse.json({ success: true, user: { name: updatedAdmin.name, nim: updatedAdmin.nim } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan saat menyimpan data." }, { status: 500 });
  }
}
