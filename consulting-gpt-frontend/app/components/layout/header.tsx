'use client';

import Container from '@/app/components/layout/container';
import Link from 'next/link';
import { HorizontalNav } from './horizontal-nav';

export const Header = (/*{ toggleSidebar, sidebarCollapsed }: HeaderProps*/) => {
  return (
    <div className="border-b">
      <Container>
        <div className="relative flex h-16 items-center px-8 sm:px-6 lg:px-8">
          <Link href="/" className="ml-4 flex gap-x-2 lg:ml-0"></Link>
          <HorizontalNav />
        </div>
      </Container>
    </div>
  );
};
