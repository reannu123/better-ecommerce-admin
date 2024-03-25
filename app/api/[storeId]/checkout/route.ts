import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { sendPaymongo, createOptions, LineItem } from "@/lib/paymongo";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { productIds } = await req.json();

    if (!productIds || productIds.length === 0) {
      return new NextResponse("Empty checkout, product ids are required", {
        status: 400,
      });
    }

    const productVariants = await prismadb.productVariant.findMany({
      where: { id: { in: productIds } },
      include: {
        product: {
          include: {
            images: true,
            category: true,
          },
        },
        options: true,
      },
    });

    const line_items: LineItem[] = productVariants.map((productVariant) => {
      return {
        name: productVariant.product.name,
        amount: Number(productVariant.price) * 100,
        quantity: 1,
        currency: "PHP",
        images: productVariant.product.images.map((image) => image.url),
      };
    });

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId: string) => ({
            productVariant: { connect: { id: productId } },
            quantity: 1,
          })),
        },
      },
    });

    const options = createOptions({
      line_items,
      success_url: `${process.env.PAYMENT_REDIRECT_SUCCESS}`,
      cancel_url: `${process.env.PAYMENT_REDIRECT_CANCELED}`,
      reference_number: order.id,
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
