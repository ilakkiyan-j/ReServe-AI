import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validations";
import { verifyPassword } from "@/lib/auth/password";
import { signJwtTokenAsync, getAuthCookieOptions } from "@/lib/auth/jwt";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { cookies } from "next/headers";
import { UserRole } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
      include: { organization: true },
    });

    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    const isValidPassword = await verifyPassword(validated.password, user.passwordHash);
    if (!isValidPassword) {
      return errorResponse("Invalid email or password", 401);
    }

    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      organizationId: user.organizationId,
      organizationName: user.organization?.name,
    };

    const token = await signJwtTokenAsync(userSession);
    const { name, options } = getAuthCookieOptions();
    cookies().set(name, token, options);

    return successResponse({
      user: userSession,
      message: "Login successful",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse(error.errors[0].message, 400);
    }
    return errorResponse(`Login failed: ${error.message}`, 500);
  }
}
