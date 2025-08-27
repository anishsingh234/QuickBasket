import prismaClient from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const cart = await prismaClient.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
