// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email обязателен' },
        { status: 400 }
      );
    }

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // По соображениям безопасности возвращаем 200 даже если пользователь не найден
      // но не отправляем email
      return NextResponse.json(
        { message: 'Если учетная запись существует, инструкции будут отправлены' },
        { status: 200 }
      );
    }

    // Генерируем токен для сброса пароля
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // Токен действителен 1 час

    // Удаляем старые токены и создаем новый токен сброса пароля
    await prisma.$transaction([
      // Удаляем существующие токены сброса пароля для этого пользователя
      prisma.passwordReset.deleteMany({
        where: { userId: user.id }
      }),
      // Создаем новую запись сброса пароля
      prisma.passwordReset.create({
        data: {
          userId: user.id,
          token: token,
          expiresAt: expiresAt
        }
      })
    ]);

    // Формируем URL для сброса пароля
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

    // Отправляем email с инструкциями
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email,
      subject: 'Сброс пароля',
      html: `
        <div>
          <h1>Сброс пароля</h1>
          <p>Вы запросили сброс пароля. Для продолжения перейдите по ссылке:</p>
          <a href="${resetUrl}">Сбросить пароль</a>
          <p>Ссылка действительна в течение 1 часа.</p>
          <p>Если вы не запрашивали сброс пароля, проигнорируйте это сообщение.</p>
        </div>
      `
    });

    return NextResponse.json(
      { message: 'Инструкции по сбросу пароля отправлены на ваш email' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при обработке запроса на сброс пароля:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обработке запроса' },
      { status: 500 }
    );
  }
}