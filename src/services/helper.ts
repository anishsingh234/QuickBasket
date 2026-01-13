import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import prismaClient from "@/db/prisma";

export async function getUserFromCookies() {
  try {
    // Cookies se token nikalna
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    // Token verify karna
    const data = verifyToken(token);
    if (!data?.id) return null;

    // Database se user fetch karna
    const user = await prismaClient.user.findUnique({
      where: { id: data.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) return null;

    return user;
  } catch {
    return null;
  }
}

// Check if user is staff from request cookies
export async function isStaffUser(): Promise<boolean> {
  const user = await getUserFromCookies();
  return user?.role === "STAFF";
}
