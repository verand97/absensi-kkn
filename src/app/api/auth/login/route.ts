import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { login } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, password } = await request.json();

    const trimmedPass = (password || "").toString().trim();
    const trimmedName = (name || "").toString().trim();

    if (!trimmedPass || !trimmedName) {
      return NextResponse.json({ error: "Nama dan NIM wajib diisi." }, { status: 400 });
    }

    const cleanName = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    // 1. Try finding by NIM first
    let member = await prisma.member.findFirst({
      where: {
        OR: [
          { nim: trimmedPass },
          { nim: trimmedName }
        ]
      }
    });

    // 2. If not found by NIM, search all members by normalized name
    if (!member) {
      const allMembers = await prisma.member.findMany();
      const targetCleanName = cleanName(trimmedName);
      member = allMembers.find((m) => cleanName(m.name) === targetCleanName) || null;
    }

    if (!member) {
      return NextResponse.json({ error: "Nama atau NIM salah." }, { status: 401 });
    }

    const dbCleanName = cleanName(member.name);
    const inputCleanName = cleanName(trimmedName);

    const isNameMatch =
      dbCleanName === inputCleanName ||
      dbCleanName.includes(inputCleanName) ||
      inputCleanName.includes(dbCleanName);
    const isNimMatch = member.nim === trimmedPass || member.nim === trimmedName;

    if (!isNameMatch && !isNimMatch) {
      return NextResponse.json({ error: "Nama atau NIM salah." }, { status: 401 });
    }

    await login({ id: member.id, name: member.name, isAdmin: member.isAdmin });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

