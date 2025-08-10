'use client';

import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from '@/context/sidebar-context';

export function MobileHeader() {
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();

  return (
    <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/partner-program/dashboard" className="flex items-center">
            <Image src="/images/arts-logo.png" alt="ARTSCore Logo" width={32} height={32} />
            <span className="ml-2 font-bold">ARTSCORE</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isSidebarCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
