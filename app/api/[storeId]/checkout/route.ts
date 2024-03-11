import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { sendPaymongo } from "@/lib/paymongo";

interface RequestOptions {
  line_items?: lineItemsProps[];
  cancel_url?: string;
  success_url?: string;
}

const createOptions = (requestOptions: RequestOptions) => {
  const defaultOptions = {
    method: "POST",
    url: "https://api.paymongo.com/v1/checkout_sessions",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Basic c2tfdGVzdF9zUXF0c0s0V3JmUXFyYUZtYWN5bld3WGc6",
    },
    data: {
      data: {
        attributes: {
          billing: { phone: "09763643131" },
          send_email_receipt: true,
          show_description: false,
          show_line_items: true,
          cancel_url: "https://google.com",
          line_items: [
            { amount: 2000, currency: "PHP", name: "productName", quantity: 1 },
          ],
          payment_method_types: [
            "card",
            "gcash",
            "paymaya",
            "grab_pay",
            "dob",
            "dob_ubp",
          ],
          success_url: "https://google.com",
        },
      },
    },
  };

  return {
    ...defaultOptions,
    data: {
      data: {
        attributes: {
          ...defaultOptions.data.data.attributes,
          line_items:
            requestOptions.line_items ||
            defaultOptions.data.data.attributes.line_items,
          cancel_url:
            requestOptions.cancel_url ||
            defaultOptions.data.data.attributes.cancel_url,
          success_url:
            requestOptions.success_url ||
            defaultOptions.data.data.attributes.success_url,
        },
      },
    },
  };
};

interface lineItemsProps {
  name: string;
  quantity?: number;
  amount: number;
  currency: "PHP";
  description?: string;
  images: string[];
}

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
      cancel_url: "http://localhost:3001/",
      success_url: "http://localhost:3001/",
    });

    const response = await sendPaymongo(options);
    return NextResponse.json(response.data, { headers: corsHeaders });
  } catch (error) {
    console.log(" [CHECKOUT_POST]", error);
    return new NextResponse("Internal error", {
      headers: corsHeaders,
      status: 500,
    });
  }
}
