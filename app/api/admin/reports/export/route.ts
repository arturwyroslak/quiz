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
    const format = searchParams.get('format') || 'csv';
    const days = parseInt(searchParams.get('days') || '30');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch leads data for export
    const leads = await prisma.lead.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      include: {
        partner: {
          select: {
            name: true,
            email: true,
            companyName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = [
        'ID',
        'Imię',
        'Nazwisko', 
        'Email',
        'Telefon',
        'Miasto',
        'Status',
        'Wartość szacowana',
        'Partner',
        'Email partnera',
        'Data utworzenia'
      ].join(',');

      const csvRows = leads.map(lead => [
        lead.id,
        `"${lead.firstName}"`,
        `"${lead.lastName}"`,
        `"${lead.email}"`,
        `"${lead.phone}"`,
        `"${lead.city}"`,
        `"${lead.status}"`,
        lead.estimatedValue || 0,
        `"${lead.partner.companyName || lead.partner.name || ''}"`,
        `"${lead.partner.email}"`,
        `"${lead.createdAt.toLocaleDateString('pl-PL')}"`
      ].join(','));

      const csvContent = [csvHeaders, ...csvRows].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="raport-leadow-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    if (format === 'pdf') {
      // For PDF, we'll return a simple text response for now
      // In a real implementation, you'd use a PDF library like puppeteer or jsPDF
      const pdfContent = `
RAPORT LEADÓW - ${new Date().toLocaleDateString('pl-PL')}
Okres: ${days} dni

PODSUMOWANIE:
- Łączna liczba leadów: ${leads.length}
- Przekonwertowane: ${leads.filter(l => l.status === 'CONVERTED').length}
- Oczekujące: ${leads.filter(l => l.status === 'PENDING').length}
- Odrzucone: ${leads.filter(l => l.status === 'REJECTED').length}

SZCZEGÓŁY LEADÓW:
${leads.map(lead => `
- ${lead.firstName} ${lead.lastName} (${lead.email})
  Status: ${lead.status}
  Partner: ${lead.partner.companyName || lead.partner.name}
  Data: ${lead.createdAt.toLocaleDateString('pl-PL')}
`).join('')}
      `;

      return new NextResponse(pdfContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="raport-leadow-${new Date().toISOString().split('T')[0]}.txt"`
        }
      });
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });

  } catch (error) {
    console.error('Error exporting report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
