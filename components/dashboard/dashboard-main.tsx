'use client';

import { useSidebar } from '@/context/sidebar-context';
import { cn } from '@/lib/utils';

export function DashboardMain({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useSidebar();

  return (
    <main className={cn("transition-all duration-300", {
      "lg:ml-64": !isSidebarCollapsed,
      "lg:ml-20": isSidebarCollapsed, // Adjusted for icon-only width
    })}>
      <div className="p-4 md:p-6 lg:p-8">
        {children}
      </div>
    </main>
  );
}
