import prismaClient from "@/db/prisma";
import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/services/helper";

// GET /api/orders - Get user's orders
export async function GET() {
  try {
    const user = await getUserFromCookies();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prismaClient.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { success: true, data: orders },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order from cart
export async function POST(req: Request) {
  try {
    const user = await getUserFromCookies();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { shippingAddress, paymentMethod } = body;

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Shipping address and payment method are required" },
        { status: 400 }
      );
    }

    // Get user's cart items
    const cartItems = await prismaClient.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Generate order number
    const orderNumber = `QB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create order with items
    const order = await prismaClient.order.create({
      data: {
        orderNumber,
        userId: user.id,
        totalAmount,
        shippingAddress,
        paymentMethod,
        status: "PENDING",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear the cart after order is placed
    await prismaClient.cartItem.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
