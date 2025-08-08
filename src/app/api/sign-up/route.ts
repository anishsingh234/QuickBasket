// @ts-nocheck
import prismaClient from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const signupData = {
    name: body.name,
    email: body.email,
    password: body.password,
  };

  

  try {
    const user = await prismaClient.user.create({
      data: signupData,
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "User not registered",
    });
  }
}
