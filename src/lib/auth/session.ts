import { cookies } from "next/headers";
import { verifyJwtTokenAsync } from "./jwt";
import { UserSession } from "@/types";

export async function getCurrentSession(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("auth_token");

  if (!tokenCookie || !tokenCookie.value) {
    return null;
  }

  const payload = await verifyJwtTokenAsync(tokenCookie.value);
  if (!payload) {
    return null;
  }

  return {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    role: payload.role,
    organizationId: payload.organizationId,
  };
}
