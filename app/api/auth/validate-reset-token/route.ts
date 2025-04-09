// app/api/auth/validate-reset-token/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Ищем пользователя с указанным токеном
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()  // Токен не должен быть просрочен
        }
      }
    });

    if (!user) {
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