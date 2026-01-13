import prismaClient from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateToken } from "@/services/jwt";

type LoginBody = {
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
  const body: LoginBody = await req.json();

  //   Validate input
  if (!body.email || !body.password) {
    return NextResponse.json(
      { success: false, message: "Email and password are reqired" },
      { status: 400 }
    );
  }

  try {
    // Find user by email
    const user = await prismaClient.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // compare password
    const isMatch = await bcrypt.compare(body.password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // generate token
    const token = generateToken({ id: user.id });

    // set cookie with token
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      date: { id: user.id, name: user.name, email: user.email },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      // secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:"strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error, please try again later",
      },
      { status: 500 }
    );
  }
}
