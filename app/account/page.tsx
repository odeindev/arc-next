//@app/account/page.tsx
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import UserProfile from '@/components/entities/user/ui/user-profile';

export default function AccountPage() {
  // Проверка аутентификации
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/login');
    },
  });  

  // Показываем загрузку, пока проверяется сессия
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Передаем управление компоненту UserProfile
  return <UserProfile />;
}