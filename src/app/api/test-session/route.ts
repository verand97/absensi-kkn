import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const cookieHeader = (await cookies()).toString();
  const sessionValue = (await cookies()).get("session")?.value;
  const session = await getSession();
  return NextResponse.json({ 
    cookieHeader,
    sessionValue,
    session 
  });
}
