import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import { validatePluginSecret } from "@/prisma/lib/plugin-auth";

export async function POST(request: Request) {
  if (!validatePluginSecret(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId } = await request.json();

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "delivered" },
  });

  return NextResponse.json({ success: true });
}
