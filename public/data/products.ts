// data/products.ts

export interface Product {
    id: number;
    name: string;
    type: 'subscription' | 'key';
    price: string;
    description: string;
    benefits?: string[];
    icon?: string;
  }
  
  export const products: Product[] = [
    {
      id: 1,
      name: 'Ghost',
      type: 'subscription',
      price: '500 ₽',
      description: 'Идеальная привилегия для начинающих игроков. Всё, что нужно, чтобы спокойно освоиться на сервере.',
      benefits: ['Доступ к /kit ghost', 'Возможность установки 2 точек дома', 'Предметы в /kit ghost обновляются каждые 24 часа'],
      icon: '/icons/ghost-icon.png',
    },
    {
      id: 2,
      name: 'Hero',
      type: 'subscription',
      price: '1000 ₽',
      description: 'Больше возможностей для опытных игроков. Включает все преимущества Ghost и многое другое.',
      benefits: ['Доступ к /kit hero', 'Возможность установки 4 точек дома', 'Команда /feed для мгновенного насыщения', 'Доступ к эндер-сундуку через команду /enderchest'],
      icon: '/icons/hero-icon.png',
    },
    {
      id: 3,
      name: 'Titan',
      type: 'subscription',
      price: '1500 ₽',
      description: 'Расширенные возможности для преданных игроков. Включает все преимущества Hero и дополнительные бонусы.',
      benefits: ['Доступ к /kit titan', 'Возможность установки 6 точек дома', 'Команда /heal для восстановления здоровья', 'Полный доступ к цветным никам'],
      icon: '/icons/titan-icon.png',
    },
    {
      id: 4,
      name: 'God',
      type: 'subscription',
      price: '2000 ₽',
      description: 'Максимальные возможности для истинных ценителей. Включает в себя все привилегии и эксклюзивные возможности.',
      benefits: ['Доступ ко всем наборам', 'Возможность установки 10 точек дома', 'Команды /heal, /feed, /fly', 'Эксклюзивные предметы и возможности'],
      icon: '/icons/god-icon.png',
    },
    {
      id: 5,
      name: 'Необычный ключ',
      type: 'key',
      price: '50 ₽',
      description: 'Ключ для необычного кейса. Шанс получить редкие предметы и ресурсы.',
      icon: '/icons/uncommon-key.png',
    },
    {
      id: 6,
      name: 'Редкий ключ',
      type: 'key',
      price: '100 ₽',
      description: 'Ключ для редкого кейса. Повышенный шанс получения ценных ресурсов и предметов.',
      icon: '/icons/rare-key.png',
    },
    {
      id: 7,
      name: 'Мифический ключ',
      type: 'key',
      price: '250 ₽',
      description: 'Ключ для мифического кейса. Содержит высокие шансы на эксклюзивные предметы и редкие ресурсы.',
      icon: '/icons/mythic-key.png',
    },
    {
      id: 8,
      name: 'Легендарный ключ',
      type: 'key',
      price: '500 ₽',
      description: 'Ключ для легендарного кейса. Гарантирует получение самых редких и ценных предметов на сервере.',
      icon: '/icons/legendary-key.png',
    },
  ];
  