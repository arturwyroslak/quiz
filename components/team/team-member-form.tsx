'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface TeamMemberFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'active' | 'inactive';
}

interface TeamMemberFormProps {
  initialData?: Partial<TeamMemberFormData>;
  editing?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TeamMemberForm({ initialData, editing = false, onSuccess, onCancel }: TeamMemberFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: '',
    email: '',
    phone: '',
    position: '',
    status: 'active',
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        status: 'active',
        ...initialData,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editing && initialData ? `/api/partner/team/${(initialData as any).id}` : '/api/partner/team';
      const method = editing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Sukces",
          description: editing ? "Członek zespołu został zaktualizowany" : "Nowy członek zespołu został dodany",
        });
        onSuccess();
      } else {
        const errorData = await response.json();
        toast({
          title: "Błąd",
          description: errorData.message || "Nie udało się zapisać członka zespołu",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas zapisywania członka zespołu",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Imię i nazwisko</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Telefon (opcjonalnie)</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="position">Stanowisko (opcjonalnie)</Label>
        <Input
          id="position"
          value={formData.position}
          onChange={(e) => setFormData({...formData, position: e.target.value})}
        />
      </div>
      <div className="flex items-center justify-between py-2">
        <Label htmlFor="status" className="font-body-medium text-[#2D2D2D]">
          Aktywne konto
        </Label>
        <Switch
          id="status"
          checked={formData.status === 'active'}
          onCheckedChange={(checked) => setFormData({...formData, status: checked ? 'active' : 'inactive'})}
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 bg-[#D4AF37] hover:bg-[#B8941F] text-white font-body-medium">
          {editing ? 'Zaktualizuj' : 'Dodaj'} członka zespołu
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-body-medium"
          onClick={onCancel}
        >
          Anuluj
        </Button>
      </div>
    </form>
  );
}
