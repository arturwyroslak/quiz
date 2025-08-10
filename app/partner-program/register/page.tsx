'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AnimatedElement } from '@/components/animations/animated-element';
import { fadeIn, fadeInUp } from '@/components/animations/animation-variants';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  referralCode: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function RegisterPage() {
  const { toast } = useToast();
  const [accountType, setAccountType] = useState('individual');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    referralCode: '',
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name as keyof FormErrors]: undefined });
    }
  };

  const handleCheckboxChange = (name: 'acceptTerms' | 'acceptPrivacy', checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (accountType === 'individual') {
      if (!formData.firstName.trim()) newErrors.firstName = 'Imię jest wymagane';
      if (!formData.lastName.trim()) newErrors.lastName = 'Nazwisko jest wymagane';
    } else {
      if (!formData.companyName.trim()) newErrors.companyName = 'Nazwa firmy jest wymagana';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Niepoprawny format adresu email';
    }

    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Hasło musi mieć co najmniej 8 znaków';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Numer telefonu jest wymagany';
    } else if (!/^[0-9+\s-]{9,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Niepoprawny format numeru telefonu';
    }

    if (accountType === 'company' && !formData.address.trim()) {
      newErrors.address = 'Adres jest wymagany dla firm';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Musisz zaakceptować regulamin';
    }

    if (!formData.acceptPrivacy) {
      newErrors.acceptPrivacy = 'Musisz zaakceptować politykę prywatności';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/partner/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountType, ...formData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Wystąpił błąd podczas rejestracji');
      }

      toast({
        title: 'Rejestracja udana!',
        description: 'Witaj w programie partnerskim ARTSCore!',
      });

      setTimeout(() => {
        window.location.href = '/partner-program/registration-success';
      }, 1500);

    } catch (error: any) {
      toast({
        title: 'Błąd rejestracji',
        description: error?.message || 'Wystąpił nieoczekiwany błąd.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-body-regular text-[#2A2A2A]">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-[#F0F0F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center">
              <div className="w-8 lg:w-10 h-8 lg:h-10 flex items-center justify-center">
                <Image
                  src="/images/arts-logo.png"
                  alt="ARTSCore Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="ml-2">
                <h1 className="text-xl lg:text-2xl uppercase text-[#2A2A2A] font-body-semibold">
                  ARTSCORE
                </h1>
              </div>
            </Link>
            <Link href="/partner-program" className="flex items-center text-sm text-[#666666] hover:text-[#b38a34] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do strony programu
            </Link>
          </div>
        </div>
      </header>

      <main className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <AnimatedElement variants={fadeInUp} className="text-center mb-12">
            <h1 className="font-display-bold text-4xl sm:text-5xl text-[#2A2A2A] mb-4">Dołącz do Programu Partnerskiego</h1>
            <p className="text-lg text-[#666666]">Zacznij zarabiać, polecając nasze innowacyjne rozwiązania.</p>
          </AnimatedElement>

          <AnimatedElement variants={fadeIn} className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg border border-[#F0F0F0]">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-8">
                <Label className="text-[#2A2A2A] font-body-medium mb-3 block">Typ konta *</Label>
                <RadioGroup defaultValue="individual" onValueChange={setAccountType} className="flex space-x-6">
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

              {accountType === 'individual' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="firstName" className="text-[#2A2A2A] font-body-medium mb-2 block">Imię *</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`border ${errors.firstName ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-2 w-full`} />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-[#2A2A2A] font-body-medium mb-2 block">Nazwisko *</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`border ${errors.lastName ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-2 w-full`} />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <Label htmlFor="companyName" className="text-[#2A2A2A] font-body-medium mb-2 block">Nazwa firmy *</Label>
                  <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} className={`border ${errors.companyName ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-2 w-full`} />
                  {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                </div>
              )}

              <div className="mb-6">
                <Label htmlFor="email" className="text-[#2A2A2A] font-body-medium mb-2 block">Adres email *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className={`border ${errors.email ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-2 w-full`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="mb-6">
                <Label htmlFor="password" className="text-[#2A2A2A] font-body-medium mb-2 block">Hasło *</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange} className={`border ${errors.password ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-2 w-full pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="mb-6">
                <Label htmlFor="confirmPassword" className="text-[#2A2A2A] font-body-medium mb-2 block">Potwierdź hasło *</Label>
                <div className="relative">
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChange} className={`border ${errors.confirmPassword ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-2 w-full pr-10`} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="mb-6">
                <Label htmlFor="phone" className="text-[#2A2A2A] font-body-medium mb-2 block">Numer telefonu *</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className={`border ${errors.phone ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-2 w-full`} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className={`mb-6 ${accountType === 'company' ? 'block' : 'hidden'}`}>
                <Label htmlFor="address" className="text-[#2A2A2A] font-body-medium mb-2 block">Adres firmy *</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} className={`border ${errors.address ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-2 w-full`} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="mb-6">
                <Label htmlFor="referralCode" className="text-[#2A2A2A] font-body-medium mb-2 block">Kod polecający (opcjonalnie)</Label>
                <Input id="referralCode" name="referralCode" value={formData.referralCode} onChange={handleInputChange} className={`border ${errors.referralCode ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-2 w-full`} placeholder="Wpisz kod polecający, jeśli posiadasz" />
                {errors.referralCode && <p className="text-red-500 text-xs mt-1">{errors.referralCode}</p>}
                <p className="text-xs text-[#666666] mt-1">Jeśli zostałeś polecony przez istniejącego partnera, wpisz jego kod polecający.</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Checkbox id="acceptTerms" name="acceptTerms" checked={formData.acceptTerms} onCheckedChange={(checked: boolean) => handleCheckboxChange('acceptTerms', checked)} className="mt-1" />
                  <Label htmlFor="acceptTerms" className="ml-2 text-sm text-[#666666]">
                    Akceptuję <Link href="/partner-program/terms" className="text-[#b38a34] hover:underline">Regulamin Programu Partnerskiego</Link> i <Link href="/partner-program/cookies" className="text-[#b38a34] hover:underline">Politykę Cookies</Link> *
                  </Label>
                </div>
                {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms}</p>}

                <div className="flex items-start">
                  <Checkbox id="acceptPrivacy" name="acceptPrivacy" checked={formData.acceptPrivacy} onCheckedChange={(checked: boolean) => handleCheckboxChange('acceptPrivacy', checked)} className="mt-1" />
                  <Label htmlFor="acceptPrivacy" className="ml-2 text-sm text-[#666666]">
                    Zapoznałem się z <Link href="/partner-program/privacy" className="text-[#b38a34] hover:underline">Polityką Prywatności</Link> *
                  </Label>
                </div>
                {errors.acceptPrivacy && <p className="text-red-500 text-xs">{errors.acceptPrivacy}</p>}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#b38a34] to-[#9a7529] hover:from-[#9a7529] hover:to-[#81621e] text-white py-3 rounded-xl font-body-semibold transition-all duration-300 hover:shadow-lg">
                {isSubmitting ? 'Przetwarzanie...' : 'Zarejestruj się'}
              </Button>

              <div className="text-center mt-6">
                <p className="text-sm text-[#666666]">
                  Masz już konto?{' '}
                  <Link href="/partner-program/login" className="text-[#b38a34] hover:underline font-body-medium">Zaloguj się</Link>
                </p>
              </div>
            </form>
          </AnimatedElement>
        </div>
      </main>

      <footer className="bg-white border-t border-[#F0F0F0] py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-[#666666]">
          &copy; {new Date().getFullYear()} ARTSCore. Wszelkie prawa zastrzeżone.
        </div>
      </footer>
    </div>
  );
}