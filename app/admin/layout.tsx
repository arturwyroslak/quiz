'use client';

import { useState, useEffect } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Przegląd systemu'
  },
  {
    title: 'Użytkownicy',
    href: '/admin/users',
    icon: Users,
    description: 'Zarządzanie kontami'
  },
  {
    title: 'Leady',
    href: '/admin/leads',
    icon: FileText,
    description: 'Wszystkie leady'
  },
  {
    title: 'Raporty',
    href: '/admin/reports',
    icon: BarChart3,
    description: 'Analityki i statystyki'
  },
  {
    title: 'Ustawienia',
    href: '/admin/settings',
    icon: Settings,
    description: 'Konfiguracja systemu'
  }
];

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const sessionResult = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Safe destructuring with fallback
  const session = sessionResult?.data;
  const status = sessionResult?.status || 'loading';

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/partner-program/login');
      return;
    }

    if (session.user?.accountType !== 'ADMIN') {
      router.push('/partner-program/dashboard');
      return;
    }
  }, [session, status, router]);

  const handleSignOut = async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/partner-program/login' });
  };

  if (status === 'loading' || !sessionResult) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
          <p className="mt-2 font-body-regular text-[#666666]">Ładowanie panelu admin...</p>
          <p className="text-xs text-gray-400 mt-1">Status: {status}</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.accountType !== 'ADMIN') {
    return null;
  }

  return (
    <div className="h-screen bg-[#FAFAFA] flex overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-[#F0F0F0]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#D4AF37] to-[#b38a34] rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-heading-medium text-[#2D2D2D]">Admin Panel</h1>
                <p className="text-xs text-[#666666]">ArtScore Pro</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#b38a34] text-white shadow-sm'
                      : 'text-[#666666] hover:bg-[#F8F8F8] hover:text-[#2D2D2D]'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-[#D4AF37]'}`} />
                  <div className="flex-1">
                    <p className={`font-body-medium ${isActive ? 'text-white' : 'text-[#2D2D2D]'}`}>
                      {item.title}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-white/80' : 'text-[#666666]'}`}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-[#F0F0F0] space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F8F8]">
              <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body-medium text-[#2D2D2D] truncate">
                  {session.user.name || 'Administrator'}
                </p>
                <p className="text-xs text-[#666666] truncate">{session.user.email}</p>
              </div>
            </div>
            
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full flex items-center gap-2 justify-start text-[#666666] hover:text-[#2D2D2D] hover:bg-[#F8F8F8]"
            >
              <LogOut className="h-4 w-4" />
              <span>Wyloguj się</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Menu Button */}
        <div className="lg:hidden p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2"
          >
            <Menu className="h-5 w-5" />
            <span>Menu</span>
          </Button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}
