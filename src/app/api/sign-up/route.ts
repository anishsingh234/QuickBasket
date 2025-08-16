import prismaClient from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

type SignupBody = {
  name: string;
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
  const body: SignupBody = await req.json();

  if (!body.name || !body.email || !body.password) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered",
        },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prismaClient.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
    });

    // remove password before returning
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "User not registered",
      },
      { status: 500 }
    );
  }
}
