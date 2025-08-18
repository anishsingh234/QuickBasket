//@ts-nocheck
import prismaClient from '@/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
export async  function GET(req:NextRequest,{params}:{
    id:string
}) {
  const id=params.id;

  const productdetail=await prismaClient.product.findUnique({
    where:{
        id:id
    }
  });
  return NextResponse.json({
    success:true,
    data:productdetail
  })
}
