# Arcadia Craft

Arcadia Craft — веб-сервис для управления аккаунтами игроков, продажи внутриигровых ключей и привилегий, а также предоставления базовой поддержки и внутренних заявок для команды сервера.

- [Русская версия](#русская-версия)
- [English version](#english-version)

---

## Русская версия

### Ключевые возможности
- Регистрация и подтверждение учётной записи по email.
- Авторизация и восстановление пароля.
- Магазин внутриигровых ключей и привилегий (оплата в рублях).
- Оформление заказов через корзину с правилами (1 привилегия + до 4 видов ключей).
- Личный кабинет:
  - привязка никнейма к аккаунту;
  - отображение статистики игрока (после привязки).
- Мини-сервис поддержки:
  - жалобы на игроков;
  - обжалование наказаний;
  - баг-репорты.
- Заявки в команду сервера (простые квизы для авторизованных пользователей).

### Технический стек
- **Frontend:** Next.js 15, React 19.
- **Backend / ORM:** Prisma 6.
- **Аутентификация:** NextAuth (JWT).
- **Почта:** Resend.
- **Валидация:** Zod.
- **Состояние:** Zustand.
- **UI / утилиты:** framer-motion, swiper, react-hook-form, lucide-react, react-hot-toast.
- **Сборка/инструменты:** TypeScript 5, ESLint 9, Tailwind CSS 4, @next/bundle-analyzer, cross-env.

> Требования: Node.js ≥ 18, npm ≥ 9, настроенная СУБД (указать в `DATABASE_URL`).

### Быстрый старт
1) Клонировать репозиторий:
```bash
git clone <repo-url>
cd <repo>
```

2) Установить зависимости:
```bash
npm install
```

3) Создать `.env` (на основе `.env.example`, если есть) и заполнить переменные:
```dotenv
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
NEXTAUTH_SECRET="strong-random-string"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="another-strong-random-string"
RESEND_API_KEY="re_xxx"

PAYMENT_PROVIDER="..."
PAYMENT_SECRET_KEY="..."
PAYMENT_PUBLIC_KEY="..."
```

4) Инициализировать БД и/или выполнить сид:
```bash
npx prisma migrate dev
npm run prisma
```

5) Запустить в dev-режиме:
```bash
npm run dev
```

### Доступные npm-скрипты
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "prisma": "prisma db seed",
  "analyze": "cross-env ANALYZE=true next build"
}
```

- `npm run dev` — локальная разработка  
- `npm run build` — сборка  
- `npm start` — запуск собранного приложения  
- `npm run lint` — проверка ESLint  
- `npm run prisma` — сид базы  
- `npm run analyze` — сборка с анализом бандла

### Архитектура и интеграции
- API реализуется средствами Next.js (API Routes / Route Handlers).
- Аутентификация на базе NextAuth (JWT).
- Email-подтверждение через Resend.
- Оплата — интеграция с платёжным провайдером.

### Статус разработки и план (roadmap)

**Backend**
1. Регистрация пользователя.  
   1.1 Подтверждение аккаунта по почте.  
2. Авторизация пользователя.  
   2.1 Сброс пароля по почте.  
3. Привязка игрового никнейма к аккаунту.  
   3.1 Отображение данных игрока в личном кабинете после привязки.  
4. Логика обработки заказов.  
   4.1 Интеграция платёжной системы.

**Frontend**
- Формы регистрации, авторизации и восстановления пароля в модальных окнах.  
- Личный кабинет: привязка никнейма и базовый вывод данных.  
- Магазин и корзина (Zustand).  
- Страница оформления заказа реализована.

### Развёртывание
```bash
npm run build
npm start
```
- Настройте переменные окружения и доступ к БД.  
- Убедитесь, что `NEXTAUTH_URL` соответствует домену продакшена.  
- Проверьте ключи почтового и платёжного провайдера.

### Контрибьюция
1. Форк репозитория.  
2. Ветка `feature/<name>` или `fix/<name>`.  
3. Pull Request с описанием изменений.

### Лицензия
Дизайн/оформление сайта: **CC BY-ND (Attribution-NoDerivs)**.

---

## English version

### Overview
Arcadia Craft is a web service for player account management, in-game keys & perks store, order processing, and lightweight support tooling for a game server team.

### Key Features
- Sign-up with email verification.
- Sign-in and password reset.
- In-game keys & perks store (payments in rubles).
- Cart & checkout with rules (1 perk + up to 4 key types).
- User dashboard:
  - link game nickname to the account;
  - view player stats (after linking).
- Lightweight support service:
  - player reports;
  - punishment appeals;
  - bug reports.
- Staff applications — simple quizzes for authenticated users.

### Tech Stack
- **Frontend:** Next.js 15, React 19  
- **Backend / ORM:** Prisma 6  
- **Auth:** NextAuth (JWT)  
- **Email:** Resend  
- **Validation:** Zod  
- **State:** Zustand  
- **UI / Utils:** framer-motion, swiper, react-hook-form, lucide-react, react-hot-toast  
- **Tooling:** TypeScript 5, ESLint 9, Tailwind CSS 4, @next/bundle-analyzer, cross-env

> Requirements: Node.js ≥ 18, npm ≥ 9, configured database (`DATABASE_URL`).

### Getting Started
1) Clone and install:
```bash
git clone <repo-url>
cd <repo>
npm install
```

2) Configure environment:
```dotenv
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
NEXTAUTH_SECRET="strong-random-string"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="another-strong-random-string"
RESEND_API_KEY="re_xxx"

PAYMENT_PROVIDER="..."
PAYMENT_SECRET_KEY="..."
PAYMENT_PUBLIC_KEY="..."
```

3) DB setup & seed:
```bash
npx prisma migrate dev
npm run prisma
```

4) Run dev server:
```bash
npm run dev
```

### Available Scripts
```text
dev, build, start, lint, prisma, analyze
```

### Architecture & Integrations
- Next.js API routes / route handlers.  
- Authentication via NextAuth (JWT).  
- Email verification via Resend.  
- Payment provider integration (in progress).

### Roadmap

**Backend**
1. User registration (with email verification)  
2. User authorization (with password reset)  
3. Link game nickname to account; show player data after linking  
4. Order processing; payment provider integration

**Frontend**
- Modal-based auth & recovery forms  
- User dashboard with nickname linking  
- Store & cart (Zustand)  
- Checkout page implemented

### Deployment
```bash
npm run build
npm start
```
- Ensure environment variables & DB are configured.  
- Set `NEXTAUTH_URL` to production domain.  
- Verify email and payment provider keys.

### Contributing
- Fork → feature/fix branch → PR with description & test steps.

### License
Site design/visuals: **CC BY-ND (Attribution-NoDerivs)**.
