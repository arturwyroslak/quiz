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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function LeadHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/partner-program/login");
  }

  // Fetch leads for the current partner
  const leads = await prisma.lead.findMany({
    where: {
      partnerId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      partner: {
        select: {
          name: true
        }
      }
    }
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-heading-bold text-[#2D2D2D] mb-2">Historia zgłoszeń</h1>
            <p className="text-[#666666] font-body-regular">
              Wszystkie Twoje zgłoszenia i ich statusy
            </p>
          </div>
          <Button asChild className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-body-medium">
            <Link href="/partner-program/dashboard/new-lead">
              <Plus className="mr-2 h-4 w-4" />
              Nowe zgłoszenie
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-[#F0F0F0] shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading-medium text-[#2D2D2D]">Twoje leady</CardTitle>
          <CardDescription className="font-body-regular text-[#666666]">
            Przegląd wszystkich zgłoszeń i ich statusów
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#666666] font-body-regular mb-4">
                Nie masz jeszcze żadnych zgłoszeń.
              </p>
              <Button asChild className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-body-medium">
                <Link href="/partner-program/dashboard/new-lead">
                  <Plus className="mr-2 h-4 w-4" />
                  Dodaj pierwsze zgłoszenie
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imię i nazwisko</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data zgłoszenia</TableHead>
                  <TableHead>Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{lead.firstName} {lead.lastName}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          lead.status === 'CONVERTED' ? 'default' : 
                          lead.status === 'PENDING' ? 'secondary' : 
                          'destructive'
                        }
                        className={
                          lead.status === 'CONVERTED' ? 'bg-green-100 text-green-800 border-green-200' : 
                          lead.status === 'PENDING' ? 'bg-orange-100 text-orange-800 border-orange-200' : 
                          'bg-red-100 text-red-800 border-red-200'
                        }
                      >
                        {lead.status === 'CONVERTED' ? 'Przekonwertowany' :
                         lead.status === 'PENDING' ? 'Oczekujący' :
                         lead.status === 'CONTACTED' ? 'Skontaktowany' :
                         'Odrzucony'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-body-medium">
                        <Link href={`/partner-program/dashboard/leads/${lead.id}`}>
                          Szczegóły
                        </Link>
                      </Button>
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