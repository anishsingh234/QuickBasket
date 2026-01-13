import prismaClient from "@/db/prisma";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET() {

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
    const productgrid1=await prismaClient.product.findMany({
        where:{
            category:{
                contains:"groceries"
            }
        },
        take:4
    })
    const productgrid2=await prismaClient.product.findMany({
        where:{
            category:{
                contains:"vehicle"
            }
        },
        take:4
    })
    const productgrid3=await prismaClient.product.findMany({
        where:{
            category:{
                contains:"beauty"
            }
        },
        take:4
    })
    return NextResponse.json({
        success:true,
        data1:product,
        data2:product2,
        data3:productgrid1,
        data4:productgrid2,
        data5:productgrid3
    })
}
