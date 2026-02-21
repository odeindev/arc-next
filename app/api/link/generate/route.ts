import { getServerSession } from "next-auth";
import { authOptions } from "@/components/shared/config/auth-options";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Удаляем старые неиспользованные коды этого пользователя
  await prisma.linkCode.deleteMany({
    where: { userId: session.user.id, used: false },
  });

  // Генерируем читаемый код: "A3F9C1"
  const code = crypto.randomBytes(3).toString("hex").toUpperCase();

  await prisma.linkCode.create({
    data: {
      userId: session.user.id,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 минут
    },
  });

  return NextResponse.json({ code });
}
