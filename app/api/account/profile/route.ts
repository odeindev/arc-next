// app/api/account/profile/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/shared/config/auth-options";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        minecraftAccount: {
          select: {
            username: true,
            linkedAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      minecraftUsername: user.minecraftAccount?.username ?? null,
      minecraftLinkedAt: user.minecraftAccount?.linkedAt ?? null,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
