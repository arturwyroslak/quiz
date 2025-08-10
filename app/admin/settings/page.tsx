'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Settings,
  Save,
  RefreshCw,
  Mail,
  Database,
  Shield,
  Globe,
  Bell,
  DollarSign,
  Users,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface SystemSettings {
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpEnabled: boolean;
  };
  partnerSettings: {
    defaultCommission: number;
    minLeadValue: number;
    autoApproval: boolean;
    maxTeamMembers: number;
  };
  systemSettings: {
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
    maxLoginAttempts: number;
  };
  notificationSettings: {
    newLeadNotifications: boolean;
    conversionNotifications: boolean;
    systemAlerts: boolean;
    emailDigest: boolean;
  };
}

export default function AdminSettingsPage() {
  const sessionResult = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('system');
  
  // Safe destructuring with fallback
  const session = sessionResult?.data;
  const status = sessionResult?.status || 'loading';

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/partner-program/login');
      return;
    }

    if (session.user.accountType !== 'ADMIN') {
      router.push('/partner-program/dashboard');
      return;
    }

    fetchSettings();
  }, [session, status, router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      } else {
        console.error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        // Show success message
        alert('Ustawienia zostały zapisane pomyślnie!');
      } else {
        console.error('Failed to save settings');
        alert('Błąd podczas zapisywania ustawień');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Błąd podczas zapisywania ustawień');
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (section: keyof SystemSettings, key: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
          <p className="mt-2 font-body-regular text-[#666666]">Ładowanie ustawień...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'system', label: 'System', icon: Settings },
    { id: 'partner', label: 'Program partnerski', icon: Users },
    { id: 'email', label: 'E-mail', icon: Mail },
    { id: 'notifications', label: 'Powiadomienia', icon: Bell },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading-bold text-[#2D2D2D] mb-2">Ustawienia systemu</h1>
            <p className="text-[#666666] font-body-regular">Konfiguracja systemu i programu partnerskiego</p>
          </div>
            
            <Button
              onClick={saveSettings}
              disabled={saving}
              className="bg-[#D4AF37] hover:bg-[#b38a34] text-white"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Zapisz ustawienia
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Tabs */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#D4AF37] text-white'
                          : 'text-[#666666] hover:bg-[#F0F0F0]'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="font-body-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeTab === 'system' && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading-medium text-[#2D2D2D] flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Ustawienia systemowe
                  </CardTitle>
                  <CardDescription>
                    Podstawowa konfiguracja systemu i bezpieczeństwa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-[#F0F0F0] rounded-lg">
                    <div>
                      <h3 className="font-body-medium text-[#2D2D2D]">Tryb konserwacji</h3>
                      <p className="text-sm text-[#666666]">Wyłącz dostęp do systemu dla użytkowników</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.systemSettings.maintenanceMode || false}
                        onChange={(e) => updateSettings('systemSettings', 'maintenanceMode', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-[#F0F0F0] rounded-lg">
                    <div>
                      <h3 className="font-body-medium text-[#2D2D2D]">Rejestracja włączona</h3>
                      <p className="text-sm text-[#666666]">Pozwól nowym użytkownikom na rejestrację</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.systemSettings.registrationEnabled || false}
                        onChange={(e) => updateSettings('systemSettings', 'registrationEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-[#F0F0F0] rounded-lg">
                    <div>
                      <h3 className="font-body-medium text-[#2D2D2D]">Wymagana weryfikacja e-mail</h3>
                      <p className="text-sm text-[#666666]">Użytkownicy muszą zweryfikować adres e-mail</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.systemSettings.emailVerificationRequired || false}
                        onChange={(e) => updateSettings('systemSettings', 'emailVerificationRequired', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  <div className="p-4 border border-[#F0F0F0] rounded-lg">
                    <h3 className="font-body-medium text-[#2D2D2D] mb-2">Maksymalna liczba prób logowania</h3>
                    <p className="text-sm text-[#666666] mb-3">Po przekroczeniu konto zostanie zablokowane</p>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings?.systemSettings.maxLoginAttempts || 5}
                      onChange={(e) => updateSettings('systemSettings', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="w-20 px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'partner' && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading-medium text-[#2D2D2D] flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Ustawienia programu partnerskiego
                  </CardTitle>
                  <CardDescription>
                    Konfiguracja prowizji i zasad programu partnerskiego
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border border-[#F0F0F0] rounded-lg">
                    <h3 className="font-body-medium text-[#2D2D2D] mb-2">Domyślna prowizja (%)</h3>
                    <p className="text-sm text-[#666666] mb-3">Procent prowizji dla nowych partnerów</p>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings?.partnerSettings.defaultCommission || 10}
                      onChange={(e) => updateSettings('partnerSettings', 'defaultCommission', parseFloat(e.target.value))}
                      className="w-24 px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    <span className="ml-2 text-[#666666]">%</span>
                  </div>

                  <div className="p-4 border border-[#F0F0F0] rounded-lg">
                    <h3 className="font-body-medium text-[#2D2D2D] mb-2">Minimalna wartość leada (PLN)</h3>
                    <p className="text-sm text-[#666666] mb-3">Minimalna wartość leada do naliczenia prowizji</p>
                    <input
                      type="number"
                      min="0"
                      value={settings?.partnerSettings.minLeadValue || 1000}
                      onChange={(e) => updateSettings('partnerSettings', 'minLeadValue', parseInt(e.target.value))}
                      className="w-32 px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    <span className="ml-2 text-[#666666]">PLN</span>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-[#F0F0F0] rounded-lg">
                    <div>
                      <h3 className="font-body-medium text-[#2D2D2D]">Automatyczne zatwierdzanie partnerów</h3>
                      <p className="text-sm text-[#666666]">Nowi partnerzy są automatycznie zatwierdzani</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.partnerSettings.autoApproval || false}
                        onChange={(e) => updateSettings('partnerSettings', 'autoApproval', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  <div className="p-4 border border-[#F0F0F0] rounded-lg">
                    <h3 className="font-body-medium text-[#2D2D2D] mb-2">Maksymalna liczba członków zespołu</h3>
                    <p className="text-sm text-[#666666] mb-3">Limit członków zespołu na partnera</p>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={settings?.partnerSettings.maxTeamMembers || 10}
                      onChange={(e) => updateSettings('partnerSettings', 'maxTeamMembers', parseInt(e.target.value))}
                      className="w-20 px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'email' && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading-medium text-[#2D2D2D] flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Ustawienia e-mail
                  </CardTitle>
                  <CardDescription>
                    Konfiguracja serwera SMTP i powiadomień e-mail
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-[#F0F0F0] rounded-lg">
                    <div>
                      <h3 className="font-body-medium text-[#2D2D2D]">E-mail włączony</h3>
                      <p className="text-sm text-[#666666]">Włącz wysyłanie powiadomień e-mail</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.emailSettings.smtpEnabled || false}
                        onChange={(e) => updateSettings('emailSettings', 'smtpEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  <div className="p-4 border border-[#F0F0F0] rounded-lg">
                    <h3 className="font-body-medium text-[#2D2D2D] mb-2">Serwer SMTP</h3>
                    <p className="text-sm text-[#666666] mb-3">Adres serwera SMTP</p>
                    <input
                      type="text"
                      value={settings?.emailSettings.smtpHost || ''}
                      onChange={(e) => updateSettings('emailSettings', 'smtpHost', e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="p-4 border border-[#F0F0F0] rounded-lg">
                    <h3 className="font-body-medium text-[#2D2D2D] mb-2">Port SMTP</h3>
                    <p className="text-sm text-[#666666] mb-3">Port serwera SMTP</p>
                    <input
                      type="number"
                      min="1"
                      max="65535"
                      value={settings?.emailSettings.smtpPort || 587}
                      onChange={(e) => updateSettings('emailSettings', 'smtpPort', parseInt(e.target.value))}
                      className="w-24 px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="p-4 border border-[#F0F0F0] rounded-lg">
                    <h3 className="font-body-medium text-[#2D2D2D] mb-2">Użytkownik SMTP</h3>
                    <p className="text-sm text-[#666666] mb-3">Adres e-mail do uwierzytelniania</p>
                    <input
                      type="email"
                      value={settings?.emailSettings.smtpUser || ''}
                      onChange={(e) => updateSettings('emailSettings', 'smtpUser', e.target.value)}
                      placeholder="your-email@domain.com"
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading-medium text-[#2D2D2D] flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Ustawienia powiadomień
                  </CardTitle>
                  <CardDescription>
                    Konfiguracja powiadomień systemowych
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-[#F0F0F0] rounded-lg">
                    <div>
                      <h3 className="font-body-medium text-[#2D2D2D]">Powiadomienia o nowych leadach</h3>
                      <p className="text-sm text-[#666666]">Wysyłaj powiadomienia o nowych leadach</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.notificationSettings.newLeadNotifications || false}
                        onChange={(e) => updateSettings('notificationSettings', 'newLeadNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-[#F0F0F0] rounded-lg">
                    <div>
                      <h3 className="font-body-medium text-[#2D2D2D]">Powiadomienia o konwersjach</h3>
                      <p className="text-sm text-[#666666]">Wysyłaj powiadomienia o przekonwertowanych leadach</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.notificationSettings.conversionNotifications || false}
                        onChange={(e) => updateSettings('notificationSettings', 'conversionNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-[#F0F0F0] rounded-lg">
                    <div>
                      <h3 className="font-body-medium text-[#2D2D2D]">Alerty systemowe</h3>
                      <p className="text-sm text-[#666666]">Wysyłaj powiadomienia o błędach systemu</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.notificationSettings.systemAlerts || false}
                        onChange={(e) => updateSettings('notificationSettings', 'systemAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-[#F0F0F0] rounded-lg">
                    <div>
                      <h3 className="font-body-medium text-[#2D2D2D]">Podsumowanie e-mail</h3>
                      <p className="text-sm text-[#666666]">Wysyłaj cotygodniowe podsumowanie</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.notificationSettings.emailDigest || false}
                        onChange={(e) => updateSettings('notificationSettings', 'emailDigest', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
    </div>
  );
}
