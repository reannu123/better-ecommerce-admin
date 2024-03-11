import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { sendPaymongo, createOptions, lineItemsProps } from "@/lib/paymongo";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { productIds } = await req.json();
    if (!productIds || productIds.length === 0) {
      return new NextResponse("Empty checkout, product ids are required", {
        status: 400,
      });
    }

    const products = await prismadb.product.findMany({
      where: { id: { in: productIds } },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    const line_items: lineItemsProps[] = products.map((product) => {
      return {
        name: product.name,
        amount: Number(product.price) * 100,
        quantity: 1,
        currency: "PHP",
        images: product.images.map((image) => image.url),
      };
    });

    const options = createOptions({
      line_items,
      success_url: "http://localhost:3001/cart?success=1",
      cancel_url: "http://localhost:3001/cart?canceled=1",
    });

    const response = await sendPaymongo(options);
    return NextResponse.json(response, { headers: corsHeaders });
  } catch (error) {
    console.log(" [CHECKOUT_POST]", error);
    return new NextResponse("Internal error", {
      headers: corsHeaders,
      status: 500,
    });
  }
}
