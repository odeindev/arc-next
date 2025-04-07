// @app/api/auth/register/route.ts
import { prisma } from '@/prisma/prisma-client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Генерируем код подтверждения (6 цифр)
    const verificationCode = generateVerificationCode();

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username: '',
        verificationCode,
        emailVerified: false,
      },
    });

    const isDevelopment = process.env.NODE_ENV === 'development';
    
    try {
      // Отправляем email с кодом подтверждения
      await sendVerificationEmail(email, verificationCode);
    } catch (emailError) {
      // В режиме разработки игнорируем ошибки отправки
      if (!isDevelopment) {
        console.error('Ошибка отправки email:', emailError);
        // В продакшене можем вернуть уведомление об ошибке
        return NextResponse.json(
          { 
            error: 'Не удалось отправить код подтверждения. Пожалуйста, попробуйте еще раз или обратитесь в поддержку.' 
          },
          { status: 500 }
        );
      }
    }

    // В режиме разработки возвращаем код для тестирования
    return NextResponse.json({ 
      success: true, 
      message: 'Код подтверждения отправлен на ваш email',
      email,
      ...(isDevelopment ? { devCode: verificationCode } : {})
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}