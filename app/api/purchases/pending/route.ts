import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import { validatePluginSecret } from "@/prisma/lib/plugin-auth";

export async function GET(request: Request) {
  if (!validatePluginSecret(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    where: { status: "paid" },
    include: {
      items: true,
      user: {
        include: { minecraftAccount: true },
      },
    },
  });

  // Отдаём только заказы пользователей с привязанным аккаунтом
  const purchases = orders
    .filter((order) => order.user.minecraftAccount?.authUUID)
    .flatMap((order) =>
      order.items.map((item) => ({
        orderId: order.id,
        itemId: item.productId,
        itemName: item.productName,
        duration: item.duration,
        authUUID: order.user.minecraftAccount!.authUUID,
      })),
    );

  return NextResponse.json({ purchases });
}
