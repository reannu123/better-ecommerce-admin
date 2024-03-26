import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    return NextResponse.json("API Available", { status: 200 });
  } catch (error) {
    console.log(" [STOREID_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
