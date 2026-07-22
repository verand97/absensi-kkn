import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { login } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, password } = await request.json();
    
    // Login with name and NIM as password
    const member = await prisma.member.findUnique({
      where: {
        nim: password.trim()
      }
    });

    const normalizeName = (str: string) =>
      str
        .toLowerCase()
        .replace(/['’`‘]/g, "'")
        .replace(/\s+/g, " ")
        .trim();

    if (!member || normalizeName(member.name) !== normalizeName(name)) {
      return NextResponse.json({ error: "Nama atau NIM salah." }, { status: 401 });
    }

    await login({ id: member.id, name: member.name, isAdmin: member.isAdmin });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
