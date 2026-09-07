import { cookies } from "next/headers";
import { successResponse } from "@/lib/utils/apiResponse";

export async function POST() {
  cookies().set("auth_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return successResponse({ message: "Logged out successfully" });
}
