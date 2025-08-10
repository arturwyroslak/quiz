'use client';

import { useState, useEffect } from 'react';
import InstallModal from '@/components/pwa/install-modal';
import { SidebarProvider } from '@/context/sidebar-context';

const MODAL_SHOWN_KEY = 'installModalShown';

export function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem(MODAL_SHOWN_KEY);

    if (!hasBeenShown) {
      setIsInstallModalOpen(true);
      sessionStorage.setItem(MODAL_SHOWN_KEY, 'true');
    }
  }, []);

  return (
    <SidebarProvider>
      {children}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </SidebarProvider>
  );
}
