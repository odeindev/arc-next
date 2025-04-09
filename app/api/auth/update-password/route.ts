// app/api/auth/update-password/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Токен и пароль обязательны' },
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

    // Хешируем новый пароль
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Обновляем пароль и очищаем токен сброса
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

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