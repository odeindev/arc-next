// @app/api/auth/resend-code/route.ts
import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email уже подтвержден' },
        { status: 400 }
      );
    }

    // Генерируем новый код
    const verificationCode = generateVerificationCode();

    // Обновляем код верификации
    await prisma.user.update({
      where: { email },
      data: { verificationCode },
    });

    const isDevelopment = process.env.NODE_ENV === 'development';
    
    try {
      // Отправляем новый код
      await sendVerificationEmail(email, verificationCode);
    } catch (emailError) {
      // В режиме разработки игнорируем ошибки отправки
      if (!isDevelopment) {
        console.error('Ошибка отправки email:', emailError);
        return NextResponse.json(
          { 
            error: 'Не удалось отправить новый код подтверждения. Пожалуйста, попробуйте еще раз или обратитесь в поддержку.' 
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Новый код подтверждения отправлен',
      ...(isDevelopment ? { devCode: verificationCode } : {})
    });
  } catch (error) {
    console.error('Ошибка отправки кода:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}