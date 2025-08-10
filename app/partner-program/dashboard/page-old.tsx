'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

export default async function PartnerDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return null;
  }

  // ADMIN przekierowanie
  if (user.accountType === 'ADMIN') {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/dashboard';
    }
    return null;
  }

  // TEAM_MEMBER uproszczony panel
  if (user.accountType === 'TEAM_MEMBER') {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Panel Pracownika</CardTitle>
            <CardDescription>Masz dostęp tylko do przypisanych leadów i zadań.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button asChild variant="default">
                <Link href="/partner-program/dashboard/leads">Moje leady</Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/partner-program/dashboard/tasks">Moje zadania</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // COMPANY panel
  if (user.accountType === 'COMPANY') {
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

    return (
      <div className="flex min-h-screen">
        {/* Sidebar Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
              <UserCircle className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <div className="flex flex-col space-y-4 p-4">
              {/* User Profile Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.image || undefined} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{user?.name || user?.email}</h2>
                  <p className="text-sm text-muted-foreground">
                    {user?.accountType === 'COMPANY' ? 'Partner Firmowy' : 'Partner Indywidualny'}
                  </p>
                  {getStatusBadge()}
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/partner-program/dashboard/new-lead">
                    <Plus className="mr-2 h-4 w-4" /> Nowe zgłoszenie
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/partner-program/dashboard/leads">
                    <History className="mr-2 h-4 w-4" /> Historia zgłoszeń
                  </Link>
                </Button>
                {user?.accountType === 'COMPANY' && (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/partner-program/dashboard/team">
                      <Users className="mr-2 h-4 w-4" /> Zarządzanie zespołem
                    </Link>
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/partner-program/dashboard/reports">
                    <BarChart3 className="mr-2 h-4 w-4" /> Raporty
                  </Link>
                </Button>
                <form action="/api/auth/signout" method="POST">
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start mt-4"
                    type="submit"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Wyloguj się
                  </Button>
                </form>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <main className="flex-1 p-8 ml-[50px]">
          <Card>
            <CardHeader>
              <CardTitle>Witaj, {user?.name || user?.email}!</CardTitle>
              <CardDescription>
                Twój panel partnera ARTSCore - zarządzaj swoimi zgłoszeniami i rozwijaj biznes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for dashboard summary */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Łączna prowizja</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">5 000 zł</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Ten miesiąc</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">1 200 zł</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Zrealizowane zgłoszenia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">25</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // PARTNER panel (domyślny)
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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
            <UserCircle className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px]">
          <div className="flex flex-col space-y-4 p-4">
            {/* User Profile Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.image || undefined} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{user?.name || user?.email}</h2>
                <p className="text-sm text-muted-foreground">
                  {user?.accountType === 'COMPANY' ? 'Partner Firmowy' : 'Partner Indywidualny'}
                </p>
                {getStatusBadge()}
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                asChild
              >
                <Link href="/partner-program/dashboard/new-lead">
                  <Plus className="mr-2 h-4 w-4" /> Nowe zgłoszenie
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                asChild
              >
                <Link href="/partner-program/dashboard/leads">
                  <History className="mr-2 h-4 w-4" /> Historia zgłoszeń
                </Link>
              </Button>
              {user?.accountType === 'COMPANY' && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/partner-program/dashboard/team">
                    <Users className="mr-2 h-4 w-4" /> Zarządzanie zespołem
                  </Link>
                </Button>
              )}
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                asChild
              >
                <Link href="/partner-program/dashboard/reports">
                  <BarChart3 className="mr-2 h-4 w-4" /> Raporty
                </Link>
              </Button>
              <form action="/api/auth/signout" method="POST">
                <Button 
                  variant="destructive" 
                  className="w-full justify-start mt-4"
                  type="submit"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Wyloguj się
                </Button>
              </form>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <main className="flex-1 p-8 ml-[50px]">
        <Card>
          <CardHeader>
            <CardTitle>Witaj, {user?.name || user?.email}!</CardTitle>
            <CardDescription>
              Twój panel partnera ARTSCore - zarządzaj swoimi zgłoszeniami i rozwijaj biznes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for dashboard summary */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Łączna prowizja</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">5 000 zł</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ten miesiąc</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">1 200 zł</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Zrealizowane zgłoszenia</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">25</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}