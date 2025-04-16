import { PrismaClient, ProductType } from '@prisma/client';
import { products } from '@/public/data/products';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function up() {
  // Создаем пользователей
  await prisma.user.createMany({
    data: [
      {
        username: 'User',
        email: 'user@test.ru',
        password: hashSync('121311', 10),
        emailVerified: true,
      },
      {
        username: 'Admin',
        email: 'admin@test.ru',
        password: hashSync('112232', 10),
        emailVerified: true,
      },
    ],
  });

  // Импортируем товары
  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        type: product.type as ProductType,
        price: parseFloat(product.price.replace(/[^\d.]/g, '')),
        description: product.description,
        benefits: product.benefits || [],
        icon: product.icon || '',
      },
    });
  }

  console.log('🌱 Seed completed!');
}

async function down() {
  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "OrderItem" RESTART IDENTITY CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Order" RESTART IDENTITY CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Payment" RESTART IDENTITY CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "EmailVerification" RESTART IDENTITY CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "PasswordReset" RESTART IDENTITY CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`);
  } catch (error) {
    console.warn('⚠️ Ошибка при очистке данных:', error);
  }
}

async function main() {
  try {
    await down();
    await up();
  } catch (e) {
    console.error('❌ Ошибка при сидировании:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
