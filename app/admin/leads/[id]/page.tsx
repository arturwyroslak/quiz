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
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  FileText,
  Save,
  RefreshCw
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
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  partner: {
    id: string;
    name: string | null;
    email: string;
    companyName: string | null;
    phone: string | null;
    address: string | null;
    nip: string | null;
    regon: string | null;
    accountType: string;
  };
}

export default function AdminLeadDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const sessionResult = useSession();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    estimatedValue: '',
    notes: ''
  });
  
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

    fetchLead();
  }, [session, status, router, params.id]);

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/admin/leads/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setLead(data.lead);
        setFormData({
          status: data.lead.status,
          estimatedValue: data.lead.estimatedValue?.toString() || '',
          notes: data.lead.notes || ''
        });
      } else {
        console.error('Failed to fetch lead');
        router.push('/admin/leads');
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
      router.push('/admin/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lead) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/leads/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: formData.status,
          estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : null,
          notes: formData.notes
        }),
      });

      if (response.ok) {
        await fetchLead(); // Refresh data
        setEditMode(false);
        alert('Lead został zaktualizowany pomyślnie!');
      } else {
        console.error('Failed to update lead');
        alert('Błąd podczas aktualizacji leada');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Błąd podczas aktualizacji leada');
    } finally {
      setSaving(false);
    }
  };

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
          <p className="mt-2 font-body-regular text-[#666666]">Ładowanie szczegółów leada...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-[#CCCCCC] mx-auto mb-4" />
          <p className="font-body-medium text-[#666666]">Lead nie został znaleziony</p>
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
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-heading-bold text-[#2D2D2D]">
                {lead.firstName} {lead.lastName}
              </h1>
              {getStatusBadge(lead.status)}
            </div>
            <p className="text-[#666666] font-body-regular">
              Szczegóły leada i informacje o partnerze
            </p>
          </div>
            
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        status: lead.status,
                        estimatedValue: lead.estimatedValue?.toString() || '',
                        notes: lead.notes || ''
                      });
                    }}
                  >
                    Anuluj
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#D4AF37] hover:bg-[#b38a34] text-white"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Zapisywanie...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Zapisz
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setEditMode(true)}
                  className="bg-[#D4AF37] hover:bg-[#b38a34] text-white"
                >
                  Edytuj lead
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Szczegóły leada */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading-medium text-[#2D2D2D] flex items-center gap-2">
                <User className="h-5 w-5" />
                Szczegóły klienta
              </CardTitle>
              <CardDescription>
                Informacje o potencjalnym kliencie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
                <User className="h-5 w-5 text-[#D4AF37]" />
                <div>
                  <p className="font-body-medium text-[#2D2D2D]">Imię i nazwisko</p>
                  <p className="text-sm font-body-regular text-[#666666]">
                    {lead.firstName} {lead.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
                <Mail className="h-5 w-5 text-[#D4AF37]" />
                <div>
                  <p className="font-body-medium text-[#2D2D2D]">E-mail</p>
                  <p className="text-sm font-body-regular text-[#666666]">{lead.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
                <Phone className="h-5 w-5 text-[#D4AF37]" />
                <div>
                  <p className="font-body-medium text-[#2D2D2D]">Telefon</p>
                  <p className="text-sm font-body-regular text-[#666666]">{lead.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
                <MapPin className="h-5 w-5 text-[#D4AF37]" />
                <div>
                  <p className="font-body-medium text-[#2D2D2D]">Miasto</p>
                  <p className="text-sm font-body-regular text-[#666666]">{lead.city}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
                <Calendar className="h-5 w-5 text-[#D4AF37]" />
                <div>
                  <p className="font-body-medium text-[#2D2D2D]">Data utworzenia</p>
                  <p className="text-sm font-body-regular text-[#666666]">
                    {new Date(lead.createdAt).toLocaleDateString('pl-PL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partner Details */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading-medium text-[#2D2D2D] flex items-center gap-2">
                <Building className="h-5 w-5" />
                Szczegóły partnera
              </CardTitle>
              <CardDescription>
                Informacje o partnerze, który dodał lead
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
                <Building className="h-5 w-5 text-[#D4AF37]" />
                <div>
                  <p className="font-body-medium text-[#2D2D2D]">Nazwa</p>
                  <p className="text-sm font-body-regular text-[#666666]">
                    {lead.partner.companyName || lead.partner.name || 'Brak nazwy'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
                <Mail className="h-5 w-5 text-[#D4AF37]" />
                <div>
                  <p className="font-body-medium text-[#2D2D2D]">E-mail</p>
                  <p className="text-sm font-body-regular text-[#666666]">{lead.partner.email}</p>
                </div>
              </div>

              {lead.partner.phone && (
                <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
                  <Phone className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <p className="font-body-medium text-[#2D2D2D]">Telefon</p>
                    <p className="text-sm font-body-regular text-[#666666]">{lead.partner.phone}</p>
                  </div>
                </div>
              )}

              {lead.partner.address && (
                <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
                  <MapPin className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <p className="font-body-medium text-[#2D2D2D]">Adres</p>
                    <p className="text-sm font-body-regular text-[#666666]">{lead.partner.address}</p>
                  </div>
                </div>
              )}

              {lead.partner.nip && (
                <div className="flex items-center gap-3 p-3 border border-[#F0F0F0] rounded-lg">
                  <FileText className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <p className="font-body-medium text-[#2D2D2D]">NIP</p>
                    <p className="text-sm font-body-regular text-[#666666]">{lead.partner.nip}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Zarządzanie leadem */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-heading-medium text-[#2D2D2D] flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Zarządzanie leadem
            </CardTitle>
            <CardDescription>
              Aktualizuj status, wartość i notatki leada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-body-medium text-[#2D2D2D] mb-2">
                  Status leada
                </label>
                {editMode ? (
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="PENDING">Oczekujący</option>
                    <option value="CONTACTED">Skontaktowany</option>
                    <option value="CONVERTED">Przekonwertowany</option>
                    <option value="REJECTED">Odrzucony</option>
                  </select>
                ) : (
                  <div className="p-3 border border-[#F0F0F0] rounded-lg">
                    {getStatusBadge(lead.status)}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-body-medium text-[#2D2D2D] mb-2">
                  Wartość szacowana (PLN)
                </label>
                {editMode ? (
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                ) : (
                  <div className="p-3 border border-[#F0F0F0] rounded-lg">
                    <span className="font-body-medium text-[#2D2D2D]">
                      {lead.estimatedValue ? `${lead.estimatedValue.toLocaleString('pl-PL')} PLN` : 'Brak'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-body-medium text-[#2D2D2D] mb-2">
                Notatki
              </label>
              {editMode ? (
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Dodaj notatki o leadzie..."
                  rows={4}
                  className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
                />
              ) : (
                <div className="p-3 border border-[#F0F0F0] rounded-lg min-h-[100px]">
                  <p className="font-body-regular text-[#666666]">
                    {lead.notes || 'Brak notatek'}
                  </p>
                </div>
              )}
            </div>

            <div className="text-sm text-[#666666]">
              <p>Ostatnia aktualizacja: {new Date(lead.updatedAt).toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
