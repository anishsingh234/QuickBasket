import prismaClient from "@/db/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { isStaffUser } from "@/services/helper";

// PUT /api/updateProduct
export async function PUT(req: NextRequest) {
  try {
    // Check if user is staff
    const isStaff = await isStaffUser();
    if (!isStaff) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Staff access required" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const { id, ...updateData } = body; 

    const updatedProduct = await prismaClient.product.update({
      where: {
        id: id,
      },
      data: updateData, 
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
      },
      { status: 500 }
    );
  }
}
