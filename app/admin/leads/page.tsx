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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  FileText,
  Search,
  Filter,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  estimatedValue: number | null;
  createdAt: string;
  partner: {
    name: string | null;
    email: string;
    companyName: string | null;
  };
}

export default function AdminLeadsPage() {
  const sessionResult = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
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

    fetchLeads();
  }, [session, status, router]);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads);
      } else {
        console.error('Failed to fetch leads');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.partner.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'PENDING': 'secondary',
      'CONTACTED': 'default',
      'CONVERTED': 'default',
      'REJECTED': 'destructive'
    };
    
    const labels = {
      'PENDING': 'Oczekujący',
      'CONTACTED': 'Skontaktowany',
      'CONVERTED': 'Przekonwertowany',
      'REJECTED': 'Odrzucony'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
          <p className="mt-2 font-body-regular text-[#666666]">Ładowanie leadów...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading-bold text-[#2D2D2D] mb-2">Wszystkie leady</h1>
        <p className="text-[#666666] font-body-regular">Zarządzaj wszystkimi leadami w systemie partnerskim</p>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-body-regular text-[#666666]">Wszystkie leady</p>
                  <p className="text-2xl font-heading-medium text-[#2D2D2D]">{leads.length}</p>
                </div>
                <FileText className="h-8 w-8 text-[#D4AF37]" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-body-regular text-[#666666]">Oczekujące</p>
                  <p className="text-2xl font-heading-medium text-[#2D2D2D]">
                    {leads.filter(lead => lead.status === 'PENDING').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-body-regular text-[#666666]">Przekonwertowane</p>
                  <p className="text-2xl font-heading-medium text-[#2D2D2D]">
                    {leads.filter(lead => lead.status === 'CONVERTED').length}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-body-regular text-[#666666]">Wartość szacowana</p>
                  <p className="text-2xl font-heading-medium text-[#2D2D2D]">
                    {leads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0).toLocaleString('pl-PL')} PLN
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-[#D4AF37]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
                  <input
                    type="text"
                    placeholder="Szukaj leadów..."
                    className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  className="px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">Wszystkie statusy</option>
                  <option value="PENDING">Oczekujące</option>
                  <option value="CONTACTED">Skontaktowane</option>
                  <option value="CONVERTED">Przekonwertowane</option>
                  <option value="REJECTED">Odrzucone</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading-medium text-[#2D2D2D]">
              Lista leadów ({filteredLeads.length})
            </CardTitle>
            <CardDescription className="font-body-regular text-[#666666]">
              Wszystkie leady w systemie partnerskim
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Klient</TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead>Lokalizacja</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Wartość</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div>
                          <p className="font-body-medium text-[#2D2D2D]">
                            {lead.firstName} {lead.lastName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span className="font-body-regular text-[#666666]">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <span className="font-body-regular text-[#666666]">{lead.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="font-body-regular text-[#666666]">{lead.city}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-body-medium text-[#2D2D2D]">
                            {lead.partner.companyName || lead.partner.name || 'Brak nazwy'}
                          </p>
                          <p className="text-sm font-body-regular text-[#666666]">
                            {lead.partner.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(lead.status)}
                      </TableCell>
                      <TableCell>
                        <span className="font-body-medium text-[#2D2D2D]">
                          {lead.estimatedValue ? `${lead.estimatedValue.toLocaleString('pl-PL')} PLN` : 'Brak'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-body-regular text-[#666666]">
                          {new Date(lead.createdAt).toLocaleDateString('pl-PL')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Link href={`/admin/leads/${lead.id}`}>
                            <Eye className="h-3 w-3" />
                            Zobacz
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredLeads.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-[#CCCCCC] mx-auto mb-4" />
                  <p className="font-body-medium text-[#666666]">Brak leadów spełniających kryteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
