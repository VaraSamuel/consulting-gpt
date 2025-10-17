'use client';

import { Header } from '@/app/components/layout/header';

export const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50">
      <Header />
      <main className="flex-1 py-8">{children}</main>
    </div>
  );
};
