import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import { validatePluginSecret } from "@/prisma/lib/plugin-auth";

export async function POST(request: Request) {
  if (!validatePluginSecret(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { code, authUUID, username } = body;

  if (!code || !authUUID || !username) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const linkCode = await prisma.linkCode.findUnique({
    where: { code },
  });

  if (!linkCode || linkCode.used || linkCode.expiresAt < new Date()) {
    return NextResponse.json(
      { success: false, reason: "invalid_or_expired" },
      { status: 200 }, // 200 намеренно — плагин читает поле success
    );
  }

  // Транзакция: помечаем код использованным и создаём/обновляем привязку
  await prisma.$transaction([
    prisma.linkCode.update({
      where: { id: linkCode.id },
      data: { used: true },
    }),
    prisma.minecraftAccount.upsert({
      where: { authUUID },
      update: {
        userId: linkCode.userId,
        username,
        linkedAt: new Date(),
      },
      create: {
        userId: linkCode.userId,
        username,
        authUUID,
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
