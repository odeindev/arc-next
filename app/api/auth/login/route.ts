import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Проверка наличия email и пароля
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' }, 
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: 'Неверные учетные данные' }, 
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Неверные учетные данные' }, 
        { status: 401 }
      );
    }

    // Генерация JWT-токена
    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Фатальная ошибка:', error);
    
    // Разные типы ошибок
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Ошибка токена' }, 
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Внутренняя ошибка сервера' }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Неизвестная ошибка сервера' }, 
      { status: 500 }
    );
  }
}