// app/api/auth/update-password/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import bcryptjs from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Токен и пароль обязательны' },
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

    // Хешируем новый пароль
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Обновляем пароль и удаляем токен сброса
    await prisma.$transaction([
      // Обновляем пароль пользователя
      prisma.user.update({
        where: { id: passwordReset.userId },
        data: {
          password: hashedPassword
        }
      }),
      // Удаляем все токены сброса пароля этого пользователя
      prisma.passwordReset.deleteMany({
        where: { userId: passwordReset.userId }
      })
    ]);

    return NextResponse.json(
      { message: 'Пароль успешно обновлен' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при обновлении пароля:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обновлении пароля' },
      { status: 500 }
    );
  }
}