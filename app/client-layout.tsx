// app/client-layout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { Header, Footer } from '../components/shared';
import { AuthProvider } from '@/context/auth-context';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <main className="min-h-screen">
          <Header />
          {children}
          <Footer />
        </main>
      </AuthProvider>
    </SessionProvider>
  );
}