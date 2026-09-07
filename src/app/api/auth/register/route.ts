import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { registerSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth/password";
import { signJwtTokenAsync, getAuthCookieOptions } from "@/lib/auth/jwt";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { cookies } from "next/headers";
import { UserRole } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existingUser) {
      return errorResponse("User with this email already exists", 400);
    }

    const passwordHash = await hashPassword(validated.password);

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email.toLowerCase(),
        passwordHash,
        role: validated.role,
        organizationId: validated.organizationId || null,
      },
    });

    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      organizationId: user.organizationId,
    };

    const token = await signJwtTokenAsync(userSession);
    const { name, options } = getAuthCookieOptions();
    cookies().set(name, token, options);

    return successResponse({
      user: userSession,
      message: "Registration successful",
    }, 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse(error.errors[0].message, 400);
    }
    return errorResponse(`Registration failed: ${error.message}`, 500);
  }
}
