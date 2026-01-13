import prismaClient from "@/db/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { isStaffUser } from "@/services/helper";

// POST /api/products
export async function POST(req: NextRequest) {
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

    // Create product in DB
    const newProduct = await prismaClient.product.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        price: body.price,
        rating: body.rating,
        stock: body.stock,
        discountpercentage: body.discountpercentage,
        images: body.images,
        thumbnail: body.thumbnail,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
      },
      { status: 500 }
    );
  }
}
