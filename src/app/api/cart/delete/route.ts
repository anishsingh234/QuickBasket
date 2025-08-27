import prismaClient from "@/db/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { userId, productId } = await req.json();
    console.log("Deleting cartItem:", { userId, productId });

    await prismaClient.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return NextResponse.json({ success: true, message: "Item deleted" });
  } catch (err: any) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
