// @app/api/auth/verify-email/route.ts
import { prisma } from '@/components/shared/lib/prisma/prisma-client';
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
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Проверить код подтверждения
    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: 'Неверный код подтверждения' },
        { status: 400 }
      );
    }

    // Подтвердить email пользователя
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null, // Удаляем код после успешной проверки
      },
    });

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