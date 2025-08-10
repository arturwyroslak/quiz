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

    // Fetch real statistics from database
    const [
      totalUsers,
      totalLeads,
      activePartners,
      pendingLeads,
      recentLeads
    ] = await Promise.all([
      // Total users count
      prisma.user.count(),
      
      // Total leads count
      prisma.lead.count(),
      
      // Active partners count (PARTNER and COMPANY types that are active)
      prisma.user.count({
        where: {
          accountType: { in: ['PARTNER', 'COMPANY'] },
          isActive: true
        }
      }),
      
      // Pending leads count (status 'PENDING' or 'CONTACTED')
      prisma.lead.count({
        where: {
          status: { in: ['PENDING', 'CONTACTED'] }
        }
      }),
      
      // Recent leads for conversion calculation (last 30 days)
      prisma.lead.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        select: {
          status: true,
          createdAt: true
        }
      })
    ]);

    // Calculate conversion rate (converted leads / total leads in last 30 days)
    const convertedLeads = recentLeads.filter((lead: { status: string }) => 
      lead.status === 'CONVERTED'
    ).length;
    
    const conversionRate = recentLeads.length > 0 
      ? Math.round((convertedLeads / recentLeads.length) * 100 * 10) / 10 
      : 0;

    // Calculate monthly revenue (mock for now - would need actual revenue tracking)
    const monthlyRevenue = convertedLeads * 1500; // Assuming average 1500 PLN per conversion

    // Calculate growth (comparing last 30 days vs previous 30 days)
    const previousPeriodLeads = await prisma.lead.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)   // 30 days ago
        }
      }
    });

    const growthRate = previousPeriodLeads > 0 
      ? Math.round(((recentLeads.length - previousPeriodLeads) / previousPeriodLeads) * 100 * 10) / 10
      : 0;

    const stats = {
      totalUsers,
      totalLeads,
      activePartners,
      pendingLeads,
      monthlyRevenue,
      conversionRate,
      growthRate,
      recentLeadsCount: recentLeads.length
    };

    return NextResponse.json({ stats }, { status: 200 });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
