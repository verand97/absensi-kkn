import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "kkn40hari-secret";
const key = new TextEncoder().encode(secretKey);

interface UserPayload {
  id: string;
  name: string;
  isAdmin: boolean;
}

export interface SessionPayload extends JWTPayload {
  user: UserPayload;
}

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10h")
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
      clockTolerance: "5 mins",
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function login(user: UserPayload) {
  const expires = new Date(Date.now() + 10 * 60 * 60 * 1000); // 10 hours
  const session = await encrypt({ user, expires: expires.toISOString() });

  (await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function logout() {
  (await cookies()).set("session", "", { 
    expires: new Date(0),
    path: "/",
  });
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  if (!parsed) return;
  
  const newExpires = new Date(Date.now() + 10 * 60 * 60 * 1000);
  parsed.expires = newExpires.toISOString();
  
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: newExpires,
  });
  return res;
}
