'use client';
import { redirect } from 'next/navigation';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp, Users, DollarSign, Activity, Plus } from 'lucide-react';

// Extend the session user type
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accountType: 'PARTNER' | 'COMPANY' | 'TEAM_MEMBER' | 'ADMIN';
  isVerified: boolean;
  isActive: boolean;
}

interface DashboardStats {
  totalLeads: number;
  leadsThisMonth: number;
  convertedLeads: number;
  pendingLeads: number;
  totalCommission: number;
  commissionThisMonth: number;
  conversionRate: number;
}

export default function PartnerDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as ExtendedUser | undefined;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/partner/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data.data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Nie jesteś zalogowany</CardTitle>
            <CardDescription>Zaloguj się, aby zobaczyć dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // ADMIN przekierowanie do admin dashboard
  if (user?.accountType === 'ADMIN') {
    router.push('/admin/dashboard');
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <p>Przekierowywanie do panelu administratora...</p>
        </div>
      </div>
    );
  }

  // TEAM_MEMBER redirection to new lead page
  if (user?.accountType === 'TEAM_MEMBER') {
    router.push('/partner-program/dashboard/new-lead');
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <p>Przekierowywanie do formularza dodawania leadów...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Błąd</CardTitle>
            <CardDescription>Nie udało się załadować danych: {error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchStats}>Spróbuj ponownie</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading-bold text-[#2D2D2D] mb-2">
          Witaj, {user?.name || user?.email}!
        </h1>
        <p className="text-[#666666] font-body-regular">
          Twój panel partnera ARTSCore - zarządzaj swoimi zgłoszeniami i rozwijaj biznes.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Łączne leady</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">{stats?.totalLeads || 0}</p>
              </div>
              <Users className="h-8 w-8 text-[#D4AF37]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Zrealizowane</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">{stats?.convertedLeads || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#D4AF37]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Łączna prowizja</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">{stats?.totalCommission || 0} zł</p>
              </div>
              <DollarSign className="h-8 w-8 text-[#D4AF37]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Ten miesiąc</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">{stats?.commissionThisMonth || 0} zł</p>
              </div>
              <Activity className="h-8 w-8 text-[#D4AF37]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
      <Card className="border-[#F0F0F0] shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading-medium text-[#2D2D2D]">Ostatnia aktywność</CardTitle>
          <CardDescription className="font-body-regular text-[#666666]">
            Przegląd najnowszych leadów i aktywności
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
              <Users className="h-5 w-5 text-[#D4AF37]" />
              <div>
                <p className="font-body-medium text-[#2D2D2D]">Nowy lead dodany</p>
                <p className="text-sm font-body-regular text-[#666666]">Ostatni lead - 2 godziny temu</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-body-medium text-[#2D2D2D]">Lead przekonwertowany</p>
                <p className="text-sm font-body-regular text-[#666666]">Prowizja naliczona - 4 godziny temu</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-body-medium text-[#2D2D2D]">Aktualizacja statusu</p>
                <p className="text-sm font-body-regular text-[#666666]">Lead w trakcie realizacji - 6 godzin temu</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

        <Card className="border-[#F0F0F0] shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading-medium text-[#2D2D2D]">Kluczowe metryki</CardTitle>
            <CardDescription className="font-body-regular text-[#666666]">
              Wydajność Twoich leadów
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-[#F0F0F0] rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <p className="font-body-medium text-[#2D2D2D]">Miesięczna prowizja</p>
                    <p className="text-sm font-body-regular text-[#666666]">{stats?.commissionThisMonth?.toLocaleString('pl-PL') || '0'} PLN</p>
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
                    <p className="font-body-medium text-[#2D2D2D]">Leady w tym miesiącu</p>
                    <p className="text-sm font-body-regular text-[#666666]">{stats?.leadsThisMonth || 0}</p>
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
