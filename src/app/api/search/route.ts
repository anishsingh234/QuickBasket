import prismaClient from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.trim() === "") {
    return NextResponse.json(
      { success: false, data: [], message: "No Query given" },
      { status: 400 }
    );
  }

  try {
    const results = await prismaClient.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            category: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        rating: "desc",
      },
    });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, data: [], message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
