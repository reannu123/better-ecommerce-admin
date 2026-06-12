import { NextResponse } from "next/server";
import axios from "axios";
import { randomUUID } from "crypto";
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
    if (!process.env.PAYMONGO_SECRET_KEY) {
      return NextResponse.json(
        { error: "PayMongo test secret key is not configured." },
        { headers: corsHeaders, status: 503 }
      );
    }

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

    if (productVariants.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more product variants are unavailable." },
        { headers: corsHeaders, status: 400 }
      );
    }

    const line_items: LineItem[] = productVariants.map((productVariant) => {
      return {
        name: productVariant.product.name,
        amount: Number(productVariant.price) * 100,
        quantity: 1,
        currency: "PHP",
        images: productVariant.product.images.map((image) => image.url),
      };
    });

    const orderId = randomUUID();

    const options = createOptions({
      line_items,
      success_url: `${process.env.PAYMENT_REDIRECT_SUCCESS}`,
      cancel_url: `${process.env.PAYMENT_REDIRECT_CANCELED}`,
      reference_number: orderId,
    });

    const response = await sendPaymongo(options);

    await prismadb.order.create({
      data: {
        id: orderId,
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

    return NextResponse.json(response, { headers: corsHeaders });
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status || 502 : 500;
    const message =
      status === 401
        ? "PayMongo rejected the configured test secret key."
        : "Unable to create a checkout session.";

    return NextResponse.json(
      { error: message },
      { headers: corsHeaders, status }
    );
  }
}
