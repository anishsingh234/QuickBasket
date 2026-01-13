import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/db/prisma";
import { getUserFromCookies } from "@/services/helper";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    const { shippingAddress } = await req.json();

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const shipping = subtotal > 500 ? 0 : 40;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    // Create line items for Stripe
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.title,
          images: [item.product.thumbnail],
        },
        unit_amount: Math.round(item.product.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            images: [],
          },
          unit_amount: shipping * 100,
        },
        quantity: 1,
      });
    }

    // Add tax as line item
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Tax (18% GST)",
          images: [],
        },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout?canceled=true`,
      metadata: {
        userId: user.id,
        shippingAddress: shippingAddress,
        totalAmount: total.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe session error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create payment session" },
      { status: 500 }
    );
  }
}
