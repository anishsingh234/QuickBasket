import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Session ID required" },
        { status: 400 }
      );
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { success: false, message: "Payment not completed" },
        { status: 400 }
      );
    }

    const userId = session.metadata?.userId;
    const shippingAddress = session.metadata?.shippingAddress;
    const totalAmount = parseFloat(session.metadata?.totalAmount || "0");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }

    // Check if order already exists for this session
    const existingOrder = await prisma.order.findFirst({
      where: { 
        userId,
        paymentMethod: `stripe_${sessionId}`,
      },
    });

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        message: "Order already created",
        order: {
          id: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
        },
      });
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty or order already placed" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `QB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        totalAmount,
        status: "CONFIRMED",
        shippingAddress: shippingAddress || "Not provided",
        paymentMethod: `stripe_${sessionId}`,
        items: {
          create: cartItems.map((item) => ({
            quantity: item.quantity,
            price: item.product.price,
            productId: item.product.id,
          })),
        },
      },
      include: { items: true },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and order created",
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
