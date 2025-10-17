// components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  Beaker,
  Search,
  BarChart4,
  HeartPulse,
  DollarSign,
  Settings,
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: HomeIcon,
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Beaker,
    },
    {
      name: 'Market Analysis',
      href: '/market-analysis',
      icon: BarChart4,
    },
    {
      name: 'Patent Research',
      href: '/patent-research',
      icon: Search,
    },
    {
      name: 'Medical Assessment',
      href: '/medical-assessment',
      icon: HeartPulse,
    },
    {
      name: 'Financial Analysis',
      href: '/financial-analysis',
      icon: DollarSign,
    },
  ];

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center">
            <span className="text-xl font-semibold">ConsultingGPT</span>
          </Link>
        )}
        <button
          className="absolute -right-3 top-9 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-3 w-3" />
          ) : (
            <ChevronLeftIcon className="h-3 w-3" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center rounded-lg px-2 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800',
              pathname === item.href &&
                'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
            )}
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-gray-200 p-4 dark:border-slate-800">
        <Link
          href="/settings"
          className="flex items-center rounded-lg px-2 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span className="ml-3 text-sm font-medium">Settings</span>}
        </Link>
      </div>
    </aside>
  );
};
