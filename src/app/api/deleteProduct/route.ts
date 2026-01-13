import prismaClient from "@/db/prisma";
import { NextResponse } from "next/server";
import { isStaffUser } from "@/services/helper";

export async function DELETE(req: Request) {
  try {
    // Check if user is staff
    const isStaff = await isStaffUser();
    if (!isStaff) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Staff access required" },
        { status: 403 }
      );
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    await prismaClient.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
