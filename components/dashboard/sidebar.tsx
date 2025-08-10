'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  History, 
  Users, 
  Plus, 
  LogOut, 
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Home
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from '@/context/sidebar-context';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;

  if (!user) {
    return null;
  }

  // Extract user details
  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() 
    : user?.email?.slice(0,2).toUpperCase() || 'UN';

  // Determine user status badge
  const getStatusBadge = () => {
    if (!user?.isVerified) {
      return <Badge variant="secondary">Oczekuje na weryfikację</Badge>;
    }
    if (!user?.isActive) {
      return <Badge variant="destructive">Konto nieaktywne</Badge>;
    }
    return <Badge variant="default">Aktywny</Badge>;
  };

  const accountType = user?.accountType;

  const navItems = {
    dashboard: { name: 'Dashboard', href: '/partner-program/dashboard', icon: Home, description: 'Przegląd główny' },
    newLead: { name: 'Nowe zgłoszenie', href: '/partner-program/dashboard/new-lead', icon: Plus, description: 'Dodaj nowy lead' },
    leadHistory: { name: 'Historia zgłoszeń', href: '/partner-program/dashboard/leads', icon: History, description: 'Przeglądaj leady' },
    team: { name: 'Zarządzanie zespołem', href: '/partner-program/dashboard/team', icon: Users, description: 'Zespół firmy' },
    reports: { name: 'Raporty', href: '/partner-program/dashboard/reports', icon: BarChart3, description: 'Statystyki i raporty' },
  };

  let navigation = [];

  if (accountType === 'TEAM_MEMBER') {
    navigation = [navItems.newLead];
  } else if (accountType === 'COMPANY') {
    navigation = [navItems.dashboard, navItems.newLead, navItems.leadHistory, navItems.team, navItems.reports];
  } else if (accountType === 'PARTNER') {
    navigation = [navItems.dashboard, navItems.newLead, navItems.leadHistory, navItems.reports];
  }

  const getRoleDisplayName = (accountType?: string) => {
    switch (accountType) {
      case 'COMPANY':
        return 'Partner Firmowy';
      case 'TEAM_MEMBER':
        return 'Pracownik';
      case 'PARTNER':
      default:
        return 'Partner Indywidualny';
    }
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 z-50 h-screen bg-white shadow-lg transition-transform duration-300 flex flex-col w-64",
      "lg:translate-x-0 lg:w-auto",
      isSidebarCollapsed ? "-translate-x-full lg:w-20" : "translate-x-0 lg:w-64",
      className
    )}>
      {/* Header for Desktop */}
      <div className={cn("hidden lg:flex items-center h-16 px-6 border-b border-[#F0F0F0]", isSidebarCollapsed ? "justify-center" : "justify-between")}>
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#D4AF37] to-[#b38a34] rounded-lg flex items-center justify-center">
              <Home className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-heading-medium text-[#2D2D2D]">Partner Panel</h1>
              <p className="text-xs text-[#666666]">ArtScore Pro</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="h-8 w-8 p-0 hidden lg:block"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/partner-program/dashboard' && pathname.startsWith(item.href + '/'));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group",
                isActive
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#b38a34] text-white shadow-sm"
                  : "text-[#666666] hover:bg-[#F8F8F8] hover:text-[#2D2D2D]",
                isSidebarCollapsed ? "justify-center" : "justify-start"
              )}
              title={isSidebarCollapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                "h-5 w-5",
                isActive ? "text-white" : "text-[#D4AF37]"
              )} />
              {!isSidebarCollapsed && (
                <div className="flex-1">
                  <p className={cn(
                    "font-body-medium",
                    isActive ? "text-white" : "text-[#2D2D2D]"
                  )}>
                    {item.name}
                  </p>
                  <p className={cn(
                    "text-xs",
                    isActive ? "text-white/80" : "text-[#666666]"
                  )}>
                    {item.description}
                  </p>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info - positioned at bottom */}
      <div className="mt-auto p-4 border-t border-[#F0F0F0] space-y-3">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F8F8]">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback className="bg-[#D4AF37] text-white">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              {user?.referralCode && (
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gradient-to-r from-[#D4AF37] to-[#b38a34] text-white border-none">
                    {user.referralCode}
                  </Badge>
                </div>
              )}
              <p className="font-body-medium text-[#2D2D2D] truncate">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-[#666666] truncate">
                {getRoleDisplayName(user?.accountType)}
              </p>
            </div>
          </div>
        )}
        
        <Button
          onClick={async () => {
            const { signOut } = await import('next-auth/react');
            await signOut({ callbackUrl: '/partner-program/login' });
          }}
          variant="ghost"
          className="w-full flex items-center gap-2 justify-start text-[#666666] hover:text-[#2D2D2D] hover:bg-[#F8F8F8]"
        >
          <LogOut className="h-4 w-4" />
          {!isSidebarCollapsed && <span>Wyloguj się</span>}
        </Button>
      </div>
    </div>
  );
}
