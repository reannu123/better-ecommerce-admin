import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    console.log("Webhook post received:\n", data);
    return NextResponse.json("Webhook Post Success", { status: 200 });
  } catch (error) {
    console.log(" [WEBHOOK_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    console.log("Webhook get received:\n", req.body);
    return NextResponse.json("Webhook Get Success", { status: 200 });
  } catch (error) {
    console.log(" [WEBHOOK_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// store checkout session, wait for payment webhook with the checkout session