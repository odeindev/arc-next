// app/api/auth/validate-reset-token/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Токен не предоставлен' },
        { status: 400 }
      );
    }

    // Ищем запись сброса пароля с указанным токеном, который еще не истек
    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        token: token,
        expiresAt: {
          gt: new Date()  // Токен не должен быть просрочен
        }
      },
      include: {
        user: true
      }
    });

    if (!passwordReset) {
      return NextResponse.json(
        { error: 'Недействительный или истекший токен' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { valid: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при проверке токена' },
      { status: 500 }
    );
  }
}