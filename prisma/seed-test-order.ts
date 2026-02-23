import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Заполняем товары если их нет
  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: "Ghost",
          type: "subscription",
          price: 250,
          description: "Привилегия Ghost",
          benefits: [],
        },
        {
          name: "Hero",
          type: "subscription",
          price: 500,
          description: "Привилегия Hero",
          benefits: [],
        },
        {
          name: "Titan",
          type: "subscription",
          price: 750,
          description: "Привилегия Titan",
          benefits: [],
        },
        {
          name: "God",
          type: "subscription",
          price: 1000,
          description: "Привилегия God",
          benefits: [],
        },
      ],
    });
    console.log("✅ Товары добавлены в БД.");
  }

  const user = await prisma.user.findFirst({
    where: { minecraftAccount: { isNot: null } },
    include: { minecraftAccount: true },
  });

  if (!user) {
    console.error("Нет пользователей с привязанным Minecraft-аккаунтом.");
    process.exit(1);
  }

  const product = await prisma.product.findFirst({ where: { name: "Ghost" } });
  if (!product) {
    console.error("Продукт не найден.");
    process.exit(1);
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total: product.price,
      status: "paid",
      items: {
        create: {
          productId: product.id,
          productName: "ghost",
          productType: product.type,
          price: product.price,
          quantity: 1,
        },
      },
    },
  });

  console.log(`✅ Заказ создан: ${order.id}`);
  console.log(
    `Пользователь: ${user.email} (${user.minecraftAccount!.username})`,
  );
  console.log(`Жди до 30 секунд — поллер выдаст привилегию ghost в игре.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
