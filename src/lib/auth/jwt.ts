import { SignJWT, jwtVerify } from "jose";
import { UserSession, UserRole } from "@/types";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "reserve-ai-super-secret-key-2026";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string | null;
  [key: string]: any;
}

export async function signJwtTokenAsync(user: UserSession): Promise<string> {
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifyJwtTokenAsync(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as JwtPayload;
  } catch (err) {
    return null;
  }
}

export function getAuthCookieOptions() {
  return {
    name: "auth_token",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: TOKEN_MAX_AGE,
    },
  };
}
