import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Pobieranie i weryfikacja sesji NextAuth
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Nie jesteś zalogowany' },
        { status: 401 }
      );
    }

    // Pobieranie parametrów zapytania
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all, month, week

    // Przygotowanie daty początkowej dla filtrowania
    let startDate: Date | null = null;
    const now = new Date();

    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Pierwszy dzień bieżącego miesiąca
    } else if (period === 'week') {
      const dayOfWeek = now.getDay() || 7; // Niedziela to 0, zmieniamy na 7
      startDate = new Date(now);
      startDate.setDate(now.getDate() - dayOfWeek + 1); // Poniedziałek bieżącego tygodnia
      startDate.setHours(0, 0, 0, 0);
    }

    // Budowanie warunków zapytania
    const where: any = { partnerId: session.user.id };
    if (startDate) {
      where.createdAt = { gte: startDate };
    }

    // Pobieranie wszystkich leadów dla danego okresu
    const leadsData = await prisma.lead.findMany({ where });

    // Obliczanie statystyk
    const totalLeads = leadsData.length;
    
    // Liczba leadów według statusu
    const leadsByStatus = {
      new: leadsData.filter((lead: any) => lead.status === 'new').length,
      in_progress: leadsData.filter((lead: any) => lead.status === 'in_progress').length,
      completed: leadsData.filter((lead: any) => lead.status === 'completed').length,
      rejected: leadsData.filter((lead: any) => lead.status === 'rejected').length,
    };

    // Obliczanie wartości leadów
    const totalValue = leadsData.reduce((sum: number, lead: any) => sum + (parseFloat(lead.value || '0') || 0), 0);
    const completedValue = leadsData
      .filter((lead: any) => lead.status === 'completed')
      .reduce((sum: number, lead: any) => sum + (parseFloat(lead.value || '0') || 0), 0);

    // Obliczanie współczynnika konwersji
    const conversionRate = totalLeads > 0 ? (leadsByStatus.completed / totalLeads) * 100 : 0;

    // Pobieranie trendów (liczba leadów w ostatnich 6 miesiącach)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyTrends = await prisma.$queryRaw<{
      month: Date;
      count: bigint;
    }[]>`
      SELECT DATE_TRUNC('month', "created_at") as month, COUNT(*) as count
      FROM leads
      WHERE "partner_id" = ${session.user.id} AND "created_at" >= ${sixMonthsAgo}
      GROUP BY month
      ORDER BY month;
`

    // Formatowanie danych trendów
    const trends = monthlyTrends.map((item: any) => ({
      month: new Date(item.month).toISOString().substring(0, 7), // Format YYYY-MM
      count: Number(item.count.toString()),
    }));

    // Pobieranie ostatnich leadów
    const recentLeads = await prisma.lead.findMany({
      where: { partnerId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Pobieranie kodu polecającego użytkownika
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        referralCode: true
      }
    });

    return NextResponse.json({
      totalLeads,
      leadsByStatus,
      totalValue,
      completedValue,
      conversionRate,
      trends,
      recentLeads,
      referralCode: user?.referralCode || ''
    });
  } catch (error) {
    console.error('Błąd podczas pobierania statystyk użytkownika:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania statystyk' },
      { status: 500 }
    );
  }
}