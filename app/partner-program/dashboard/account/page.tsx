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
  Eye,
  EyeOff,
  Save,
  Bell,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedElement } from '@/components/animations/animated-element';
import { fadeIn } from '@/components/animations/animation-variants';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



export default function AccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Dane formularza
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
  });

  // Dane formularza zmiany hasła
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Dane powiadomień
  const [notifications, setNotifications] = useState({
    emailNewLeads: false,
    emailLeadUpdates: false,
    emailUserProgram: false,
    emailMarketing: false
  });

  // Widoczność hasła
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Stan zapisu
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  // Pobieranie danych partnera z API
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/partner/account', { credentials: 'include' });
        const data = await res.json();
        if (res.ok) {
          setUserData(data.user);
          setFormData({
            name: data.user.name,
            company: data.user.companyName || data.user.company || '',
            email: data.user.email,
            phone: data.user.phone,
            address: data.user.address,
          });
          setNotifications(data.user.notifications || {});
        } else {
          setUserData(null);
          setFormData({ name: '', company: '', email: '', phone: '', address: '' });
          setNotifications(data.user.notifications || { emailNewLeads: false, emailLeadUpdates: false, emailUserProgram: false, emailMarketing: false });
          toast({ title: 'Błąd', description: data.error || 'Nie udało się pobrać danych użytkownika', variant: 'destructive' });
        }
      } catch (err) {
        setUserData(null);
        setFormData({ name: '', company: '', email: '', phone: '', address: '' });
        setNotifications({ emailNewLeads: false, emailLeadUpdates: false, emailUserProgram: false, emailMarketing: false });
        toast({ title: 'Błąd', description: 'Błąd połączenia z serwerem', variant: 'destructive' });
      }
      setIsLoading(false);
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/partner/logout', { method: 'POST' });
      if (res.ok) {
        toast({
          title: "Wylogowano pomyślnie",
          description: "Dziękujemy za korzystanie z Programu Partnerskiego ARTSCore.",
          variant: "default",
        });
        setTimeout(() => {
          router.push('/partner-program/login');
        }, 1500);
      } else {
        const data = await res.json();
        toast({ title: 'Błąd', description: data.error || 'Wystąpił błąd podczas wylogowywania.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Błąd', description: 'Błąd połączenia z serwerem.', variant: 'destructive' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/partner/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personalData: formData })
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Dane zapisane', description: data.message || 'Twoje dane zostały zaktualizowane.', variant: 'default' });
      } else {
        toast({ title: 'Błąd', description: data.error || 'Nie udało się zapisać danych.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Błąd', description: 'Błąd połączenia z serwerem', variant: 'destructive' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Błąd",
        description: "Nowe hasło i potwierdzenie hasła nie są identyczne.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Błąd",
        description: "Nowe hasło musi mieć co najmniej 8 znaków.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch('/api/partner/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passwordChange: { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword } })
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Hasło zmienione', description: data.message || 'Twoje hasło zostało pomyślnie zaktualizowane.', variant: 'default' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const title = data.error?.includes("Obecne hasło") ? "Błędne aktualne hasło" : "Błąd zmiany hasła";
        toast({ title: title, description: data.error || 'Nie udało się zmienić hasła. Spróbuj ponownie.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Błąd', description: 'Błąd połączenia z serwerem', variant: 'destructive' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingNotifications(true);
    try {
      const res = await fetch('/api/partner/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationSettings: notifications })
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Ustawienia powiadomień zapisane', description: data.message || 'Preferencje powiadomień zostały zaktualizowane.', variant: 'default' });
      } else {
        toast({ title: 'Błąd', description: data.error || 'Nie udało się zapisać ustawień powiadomień.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Błąd', description: 'Błąd połączenia z serwerem', variant: 'destructive' });
    } finally {
      setIsSavingNotifications(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-body-regular">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E8E8] shadow-sm py-3 px-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center">
                <Image
                  src="/images/arts-logo.png"
                  alt="ARTSCore Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="ml-1 sm:ml-2">
                <h1 className="text-lg sm:text-xl uppercase text-[#2A2A2A] font-body-semibold">
                  ARTSCORE
                </h1>
              </div>
            </Link>
            <div className="ml-4 sm:ml-6 text-sm sm:text-base text-[#666666] font-body-medium">
              Panel Partnera
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center">
              <Image src={userData ? userData.avatar : '/images/default-avatar.png'} alt="Avatar" width={80} height={80} className="rounded-full border-2 border-white shadow-md" />
              <div>
                <h2 className="text-lg font-body-semibold text-[#2A2A2A] mb-1">{userData ? userData.name : '...'}</h2>
                <p className="text-sm text-[#666666]">{userData ? userData.email : '...'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-[#666666] hover:text-[#b38a34] transition-colors duration-300 flex items-center"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-1 hidden sm:inline">Wyloguj</span>
            </button>
            <button 
              className="sm:hidden text-[#2A2A2A]"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="sm:hidden bg-white border-b border-[#E8E8E8] shadow-sm">
          <div className="p-4">
            <div className="flex items-center mb-4 pb-4 border-b border-[#E8E8E8]">
              <div className="w-8 h-8 rounded-full bg-[#b38a34] text-white flex items-center justify-center mr-2">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm text-[#2A2A2A]">{userData?.email || 'partner@example.com'}</span>
            </div>
            <nav className="space-y-3">
              <Link href="/partner-program/dashboard" className="flex items-center text-[#2A2A2A] py-2 hover:text-[#b38a34]">
                <BarChart3 className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </Link>
              <Link href="/partner-program/dashboard/leads" className="flex items-center text-[#2A2A2A] py-2 hover:text-[#b38a34]">
                <Users className="w-5 h-5 mr-3" />
                <span>Moje leady</span>
              </Link>
              <Link href="/partner-program/dashboard/account" className="flex items-center text-[#b38a34] py-2">
                <Settings className="w-5 h-5 mr-3" />
                <span>Moje dane</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row">
        {/* Sidebar - visible only on desktop */}
        <aside className="hidden sm:block w-64 bg-white border-r border-[#E8E8E8] min-h-[calc(100vh-60px)] p-6">
          <nav className="space-y-6">
            <div>
              <h3 className="text-xs uppercase text-[#999999] font-body-medium mb-3">Menu</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/partner-program/dashboard" className="flex items-center text-[#2A2A2A] py-2 hover:text-[#b38a34]">
                    <BarChart3 className="w-5 h-5 mr-3" />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link href="/partner-program/dashboard/leads" className="flex items-center text-[#2A2A2A] py-2 hover:text-[#b38a34]">
                    <Users className="w-5 h-5 mr-3" />
                    <span>Moje leady</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase text-[#999999] font-body-medium mb-3">Ustawienia</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/partner-program/dashboard/account" className="flex items-center text-[#b38a34] py-2">
                    <Settings className="w-5 h-5 mr-3" />
                    <span>Moje dane</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatedElement variants={fadeIn}>
            <div className="mb-6">
              <h1 className="text-2xl font-body-semibold text-[#2A2A2A] mb-2">Moje dane</h1>
              <p className="text-[#666666]">Zarządzaj swoimi danymi i ustawieniami konta.</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b38a34]"></div>
              </div>
            ) : (
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="profile">Dane profilu</TabsTrigger>
                  <TabsTrigger value="password">Zmiana hasła</TabsTrigger>
                  <TabsTrigger value="notifications">Powiadomienia</TabsTrigger>
                </TabsList>

                {/* Dane profilu */}
                <TabsContent value="profile">
                  <div className="bg-white border border-[#E8E8E8] rounded-lg shadow-sm p-6">
                    <form onSubmit={handleSaveProfile}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <Label htmlFor="name" className="text-sm text-[#666666] mb-1 block">Imię i nazwisko</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="border border-[#E8E8E8] rounded-lg p-2 w-full"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="company" className="text-sm text-[#666666] mb-1 block">Nazwa firmy</Label>
                          <Input
                            id="company"
                            name="company"
                            type="text"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="border border-[#E8E8E8] rounded-lg p-2 w-full"
                            disabled={!formData.company || userData?.accountType !== 'company'}
                          />
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-sm text-[#666666] mb-1 block">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="border border-[#E8E8E8] rounded-lg p-2 w-full"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone" className="text-sm text-[#666666] mb-1 block">Telefon</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="border border-[#E8E8E8] rounded-lg p-2 w-full"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="address" className="text-sm text-[#666666] mb-1 block">Adres</Label>
                          <Input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="border border-[#E8E8E8] rounded-lg p-2 w-full"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <Label className="text-sm text-[#666666] mb-1 block">Typ konta</Label>
                        <div className="text-[#2A2A2A] font-body-medium">{userData?.accountType}</div>
                      </div>

                      <div className="mb-6">
                        <Label className="text-sm text-[#666666] mb-1 block">Kod polecający</Label>
                        <div className="flex items-center">
                          <div className="bg-[#F8F9FA] border border-[#E8E8E8] rounded-lg p-2 font-body-medium text-[#2A2A2A]">
                            {userData?.referralCode}
                          </div>
                          <button 
                            type="button"
                            className="ml-2 text-[#b38a34] hover:text-[#9a7529] transition-colors duration-300"
                            onClick={() => {
                              if (userData?.referralCode) navigator.clipboard.writeText(userData.referralCode);
                              toast({
                                title: "Skopiowano",
                                description: "Kod polecający został skopiowany do schowka.",
                                variant: "default",
                              });
                            }}
                          >
                            Kopiuj
                          </button>
                        </div>
                        <p className="text-xs text-[#666666] mt-1">Udostępnij ten kod swoim klientom, aby śledzić polecenia.</p>
                      </div>

                      <div className="flex justify-end">
                        <Button 
                          type="submit"
                          className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white py-2 px-4 rounded-lg font-body-medium transition-all duration-300 hover:shadow-lg flex items-center"
                          disabled={isSavingProfile}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isSavingProfile ? 'Zapisywanie...' : 'Zapisz zmiany'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>

                {/* Zmiana hasła */}
                <TabsContent value="password">
                  <div className="bg-white border border-[#E8E8E8] rounded-lg shadow-sm p-6">
                    <form onSubmit={handleSavePassword}>
                      <div className="space-y-6 mb-6">
                        <div>
                          <Label htmlFor="currentPassword" className="text-sm text-[#666666] mb-1 block">Aktualne hasło</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="border border-[#E8E8E8] rounded-lg p-2 w-full pr-10"
                              required
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666666] hover:text-[#b38a34]"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="newPassword" className="text-sm text-[#666666] mb-1 block">Nowe hasło</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="border border-[#E8E8E8] rounded-lg p-2 w-full pr-10"
                              required
                              minLength={8}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666666] hover:text-[#b38a34]"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          <p className="text-xs text-[#666666] mt-1">Hasło musi mieć co najmniej 8 znaków.</p>
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword" className="text-sm text-[#666666] mb-1 block">Potwierdź nowe hasło</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="border border-[#E8E8E8] rounded-lg p-2 w-full pr-10"
                              required
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666666] hover:text-[#b38a34]"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button 
                          type="submit"
                          className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white py-2 px-4 rounded-lg font-body-medium transition-all duration-300 hover:shadow-lg flex items-center"
                          disabled={isSavingPassword}
                        >
                          <Key className="w-4 h-4 mr-2" />
                          {isSavingPassword ? 'Zmienianie hasła...' : 'Zmień hasło'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>

                {/* Powiadomienia */}
                <TabsContent value="notifications">
                  <div className="bg-white border border-[#E8E8E8] rounded-lg shadow-sm p-6">
                    <form onSubmit={handleSaveNotifications}>
                      <div className="space-y-6 mb-6">
                        <h2 className="text-lg font-body-semibold text-[#2A2A2A] mb-4">Ustawienia powiadomień email</h2>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="emailNewLeads" className="text-[#2A2A2A] font-body-medium">Nowe leady</Label>
                            <p className="text-sm text-[#666666]">Otrzymuj powiadomienia o nowych leadach.</p>
                          </div>
                          <Switch
                            id="emailNewLeads"
                            checked={notifications.emailNewLeads}
                            onCheckedChange={(checked) => handleNotificationChange('emailNewLeads', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="emailLeadUpdates" className="text-[#2A2A2A] font-body-medium">Aktualizacje leadów</Label>
                            <p className="text-sm text-[#666666]">Otrzymuj powiadomienia o zmianach statusu leadów.</p>
                          </div>
                          <Switch
                            id="emailLeadUpdates"
                            checked={notifications.emailLeadUpdates}
                            onCheckedChange={(checked) => handleNotificationChange('emailLeadUpdates', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="emailUserProgram" className="text-[#2A2A2A] font-body-medium">Program Partnerski</Label>
                            <p className="text-sm text-[#666666]">Otrzymuj ważne informacje dotyczące Programu Partnerskiego.</p>
                          </div>
                          <Switch
                            id="emailUserProgram"
                            checked={notifications.emailUserProgram}
                            onCheckedChange={(checked) => handleNotificationChange('emailUserProgram', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="emailMarketing" className="text-[#2A2A2A] font-body-medium">Marketing</Label>
                            <p className="text-sm text-[#666666]">Otrzymuj informacje o promocjach i nowościach.</p>
                          </div>
                          <Switch
                            id="emailMarketing"
                            checked={notifications.emailMarketing}
                            onCheckedChange={(checked) => handleNotificationChange('emailMarketing', checked)}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button 
                          type="submit"
                          className="bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white py-2 px-4 rounded-lg font-body-medium transition-all duration-300 hover:shadow-lg flex items-center"
                          disabled={isSavingNotifications}
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          {isSavingNotifications ? 'Zapisywanie ustawień...' : 'Zapisz preferencje'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </AnimatedElement>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E8E8E8] py-4 px-4 text-center">
        <div className="max-w-7xl mx-auto text-sm text-[#666666]">
          &copy; {new Date().getFullYear()} ARTSCore. Wszelkie prawa zastrzeżone.
        </div>
      </footer>
    </div>
  );
}