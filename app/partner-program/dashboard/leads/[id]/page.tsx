import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign,
  User,
  FileText
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function LeadDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/partner-program/login");
  }

  // Fetch lead details with additional information
  const lead = await prisma.lead.findUnique({
    where: {
      id: params.id,
      partnerId: session.user.id
    },
    include: {
      partner: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  if (!lead) {
    redirect("/partner-program/dashboard/leads");
  }

  // Helper function to get status in Polish
  const getStatusInPolish = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Oczekujący';
      case 'CONVERTED':
        return 'Skonwertowany';
      case 'REJECTED':
        return 'Odrzucony';
      case 'IN_PROGRESS':
        return 'W trakcie';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'CONVERTED':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'IN_PROGRESS':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading-bold text-[#2D2D2D] mb-2">
              Szczegóły leada
            </h1>
            <p className="text-[#666666] font-body-regular">
              Pełne informacje o zgłoszeniu klienta
            </p>
          </div>
          <Button variant="outline" asChild className="font-body-medium">
            <Link href="/partner-program/dashboard/leads">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót do leadów
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Basic Info */}
        <div className="lg:col-span-2">
          <Card className="border-[#E5E7EB] shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#b38a34]/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#b38a34]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-heading-semibold text-[#2D2D2D]">
                      {lead.firstName} {lead.lastName}
                    </CardTitle>
                    <CardDescription className="text-[#666666] font-body-regular">
                      Informacje kontaktowe klienta
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant={getStatusVariant(lead.status)}
                  className="font-body-medium"
                >
                  {getStatusInPolish(lead.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-[#F9FAFB] rounded-lg">
                  <Mail className="w-5 h-5 text-[#666666]" />
                  <div>
                    <p className="text-sm font-body-medium text-[#374151]">Email</p>
                    <p className="text-[#2D2D2D] font-body-regular">{lead.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-[#F9FAFB] rounded-lg">
                  <Phone className="w-5 h-5 text-[#666666]" />
                  <div>
                    <p className="text-sm font-body-medium text-[#374151]">Telefon</p>
                    <p className="text-[#2D2D2D] font-body-regular">{lead.phone || 'Nie podano'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-[#F9FAFB] rounded-lg">
                  <Calendar className="w-5 h-5 text-[#666666]" />
                  <div>
                    <p className="text-sm font-body-medium text-[#374151]">Data zgłoszenia</p>
                    <p className="text-[#2D2D2D] font-body-regular">
                      {new Date(lead.createdAt).toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-[#F9FAFB] rounded-lg">
                  <MapPin className="w-5 h-5 text-[#666666]" />
                  <div>
                    <p className="text-sm font-body-medium text-[#374151]">Adres</p>
                    <p className="text-[#2D2D2D] font-body-regular">{lead.address || 'Nie podano'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Sidebar */}
        <div className="space-y-6">
          {/* Commission Info */}
          <Card className="border-[#E5E7EB] shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-heading-semibold text-[#2D2D2D]">
                    Prowizja
                  </CardTitle>
                  <CardDescription className="text-[#666666] font-body-regular">
                    Szacowana wartość
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 bg-[#F9FAFB] rounded-lg">
                <p className="text-2xl font-heading-bold text-[#2D2D2D]">
                  {lead.estimatedValue ? `${lead.estimatedValue} PLN` : 'Nie oszacowano'}
                </p>
                <p className="text-sm text-[#666666] font-body-regular mt-1">
                  Potencjalna prowizja
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Partner Info */}
          <Card className="border-[#E5E7EB] shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#b38a34]/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#b38a34]" />
                </div>
                <div>
                  <CardTitle className="text-lg font-heading-semibold text-[#2D2D2D]">
                    Partner
                  </CardTitle>
                  <CardDescription className="text-[#666666] font-body-regular">
                    Dane partnera
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-body-medium text-[#374151]">Nazwa</p>
                  <p className="text-[#2D2D2D] font-body-regular">{lead.partner.name}</p>
                </div>
                <div>
                  <p className="text-sm font-body-medium text-[#374151]">Email</p>
                  <p className="text-[#2D2D2D] font-body-regular">{lead.partner.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Client Preferences */}
      {lead.preferences && (
        <div className="mt-6">
          <Card className="border-[#E5E7EB] shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-heading-semibold text-[#2D2D2D]">
                    Preferencje klienta
                  </CardTitle>
                  <CardDescription className="text-[#666666] font-body-regular">
                    Dodatkowe informacje od klienta
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-[#F9FAFB] rounded-lg">
                <p className="text-[#2D2D2D] font-body-regular leading-relaxed">
                  {lead.preferences}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}