'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  LogOut, 
  BarChart3, 
  Users, 
  Settings,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedElement } from '@/components/animations/animated-element';
import { fadeIn } from '@/components/animations/animation-variants';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function NotificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    emailNewLeads: false,
    emailLeadUpdates: false,
    emailUserProgram: false,
    emailMarketing: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/partner/notifications', { credentials: 'include' });
        const data = await res.json();
        if (res.ok) {
          setNotifications(data.notifications);
        } else {
          toast({ title: 'Błąd', description: data.error || 'Nie udało się pobrać ustawień powiadomień', variant: 'destructive' });
        }
      } catch (error) {
        toast({ title: 'Błąd', description: 'Błąd połączenia z serwerem', variant: 'destructive' });
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, [toast]);

  const handleNotificationChange = async (name: string, checked: boolean) => {
    const newNotifications = { ...notifications, [name]: checked };
    setNotifications(newNotifications);

    try {
      const res = await fetch('/api/partner/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: newNotifications }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Sukces', description: 'Ustawienia powiadomień zostały zaktualizowane.', variant: 'default' });
      } else {
        toast({ title: 'Błąd', description: data.error || 'Nie udało się zapisać zmian', variant: 'destructive' });
        // Revert state on failure
        setNotifications(notifications);
      }
    } catch (error) {
      toast({ title: 'Błąd', description: 'Błąd połączenia z serwerem', variant: 'destructive' });
      setNotifications(notifications);
    }
  };
  
  const handleLogout = async () => {
    await fetch('/api/partner/logout', { method: 'POST', credentials: 'include' });
    router.push('/partner-program/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-body-regular">
       <header className="bg-white border-b border-[#E8E8E8] shadow-sm py-3 px-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
             <Image src="/images/arts-logo.png" alt="ARTSCore Logo" width={32} height={32} />
             <h1 className="ml-2 text-xl uppercase text-[#2A2A2A] font-body-semibold">ARTSCORE</h1>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" /> Wyloguj</Button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)}><Settings className="w-6 h-6" /></button>
          </div>
        </div>
        {showMobileMenu && (
          <div className="md:hidden mt-4 p-4 bg-white border-t">
            <nav className="space-y-2">
              <Link href="/partner-program/dashboard" className="flex items-center p-2 rounded hover:bg-gray-100"><BarChart3 className="w-5 h-5 mr-3" /> Panel główny</Link>
              <Link href="/partner-program/dashboard/leads" className="flex items-center p-2 rounded hover:bg-gray-100"><Users className="w-5 h-5 mr-3" /> Moje leady</Link>
              <Link href="/partner-program/dashboard/account" className="flex items-center p-2 rounded hover:bg-gray-100"><User className="w-5 h-5 mr-3" /> Moje dane</Link>
              <Link href="/partner-program/dashboard/notifications" className="flex items-center p-2 rounded bg-gray-100"><Bell className="w-5 h-5 mr-3" /> Powiadomienia</Link>
            </nav>
            <Button onClick={handleLogout} className="w-full mt-4">Wyloguj</Button>
          </div>
        )}
      </header>

      <div className="flex">
        <aside className="hidden md:block w-64 bg-white border-r min-h-screen p-6">
          <nav className="space-y-6">
             <div>
              <h3 className="text-xs uppercase text-[#999999] font-body-medium mb-3">Menu</h3>
              <ul className="space-y-2">
                <li><Link href="/partner-program/dashboard" className="flex items-center text-[#2A2A2A] py-2 hover:text-[#b38a34]"><BarChart3 className="w-5 h-5 mr-3" />Panel główny</Link></li>
                <li><Link href="/partner-program/dashboard/leads" className="flex items-center text-[#2A2A2A] py-2 hover:text-[#b38a34]"><Users className="w-5 h-5 mr-3" />Moje leady</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase text-[#999999] font-body-medium mb-3">Ustawienia</h3>
              <ul className="space-y-2">
                <li><Link href="/partner-program/dashboard/account" className="flex items-center text-[#2A2A2A] py-2 hover:text-[#b38a34]"><User className="w-5 h-5 mr-3" />Moje dane</Link></li>
                <li><Link href="/partner-program/dashboard/notifications" className="flex items-center text-[#b38a34] py-2"><Bell className="w-5 h-5 mr-3" />Powiadomienia</Link></li>
              </ul>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-8 bg-[#F8F9FA]">
          <AnimatedElement variants={fadeIn}>
            <h1 className="text-3xl font-body-bold text-[#2A2A2A] mb-6">Powiadomienia</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl">
              {isLoading ? (
                <p>Ładowanie ustawień...</p>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNewLeads" className="text-[#2A2A2A] font-body-medium">Nowe leady</Label>
                      <p className="text-sm text-[#666666]">Otrzymuj powiadomienia o nowych leadach.</p>
                    </div>
                    <Switch id="emailNewLeads" checked={notifications.emailNewLeads} onCheckedChange={(checked) => handleNotificationChange('emailNewLeads', checked)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailLeadUpdates" className="text-[#2A2A2A] font-body-medium">Aktualizacje leadów</Label>
                      <p className="text-sm text-[#666666]">Otrzymuj powiadomienia o zmianach statusu leadów.</p>
                    </div>
                    <Switch id="emailLeadUpdates" checked={notifications.emailLeadUpdates} onCheckedChange={(checked) => handleNotificationChange('emailLeadUpdates', checked)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailPartnerProgram" className="text-[#2A2A2A] font-body-medium">Program Partnerski</Label>
                      <p className="text-sm text-[#666666]">Otrzymuj ważne informacje dotyczące Programu Partnerskiego.</p>
                    </div>
                    <Switch id="emailPartnerProgram" checked={notifications.emailUserProgram} onCheckedChange={(checked) => handleNotificationChange('emailUserProgram', checked)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailMarketing" className="text-[#2A2A2A] font-body-medium">Marketing</Label>
                      <p className="text-sm text-[#666666]">Otrzymuj informacje o promocjach i nowościach.</p>
                    </div>
                    <Switch id="emailMarketing" checked={notifications.emailMarketing} onCheckedChange={(checked) => handleNotificationChange('emailMarketing', checked)} />
                  </div>
                </div>
              )}
            </div>
          </AnimatedElement>
        </main>
      </div>
    </div>
  );
}
