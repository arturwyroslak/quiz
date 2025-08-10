"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { TeamMemberForm } from "@/components/team/team-member-form";
import { Plus, Edit, Trash2, Mail, Phone } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function TeamManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/partner/team');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.teamMembers || []);
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać listy członków zespołu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (memberId: string) => {
    try {
      const response = await fetch(`/api/partner/team/${memberId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Sukces",
          description: "Członek zespołu został usunięty",
          variant: "default"
        });
        fetchTeamMembers();
      } else {
        const errorData = await response.json();
        toast({
          title: "Błąd",
          description: errorData.message || "Nie udało się usunąć członka zespołu",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas usuwania członka zespołu",
        variant: "destructive"
      });
    }
  };

  const handleSuccess = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingMember(null);
    fetchTeamMembers();
  };

  const handleCancel = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingMember(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-heading-bold text-[#2D2D2D] mb-2">Zarządzanie zespołem</h1>
          <p className="text-[#666666] font-body-regular">Dodawaj i zarządzaj członkami swojego zespołu</p>
        </div>
        <Card className="border-[#F0F0F0] shadow-sm">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-heading-bold text-[#2D2D2D] mb-2">Zarządzanie zespołem</h1>
            <p className="text-[#666666] font-body-regular">
              Dodawaj i zarządzaj członkami swojego zespołu
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-body-medium">
                <Plus className="mr-2 h-4 w-4" />
                Dodaj członka zespołu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj nowego członka zespołu</DialogTitle>
              </DialogHeader>
              <TeamMemberForm onSuccess={handleSuccess} onCancel={handleCancel} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-[#F0F0F0] shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading-medium text-[#2D2D2D]">Lista członków zespołu</CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#666666] font-body-regular mb-4">
                Nie masz jeszcze żadnych członków zespołu.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-body-medium">
                <Plus className="mr-2 h-4 w-4" />
                Dodaj pierwszego członka
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imię i nazwisko</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Stanowisko</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {member.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {member.phone}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {member.position || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={member.isActive ? "default" : "secondary"}
                        className={member.isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}
                      >
                        {member.isActive ? "Aktywny" : "Nieaktywny"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(member)}
                          className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Czy na pewno chcesz usunąć tego członka zespołu?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Ta akcja nie może zostać cofnięta. Członek zespołu {member.name} zostanie trwale usunięty.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Anuluj</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(member.id)}>
                                Usuń
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj członka zespołu</DialogTitle>
          </DialogHeader>
          <TeamMemberForm
            editing
            initialData={{
              ...editingMember,
              status: editingMember?.isActive ? 'active' : 'inactive',
            }}
            onSuccess={handleSuccess}
            onCancel={handleCancel} />
        </DialogContent>
      </Dialog>
    </div>
  );
}