import prismaClient from "@/db/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function GET(req:NextRequest) {

    const product=await prismaClient.product.findMany({
        where:{
            category:{
                contains:"sports"
            }
        }
    })
    const product2=await prismaClient.product.findMany({
        where:{
            category:{
                contains:"womens"
            }
        }
    })
    return NextResponse.json({
        success:true,
        data1:product,
        data2:product2
    })
}
