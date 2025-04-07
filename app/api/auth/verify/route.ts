//@app/api/auth/verify/route.ts
import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.verificationCode !== code) {
    return NextResponse.json({ error: 'Неверный код' }, { status: 401 });
  }

  await prisma.user.update({
    where: { email },
    data: {
      emailVerified: true,
      verificationCode: null,
    },
  });

  return NextResponse.json({ success: true });
}