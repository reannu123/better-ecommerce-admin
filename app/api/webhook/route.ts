import { Address, extractWebhookData } from "@/lib/paymongo";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await extractWebhookData(req);
    const eventType = data.attributes.type;
    if (eventType !== "checkout_session.payment.paid") {
      return new NextResponse("Invalid event type", { status: 400 });
    }
    const checkoutSession = data.attributes.data;
    const address = checkoutSession.attributes.billing.address;
    const addressString = `${address.line1}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}`;

    const order = await prismadb.order.update({
      where: { id: checkoutSession.attributes.reference_number },
      data: {
        isPaid: true,
        address: addressString,
        phone: checkoutSession.attributes.billing.phone,
      },
      include: {
        orderItems: true,
      },
    });

    const productIds = order.orderItems.map(
      (orderItem) => orderItem.productVariantId
    );

    await prismadb.product.updateMany({
      where: { id: { in: productIds } },
      data: { isArchived: true },
    });
    console.log(
      " [WEBHOOK_POST]\n",
      "Payment Success\n Order updated:",
      order.id
    );
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
