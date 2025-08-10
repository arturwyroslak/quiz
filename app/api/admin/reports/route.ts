import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.accountType !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch data for the specified period
    const [
      totalLeads,
      convertedLeads,
      activePartners,
      allLeads,
      previousPeriodLeads
    ] = await Promise.all([
      // Total leads in period
      prisma.lead.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      
      // Converted leads in period
      prisma.lead.count({
        where: {
          createdAt: { gte: startDate },
          status: 'CONVERTED'
        }
      }),
      
      // Active partners who created leads in period
      prisma.user.count({
        where: {
          accountType: { in: ['PARTNER', 'COMPANY'] },
          isActive: true,
          leads: {
            some: {
              createdAt: { gte: startDate }
            }
          }
        }
      }),
      
      // All leads in period with details
      prisma.lead.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        include: {
          partner: {
            select: {
              id: true,
              name: true,
              companyName: true
            }
          }
        }
      }),
      
      // Previous period for comparison
      prisma.lead.count({
        where: {
          createdAt: {
            gte: new Date(startDate.getTime() - (days * 24 * 60 * 60 * 1000)),
            lt: startDate
          }
        }
      })
    ]);

    // Calculate metrics
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100 * 10) / 10 : 0;
    const totalRevenue = allLeads
      .filter(lead => lead.status === 'CONVERTED')
      .reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);
    
    const avgLeadValue = convertedLeads > 0 ? Math.round(totalRevenue / convertedLeads) : 0;
    const monthlyGrowth = previousPeriodLeads > 0 
      ? Math.round(((totalLeads - previousPeriodLeads) / previousPeriodLeads) * 100 * 10) / 10
      : 0;

    // Lead status distribution
    const leadsByStatus = {
      pending: allLeads.filter(lead => lead.status === 'PENDING').length,
      contacted: allLeads.filter(lead => lead.status === 'CONTACTED').length,
      converted: allLeads.filter(lead => lead.status === 'CONVERTED').length,
      rejected: allLeads.filter(lead => lead.status === 'REJECTED').length,
    };

    // Top partners
    const partnerStats = allLeads.reduce((acc: any, lead) => {
      const partnerId = lead.partnerId;
      const partnerName = lead.partner.companyName || lead.partner.name || 'Unknown';
      
      if (!acc[partnerId]) {
        acc[partnerId] = {
          id: partnerId,
          name: partnerName,
          leadsCount: 0,
          conversions: 0,
          revenue: 0
        };
      }
      
      acc[partnerId].leadsCount++;
      if (lead.status === 'CONVERTED') {
        acc[partnerId].conversions++;
        acc[partnerId].revenue += lead.estimatedValue || 0;
      }
      
      return acc;
    }, {});

    const topPartners = Object.values(partnerStats)
      .map((partner: any) => ({
        ...partner,
        conversionRate: partner.leadsCount > 0 
          ? Math.round((partner.conversions / partner.leadsCount) * 100 * 10) / 10 
          : 0
      }))
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    // Monthly stats (simplified - last few months)
    const monthlyStats = [];
    for (let i = Math.min(days / 30, 6); i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      
      const monthLeads = await prisma.lead.findMany({
        where: {
          createdAt: {
            gte: monthStart,
            lt: monthEnd
          }
        }
      });
      
      const monthConversions = monthLeads.filter(lead => lead.status === 'CONVERTED').length;
      const monthRevenue = monthLeads
        .filter(lead => lead.status === 'CONVERTED')
        .reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);
      
      monthlyStats.push({
        month: monthStart.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' }),
        leads: monthLeads.length,
        conversions: monthConversions,
        revenue: monthRevenue
      });
    }

    const reportData = {
      totalRevenue,
      conversionRate,
      averageLeadValue: avgLeadValue,
      activePartners,
      leadStatusDistribution: leadsByStatus,
      topPartners,
      monthlyTrends: monthlyStats.map(stat => ({
        ...stat,
        conversionRate: stat.leads > 0 ? Math.round((stat.conversions / stat.leads) * 100 * 10) / 10 : 0
      }))
    };

    return NextResponse.json(reportData, { status: 200 });

  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
