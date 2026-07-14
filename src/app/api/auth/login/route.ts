import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { login } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, password } = await request.json();
    
    // Login with name and NIM as password
    const member = await prisma.member.findFirst({
      where: {
        name,
        nim: password,
        isAdmin: true
      }
    });

    if (!member) {
      return NextResponse.json({ error: "Invalid credentials or not an admin." }, { status: 401 });
    }

    await login({ id: member.id, name: member.name, isAdmin: member.isAdmin });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
