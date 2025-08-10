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
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Target,
  Download
} from 'lucide-react';

interface ReportsData {
  totalRevenue: number;
  conversionRate: number;
  averageLeadValue: number;
  activePartners: number;
  leadStatusDistribution: {
    pending: number;
    contacted: number;
    converted: number;
    rejected: number;
  };
  topPartners: Array<{
    name: string;
    revenue: number;
    conversionRate: number;
    leadsCount: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    leads: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  }>;
}

export default function AdminReportsPage() {
  const sessionResult = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  
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

    fetchReportsData();
  }, [session, status, router]);

  const fetchReportsData = async () => {
    try {
      const response = await fetch('/api/admin/reports');
      if (response.ok) {
        const data = await response.json();
        setReportsData(data);
      } else {
        console.error('Failed to fetch reports data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExporting(true);
    try {
      if (format === 'pdf') {
        // Generate PDF on client side
        await generatePDFReport();
      } else {
        // Handle CSV export via API
        const response = await fetch(`/api/admin/reports/export?format=${format}`);
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `raport-${new Date().toISOString().split('T')[0]}.${format}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          console.error('Błąd podczas eksportowania:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Błąd podczas eksportowania:', error);
    } finally {
      setExporting(false);
    }
  };

  const generatePDFReport = async () => {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Raport Analityczny</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #2D2D2D; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; }
          h2 { color: #2D2D2D; margin-top: 30px; }
          .metric { margin: 10px 0; padding: 8px; background: #f8f8f8; border-left: 4px solid #D4AF37; }
          .partner { margin: 8px 0; padding: 6px; background: #f0f0f0; }
          .footer { margin-top: 50px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <h1>Raport Analityczny - Program Partnerski</h1>
        <p><strong>Data generowania:</strong> ${new Date().toLocaleDateString('pl-PL')}</p>
        
        <h2>Kluczowe Metryki</h2>
        <div class="metric">Całkowity przychód: <strong>${reportsData ? reportsData.totalRevenue.toLocaleString('pl-PL') : '0'} PLN</strong> (+12.5%)</div>
        <div class="metric">Współczynnik konwersji: <strong>${reportsData ? reportsData.conversionRate.toFixed(1) : '0'}%</strong> (${reportsData ? reportsData.leadStatusDistribution.converted : 0} z ${reportsData ? Object.values(reportsData.leadStatusDistribution).reduce((a, b) => a + b, 0) : 0} leadów)</div>
        <div class="metric">Średnia wartość leada: <strong>${reportsData ? reportsData.averageLeadValue.toLocaleString('pl-PL') : '0'} PLN</strong></div>
        <div class="metric">Aktywni partnerzy: <strong>${reportsData ? reportsData.activePartners : 0}</strong></div>
        
        <h2>Rozkład Statusów Leadów</h2>
        <div class="metric">Oczekujące: <strong>${reportsData?.leadStatusDistribution.pending || 0}</strong> (${reportsData ? ((reportsData.leadStatusDistribution.pending / Object.values(reportsData.leadStatusDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1) : '0'}%)</div>
        <div class="metric">Skontaktowane: <strong>${reportsData?.leadStatusDistribution.contacted || 0}</strong> (${reportsData ? ((reportsData.leadStatusDistribution.contacted / Object.values(reportsData.leadStatusDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1) : '0'}%)</div>
        <div class="metric">Przekonwertowane: <strong>${reportsData?.leadStatusDistribution.converted || 0}</strong> (${reportsData ? ((reportsData.leadStatusDistribution.converted / Object.values(reportsData.leadStatusDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1) : '0'}%)</div>
        <div class="metric">Odrzucone: <strong>${reportsData?.leadStatusDistribution.rejected || 0}</strong> (${reportsData ? ((reportsData.leadStatusDistribution.rejected / Object.values(reportsData.leadStatusDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1) : '0'}%)</div>
        
        <h2>Najlepsi Partnerzy</h2>
        ${reportsData?.topPartners.map((partner, index) => 
          `<div class="partner">${index + 1}. ${partner.name} - <strong>${partner.revenue.toLocaleString('pl-PL')} PLN</strong> (${partner.conversionRate.toFixed(1)}% konwersji)</div>`
        ).join('') || '<div class="partner">Brak danych o partnerach</div>'}
        
        <h2>Trendy Miesięczne</h2>
        ${reportsData?.monthlyTrends.map(trend => 
          `<div class="metric">${trend.month}: <strong>${trend.leads} leadów</strong>, ${trend.conversions} konwersji, ${trend.revenue.toLocaleString('pl-PL')} PLN (${trend.conversionRate.toFixed(1)}%)</div>`
        ).join('') || '<div class="metric">Brak danych o trendach miesięcznych</div>'}
        
        <div class="footer">
          Raport wygenerowany automatycznie przez system ARTSCore
        </div>
      </body>
      </html>
    `;
    
    // Create a new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    } else {
      // Fallback: create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `raport-analityczny-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
          <p className="mt-2 font-body-regular text-[#666666]">Ładowanie raportów...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading-bold text-[#2D2D2D] mb-2">Raporty i analityki</h1>
            <p className="text-[#666666] font-body-regular">Szczegółowe analizy wydajności programu partnerskiego</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => handleExport('csv')}
              disabled={exporting}
            >
              <Download className="h-4 w-4" />
              {exporting ? 'Eksportowanie...' : 'Eksportuj CSV'}
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => handleExport('pdf')}
              disabled={exporting}
            >
              <Download className="h-4 w-4" />
              {exporting ? 'Eksportowanie...' : 'Eksportuj PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Całkowity przychód</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">
                  {reportsData ? `${reportsData.totalRevenue.toLocaleString('pl-PL')} PLN` : '0 PLN'}
                </p>
                <p className="text-sm text-green-600">+12.5% vs poprzedni okres</p>
              </div>
              <DollarSign className="h-8 w-8 text-[#D4AF37]" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Współczynnik konwersji</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">
                  {reportsData ? `${reportsData.conversionRate.toFixed(1)}%` : '0%'}
                </p>
                <p className="text-sm font-body-regular text-[#666666]">
                  {reportsData ? 
                    `${reportsData.leadStatusDistribution.converted} z ${Object.values(reportsData.leadStatusDistribution).reduce((a, b) => a + b, 0)} leadów` 
                    : '0 z 0 leadów'
                  }
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Średnia wartość leada</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">
                  {reportsData ? `${reportsData.averageLeadValue.toLocaleString('pl-PL')} PLN` : '0 PLN'}
                </p>
                <p className="text-sm font-body-regular text-[#666666]">Na przekonwertowany lead</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Aktywni partnerzy</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">
                  {reportsData ? reportsData.activePartners : 0}
                </p>
                <p className="text-sm font-body-regular text-[#666666]">W ostatnim miesiącu</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-[#F0F0F0] shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading-medium text-[#2D2D2D]">Rozkład statusów leadów</CardTitle>
            <CardDescription className="font-body-regular text-[#666666]">
              Podział leadów według ich aktualnego statusu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-[#F0F0F0] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-body-medium">Oczekujące</span>
                </div>
                <div className="text-right">
                  <p className="font-body-medium">{reportsData?.leadStatusDistribution.pending || 0}</p>
                  <p className="text-sm text-[#666666]">
                    {reportsData ? 
                      `${((reportsData.leadStatusDistribution.pending / Object.values(reportsData.leadStatusDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%` 
                      : '0%'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-[#F0F0F0] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-body-medium">Skontaktowane</span>
                </div>
                <div className="text-right">
                  <p className="font-body-medium">{reportsData?.leadStatusDistribution.contacted || 0}</p>
                  <p className="text-sm text-[#666666]">
                    {reportsData ? 
                      `${((reportsData.leadStatusDistribution.contacted / Object.values(reportsData.leadStatusDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%` 
                      : '0%'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-[#F0F0F0] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-body-medium">Przekonwertowane</span>
                </div>
                <div className="text-right">
                  <p className="font-body-medium">{reportsData?.leadStatusDistribution.converted || 0}</p>
                  <p className="text-sm text-[#666666]">
                    {reportsData ? 
                      `${((reportsData.leadStatusDistribution.converted / Object.values(reportsData.leadStatusDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%` 
                      : '0%'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-[#F0F0F0] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-body-medium">Odrzucone</span>
                </div>
                <div className="text-right">
                  <p className="font-body-medium">{reportsData?.leadStatusDistribution.rejected || 0}</p>
                  <p className="text-sm text-[#666666]">
                    {reportsData ? 
                      `${((reportsData.leadStatusDistribution.rejected / Object.values(reportsData.leadStatusDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%` 
                      : '0%'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#F0F0F0] shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading-medium text-[#2D2D2D]">Najlepsi partnerzy</CardTitle>
            <CardDescription className="font-body-regular text-[#666666]">
              Partnerzy z najwyższą wydajnością
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData?.topPartners.map((partner, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-[#F0F0F0] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-[#D4AF37] text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-body-medium text-[#2D2D2D]">{partner.name}</p>
                      <p className="text-sm text-[#666666]">{partner.leadsCount} leadów</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-body-medium text-[#2D2D2D]">{partner.revenue.toLocaleString('pl-PL')} PLN</p>
                    <p className="text-sm text-[#666666]">{partner.conversionRate.toFixed(1)}% konwersji</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-[#666666]">
                  <p>Brak danych o partnerach</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="border-[#F0F0F0] shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading-medium text-[#2D2D2D]">Trendy miesięczne</CardTitle>
          <CardDescription className="font-body-regular text-[#666666]">
            Wydajność programu partnerskiego w czasie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F0F0F0]">
                  <th className="text-left py-3 font-body-medium text-[#2D2D2D]">Miesiąc</th>
                  <th className="text-right py-3 font-body-medium text-[#2D2D2D]">Leady</th>
                  <th className="text-right py-3 font-body-medium text-[#2D2D2D]">Konwersje</th>
                  <th className="text-right py-3 font-body-medium text-[#2D2D2D]">Przychód</th>
                  <th className="text-right py-3 font-body-medium text-[#2D2D2D]">Konwersja %</th>
                </tr>
              </thead>
              <tbody>
                {reportsData?.monthlyTrends.map((trend, index) => (
                  <tr key={index} className="border-b border-[#F0F0F0]">
                    <td className="py-3 font-body-regular text-[#2D2D2D]">{trend.month}</td>
                    <td className="text-right py-3 font-body-regular text-[#666666]">{trend.leads}</td>
                    <td className="text-right py-3 font-body-regular text-[#666666]">{trend.conversions}</td>
                    <td className="text-right py-3 font-body-regular text-[#666666]">{trend.revenue.toLocaleString('pl-PL')} PLN</td>
                    <td className="text-right py-3 font-body-regular text-[#666666]">{trend.conversionRate.toFixed(1)}%</td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-[#666666]">
                      Brak danych o trendach miesięcznych
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
