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
import {
  Users,
  UserCheck,
  FileText,
  AlertCircle,
  TrendingUp,
  Settings,
  Activity,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  totalLeads: number;
  activePartners: number;
  pendingLeads: number;
  monthlyRevenue: number;
  conversionRate: number;
  growthRate: number;
  recentLeadsCount: number;
}

export default function AdminDashboardPage() {
  const sessionResult = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  
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

    fetchAdminStats();
  }, [session, status, router]);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        console.error('Failed to fetch admin stats:', response.statusText);
        setStats({
          totalUsers: 0,
          totalLeads: 0,
          activePartners: 0,
          pendingLeads: 0,
          monthlyRevenue: 0,
          conversionRate: 0,
          growthRate: 0,
          recentLeadsCount: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      setStats({
        totalUsers: 0,
        totalLeads: 0,
        activePartners: 0,
        pendingLeads: 0,
        monthlyRevenue: 0,
        conversionRate: 0,
        growthRate: 0,
        recentLeadsCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
          <p className="mt-2 font-body-regular text-[#666666]">Ładowanie dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading-bold text-[#2D2D2D] mb-2">Dashboard</h1>
        <p className="text-[#666666] font-body-regular">Przegląd systemu partnerskiego ARTSCore</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Wszyscy użytkownicy</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-[#D4AF37]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Aktywni partnerzy</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">{stats?.activePartners || 0}</p>
              </div>
              <UserCheck className="h-8 w-8 text-[#D4AF37]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Wszystkie leady</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">{stats?.totalLeads || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-[#D4AF37]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Oczekujące leady</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">{stats?.pendingLeads || 0}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[#F0F0F0] shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading-medium text-[#2D2D2D]">Ostatnia aktywność</CardTitle>
            <CardDescription className="font-body-regular text-[#666666]">
              Najnowsze wydarzenia w systemie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
                <UserCheck className="h-5 w-5 text-[#D4AF37]" />
                <div>
                  <p className="font-body-medium text-[#2D2D2D]">Nowy partner zarejestrowany</p>
                  <p className="text-sm font-body-regular text-[#666666]">Jan Kowalski - 2 godziny temu</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-body-medium text-[#2D2D2D]">Lead przekonwertowany</p>
                  <p className="text-sm font-body-regular text-[#666666]">Anna Nowak - 4 godziny temu</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-body-medium text-[#2D2D2D]">Nowy lead dodany</p>
                  <p className="text-sm font-body-regular text-[#666666]">Piotr Wiśniewski - 6 godzin temu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#F0F0F0] shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading-medium text-[#2D2D2D]">Kluczowe metryki</CardTitle>
            <CardDescription className="font-body-regular text-[#666666]">
              Wydajność systemu partnerskiego
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-[#F0F0F0] rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <p className="font-body-medium text-[#2D2D2D]">Miesięczny przychód</p>
                    <p className="text-sm font-body-regular text-[#666666]">{stats?.monthlyRevenue?.toLocaleString('pl-PL') || '0'} PLN</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-[#F0F0F0] rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <p className="font-body-medium text-[#2D2D2D]">Współczynnik konwersji</p>
                    <p className="text-sm font-body-regular text-[#666666]">{stats?.conversionRate || 0}%</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-[#F0F0F0] rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <p className="font-body-medium text-[#2D2D2D]">Wzrost miesięczny</p>
                    <p className="text-sm font-body-regular text-[#666666]">{stats?.growthRate && stats.growthRate > 0 ? '+' : ''}{stats?.growthRate || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
