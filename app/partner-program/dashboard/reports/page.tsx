"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { ReportGenerationSchema } from "@/lib/schemas";

export default function ReportsPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reportType: "leads"
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch stats and recentLeads from API
  const [stats, setStats] = useState({ totalCommission: 0, currentMonthCommission: 0, totalLeads: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [commissionChange, setCommissionChange] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch('/api/partner/reports?page=1&limit=10');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Błąd pobierania raportów');
        }
        // Calculate stats from reports if needed
        const reports = data.reports || data.data?.reports || [];
        setRecentLeads(reports);
        // Calculate commissions for current and previous month
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const currentMonthCommission = reports
          .filter((r: any) => {
            const created = new Date(r.createdAt);
            return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
          })
          .reduce((sum: number, r: any) => sum + (r.commissionAmount || 0), 0);
        const prevMonthCommission = reports
          .filter((r: any) => {
            const created = new Date(r.createdAt);
            return created.getMonth() === prevMonth && created.getFullYear() === prevMonthYear;
          })
          .reduce((sum: number, r: any) => sum + (r.commissionAmount || 0), 0);
        // Calculate percentage change
        let changeString = null;
        if (prevMonthCommission === 0 && currentMonthCommission === 0) {
          changeString = null;
        } else if (prevMonthCommission === 0) {
          changeString = '+100% vs poprzedni miesiąc';
        } else {
          const percent = ((currentMonthCommission - prevMonthCommission) / prevMonthCommission) * 100;
          changeString = `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}% vs poprzedni miesiąc`;
        }
        setCommissionChange(changeString);
        setStats({
          totalCommission: reports.reduce((sum: number, r: any) => sum + (r.commissionAmount || 0), 0),
          currentMonthCommission,
          totalLeads: reports.length,
        });
      } catch (err: any) {
        setFetchError(err.message || 'Wystąpił błąd podczas pobierania raportów.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({ ...prev, [name]: undefined }));
  };

  const handleSelect = (value: string) => {
    setForm((prev) => ({ ...prev, reportType: value }));
    setErrors((prev: any) => ({ ...prev, reportType: undefined }));
  };

  const handleDownload = async (e: any, format: "csv" | "xlsx") => {
    e.preventDefault();
    setErrors({});
    let parsed;
    try {
      parsed = ReportGenerationSchema.parse(form);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fieldErrors: any = {};
        err.errors.forEach((zodErr: any) => {
          fieldErrors[zodErr.path[0]] = zodErr.message;
        });
        toast({
          title: "Błąd formularza",
          description: "Proszę poprawić błędy w formularzu.",
          variant: "destructive"
        });
        setErrors(fieldErrors);
        return;
      }
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        startDate: form.startDate,
        endDate: form.endDate
      };
      const res = await fetch("/api/partner/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Błąd generowania raportu",
          description: data.error || "Nie udało się wygenerować raportu.",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Sukces!",
        description: data.message || "Raport został wygenerowany.",
        variant: "default"
      });
      const url = format === "csv" ? data.csvUrl : data.xlsxUrl;
      if (url) {
        try {
          const fileRes = await fetch(url);
          if (!fileRes.ok) throw new Error("Plik nie istnieje lub wystąpił błąd podczas pobierania.");
          window.open(url, "_blank");
        } catch (err) {
          toast({
            title: "Błąd pobierania pliku",
            description: "Nie znaleziono pliku do pobrania.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Błąd pobierania pliku",
          description: "Nie znaleziono pliku do pobrania.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Błąd generowania raportu",
        description: "Wystąpił nieoczekiwany błąd.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading-bold text-[#2D2D2D] mb-2">Raporty i statystyki</h1>
        <p className="text-[#666666] font-body-regular">Generuj raporty, śledź prowizje i analizuj postępy w Programie Partnerskim</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Łączna prowizja</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">{stats.totalCommission.toFixed(2)} zł</p>
                {commissionChange && (
                  <p className={`text-sm ${commissionChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{commissionChange}</p>
                )}
              </div>
              <BarChart3 className="h-8 w-8 text-[#D4AF37]" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Ten miesiąc</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">{stats.currentMonthCommission.toFixed(2)} zł</p>
                <p className="text-sm font-body-regular text-[#666666]">Prowizja bieżąca</p>
              </div>
              <Download className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body-medium text-[#666666]">Zrealizowane zgłoszenia</p>
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">{stats.totalLeads}</p>
                <p className="text-sm font-body-regular text-[#666666]">Łączna liczba</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation Section */}
      <Card className="border-[#F0F0F0] shadow-sm mb-8">
        <CardHeader>
          <CardTitle className="font-heading-medium text-[#2D2D2D]">Generowanie raportu</CardTitle>
          <CardDescription className="font-body-regular text-[#666666]">
            Wybierz zakres dat i typ raportu, aby wygenerować szczegółowy raport
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="startDate" className="text-[#2A2A2A] font-body-medium mb-2 block">Data od</Label>
              <Input 
                id="startDate"
                type="date" 
                name="startDate" 
                value={form.startDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className={`border ${errors.startDate ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-3 w-full focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <Label htmlFor="endDate" className="text-[#2A2A2A] font-body-medium mb-2 block">Data do</Label>
              <Input 
                id="endDate"
                type="date" 
                name="endDate" 
                value={form.endDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className={`border ${errors.endDate ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-3 w-full focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
            <div>
              <Label htmlFor="reportType" className="text-[#2A2A2A] font-body-medium mb-2 block">Typ raportu</Label>
              <Select name="reportType" value={form.reportType} onValueChange={handleSelect}>
                <SelectTrigger className={`border ${errors.reportType ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-3 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors`}>
                  <SelectValue placeholder="Wybierz typ raportu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leads">Zgłoszenia</SelectItem>
                  <SelectItem value="commissions">Prowizje</SelectItem>
                  <SelectItem value="combined">Zgłoszenia i prowizje</SelectItem>
                </SelectContent>
              </Select>
              {errors.reportType && <p className="text-red-500 text-sm mt-1">{errors.reportType}</p>}
            </div>
            <div className="md:col-span-3 flex flex-wrap gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={(e) => handleDownload(e, "csv")}
                disabled={isSubmitting}
                className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-body-medium transition-colors"
              >
                <Download className="mr-2 h-4 w-4" /> 
                {isSubmitting ? 'Generowanie...' : 'Pobierz CSV'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={(e) => handleDownload(e, "xlsx")}
                disabled={isSubmitting}
                className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-body-medium transition-colors"
              >
                <Download className="mr-2 h-4 w-4" /> 
                {isSubmitting ? 'Generowanie...' : 'Pobierz XLSX'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recent Leads Section */}
      <Card className="border-[#F0F0F0] shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading-medium text-[#2D2D2D]">Statystyki zespołu</CardTitle>
          <CardDescription className="font-body-regular text-[#666666]">
            Przegłąd ostatnich zgłoszeń i ich statusów
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#666666] font-body-regular mb-4">
                Brak ostatnich zgłoszeń do wyświetlenia.
              </p>
              <Button asChild className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-body-medium">
                <Link href="/partner-program/dashboard/new-lead">
                  <Download className="mr-2 h-4 w-4" />
                  Dodaj nowe zgłoszenie
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imię i nazwisko</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Data zgłoszenia</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Wartość</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.map((lead: any) => (
                  <TableRow key={lead.id}>
                    <TableCell>{lead.firstName} {lead.lastName}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>
                      {new Date(lead.createdAt).toLocaleDateString('pl-PL')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          lead.leadStatus === 'CONVERTED' ? 'default' : 
                          lead.leadStatus === 'PENDING' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {lead.leadStatus === 'CONVERTED' ? 'Zrealizowane' : 
                         lead.leadStatus === 'PENDING' ? 'Oczekujące' : 
                         'Odrzucone'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lead.estimatedValue ? `${lead.estimatedValue.toFixed(2)} zł` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 