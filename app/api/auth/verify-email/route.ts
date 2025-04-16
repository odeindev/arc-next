// @app/api/auth/verify-email/route.ts
import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Необходимо указать email и код подтверждения' },
        { status: 400 }
      );
    }

    // Найти пользователя по email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        emailVerifications: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Найти активный код верификации
    const verificationRecord = user.emailVerifications.find(v => 
      v.code === code && v.expiresAt > new Date()
    );

    if (!verificationRecord) {
      return NextResponse.json(
        { error: 'Неверный или истекший код подтверждения' },
        { status: 400 }
      );
    }

    // Подтвердить email пользователя и удалить все коды верификации
    await prisma.$transaction([
      // Обновить статус пользователя
      prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
        },
      }),
      // Удалить все коды верификации этого пользователя
      prisma.emailVerification.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Email успешно подтвержден',
    });
  } catch (error) {
    console.error('Ошибка верификации email:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}