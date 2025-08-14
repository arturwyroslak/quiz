"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

export function RegistrationForm() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    accountType: 'individual',
    firstName: '',
    lastName: '',
    companyName: '',
    nip: '',
    regon: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    referralCode: '',
    acceptTerms: false,
    acceptPrivacy: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Niepoprawny format adresu email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Hasło musi mieć co najmniej 8 znaków';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są zgodne';
    }

    // Name validation based on account type
    if (formData.accountType === 'individual') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Imię jest wymagane';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Nazwisko jest wymagane';
      }
    } else {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Nazwa firmy jest wymagana';
      }
      // NIP validation for companies (optional but if provided, must be valid)
      if (formData.nip && !/^\d{10}$/.test(formData.nip.replace(/[\s-]/g, ''))) {
        newErrors.nip = 'NIP musi składać się z 10 cyfr';
      }
      // REGON validation for companies (optional but if provided, must be valid)
      if (formData.regon && !/^\d{9}(\d{5})?$/.test(formData.regon.replace(/[\s-]/g, ''))) {
        newErrors.regon = 'REGON musi składać się z 9 lub 14 cyfr';
      }
    }

    // Terms and privacy validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Musisz zaakceptować regulamin';
    }
    if (!formData.acceptPrivacy) {
      newErrors.acceptPrivacy = 'Musisz zaakceptować politykę prywatności';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean form data - remove empty strings for optional fields
      const cleanedData = {
        ...formData,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        companyName: formData.companyName || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        referralCode: formData.referralCode || undefined
      };

      const response = await fetch('/api/partner/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check for duplicate email error (409 Conflict)
        if (response.status === 409) {
          setErrors(prev => ({
            ...prev,
            email: 'Ten adres email jest już zarejestrowany',
          }));
          // Scroll to the email field
          document.getElementById('email')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          throw new Error('Ten adres email jest już zarejestrowany');
        }
        
        // Handle other validation errors
        if (data.field && data.error) {
          setErrors(prev => ({
            ...prev,
            [data.field]: data.error,
          }));
          // Scroll to the first error field
          document.getElementById(data.field)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        throw new Error(data.error || 'Wystąpił błąd podczas rejestracji');
      }

      toast({
        title: "Rejestracja udana",
        description: "Sprawdź swoją skrzynkę email, aby aktywować konto.",
        variant: "default",
      });

      // Redirect to registration success page
      setTimeout(() => {
        window.location.href = '/partner-program/registration-success';
      }, 2000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Wystąpił nieznany błąd';
      
      toast({
        title: "Błąd rejestracji",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Account Type */}
      <div>
        <Label>Typ partnera</Label>
        <RadioGroup 
          defaultValue="individual" 
          value={formData.accountType}
          onValueChange={(value) => setFormData(prev => ({...prev, accountType: value}))}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual">Osoba fizyczna</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="company" id="company" />
            <Label htmlFor="company">Firma</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Name/Company Fields */}
      {formData.accountType === 'individual' ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Imię</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`mt-2 ${errors.firstName ? 'border-red-500' : ''}`}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Nazwisko</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`mt-2 ${errors.lastName ? 'border-red-500' : ''}`}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName">Nazwa firmy</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className={`mt-2 ${errors.companyName ? 'border-red-500' : ''}`}
            />
            {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nip">NIP (opcjonalnie)</Label>
              <Input
                id="nip"
                name="nip"
                value={formData.nip}
                onChange={handleInputChange}
                placeholder="1234567890"
                className={`mt-2 ${errors.nip ? 'border-red-500' : ''}`}
              />
              {errors.nip && <p className="text-red-500 text-xs mt-1">{errors.nip}</p>}
            </div>
            <div>
              <Label htmlFor="regon">REGON (opcjonalnie)</Label>
              <Input
                id="regon"
                name="regon"
                value={formData.regon}
                onChange={handleInputChange}
                placeholder="123456789"
                className={`mt-2 ${errors.regon ? 'border-red-500' : ''}`}
              />
              {errors.regon && <p className="text-red-500 text-xs mt-1">{errors.regon}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Email */}
      <div>
        <Label htmlFor="email">Adres e-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`mt-2 ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">Hasło</Label>
          <div className="relative mt-2">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              className={`${errors.password ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
          <div className="relative mt-2">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Telefon (opcjonalnie)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+48 123 456 789"
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="referralCode">Kod polecający (opcjonalnie)</Label>
          <Input
            id="referralCode"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleInputChange}
            className="mt-2"
          />
        </div>
      </div>

      {/* Consent Checkboxes */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) => setFormData(prev => ({...prev, acceptTerms: !!checked}))}
          />
          <Label 
            htmlFor="acceptTerms" 
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Akceptuję{' '}
            <Link 
              href="/partner-program/terms" 
              target="_blank" 
              className="text-primary hover:underline"
            >
              Regulamin Programu Partnerskiego
            </Link>
          </Label>
        </div>
        {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms}</p>}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="acceptPrivacy"
            name="acceptPrivacy"
            checked={formData.acceptPrivacy}
            onCheckedChange={(checked) => setFormData(prev => ({...prev, acceptPrivacy: !!checked}))}
          />
          <Label 
            htmlFor="acceptPrivacy" 
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Akceptuję{' '}
            <Link 
              href="/partner-program/privacy" 
              target="_blank" 
              className="text-primary hover:underline"
            >
              Politykę Prywatności
            </Link>
          </Label>
        </div>
        {errors.acceptPrivacy && <p className="text-red-500 text-xs">{errors.acceptPrivacy}</p>}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full"
      >
        {isSubmitting ? 'Rejestracja...' : 'Zarejestruj się'}
      </Button>
    </form>
  );
} 