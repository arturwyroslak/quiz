"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { LeadSubmissionSchema } from "@/lib/schemas";

export default function NewLeadPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    preferences: "",
    consentContact: false,
    consentPromoMaterials: false
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setErrors((prev: any) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    let parsed;
    try {
      parsed = LeadSubmissionSchema.parse(form);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fieldErrors: any = {};
        err.errors.forEach((zodErr: any) => {
          fieldErrors[zodErr.path[0]] = zodErr.message;
        });
        toast("Błąd formularza", {
  description: "Proszę poprawić błędy w formularzu."
});
        setErrors(fieldErrors);
        return;
      }
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/partner/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/partner-program/login';
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        toast("Błąd zgłoszenia", {
  description: data.error || "Nie udało się dodać kontaktu."
});
        if (data.details) {
          const fieldErrors: any = {};
          data.details.forEach((zodErr: any) => {
            fieldErrors[zodErr.path[0]] = zodErr.message;
          });
          setErrors(fieldErrors);
        }
        return;
      }
      toast("Sukces!", {
  description: data.message || "Kontakt został dodany."
});
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        preferences: "",
        consentContact: false,
        consentPromoMaterials: false
      });
    } catch (err) {
      toast("Błąd zgłoszenia", {
  description: "Wystąpił nieoczekiwany błąd."
});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading-bold text-[#2D2D2D] mb-2">Dodaj nowy kontakt</h1>
        <p className="text-[#666666] font-body-regular">
          Zgłoś nowego potencjalnego klienta do ARTSCore. Wypełnij wszystkie wymagane pola.
        </p>
      </div>

      <Card className="border-[#F0F0F0] shadow-sm max-w-4xl">
        <CardHeader>
          <CardTitle className="font-heading-medium text-[#2D2D2D] flex items-center">
            <Plus className="mr-2 h-5 w-5 text-[#D4AF37]" /> 
            Informacje o kliencie
          </CardTitle>
          <CardDescription className="font-body-regular text-[#666666]">
            Wprowadź dane kontaktowe potencjalnego klienta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Imię *</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  placeholder="Wprowadź imię" 
                  value={form.firstName}
                  onChange={handleChange}
                  required 
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Nazwisko *</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  placeholder="Wprowadź nazwisko" 
                  value={form.lastName}
                  onChange={handleChange}
                  required 
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="twoj@email.com" 
                value={form.email}
                onChange={handleChange}
                required 
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input 
                id="phone" 
                name="phone" 
                type="tel" 
                placeholder="+48 123 456 789" 
                value={form.phone}
                onChange={handleChange}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="address">Adres</Label>
              <Input 
                id="address" 
                name="address" 
                placeholder="Wprowadź adres" 
                value={form.address}
                onChange={handleChange}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div>
              <Label htmlFor="preferences">Preferencje klienta</Label>
              <Textarea 
                id="preferences" 
                name="preferences" 
                placeholder="Dodatkowe informacje o kliencie" 
                rows={4} 
                value={form.preferences}
                onChange={handleChange}
                className={errors.preferences ? "border-red-500" : ""}
              />
              {errors.preferences && <p className="text-red-500 text-xs mt-1">{errors.preferences}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consentContact" 
                  name="consentContact" 
                  checked={form.consentContact}
                  onCheckedChange={(checked) => handleChange({ target: { name: "consentContact", type: "checkbox", checked } })}
                  required 
                />
                <Label 
                  htmlFor="consentContact" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Klient wyraził zgodę na kontakt w sprawie oferty ARTSCore *
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consentPromoMaterials" 
                  name="consentPromoMaterials" 
                  checked={form.consentPromoMaterials}
                  onCheckedChange={(checked) => handleChange({ target: { name: "consentPromoMaterials", type: "checkbox", checked } })}
                />
                <Label 
                  htmlFor="consentPromoMaterials" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Klient wyraził zgodę na otrzymanie materiałów promocyjnych
                </Label>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Wysyłanie..." : "Wyślij zgłoszenie"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}