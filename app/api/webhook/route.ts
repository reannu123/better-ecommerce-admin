import { extractWebhookData, getCheckoutSession } from "@/lib/paymongo";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await extractWebhookData(req);
    console.log(" [WEBHOOK_POST]", data);
    const checkout_session_id = data.attributes.data.id;
    getCheckoutSession(checkout_session_id);
    return NextResponse.json("Webhook Post Success", { status: 200 });
  } catch (error) {
    console.log(" [WEBHOOK_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    return NextResponse.json("Webhook Get Success", { status: 200 });
  } catch (error) {
    console.log(" [WEBHOOK_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
