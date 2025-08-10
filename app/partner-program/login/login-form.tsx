"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface FormErrors {
  email?: string;
  password?: string;
  rememberMe?: string;
}

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: "/partner-program/dashboard/new-lead"
      });
      if (res?.ok) {
        toast({
          title: "Zalogowano pomyślnie",
          description: "Witaj w portalu ARTSCORE!",
          variant: "default"
        });
        
        // Wait a moment for session to be established, then redirect
        setTimeout(async () => {
          try {
            const session = await fetch('/api/auth/session').then(r => r.json());
            if (session?.user?.accountType === 'ADMIN') {
              router.push("/admin/dashboard");
            } else {
              router.push("/partner-program/dashboard/new-lead");
            }
          } catch (error) {
            console.error('Error fetching session:', error);
            // Fallback redirect
            router.push("/partner-program/dashboard");
          }
        }, 1000);
      } else {
        toast({
          title: "Błąd logowania",
          description: "Nieprawidłowy email lub hasło",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Email */}
      <div>
        <Label htmlFor="email" className="text-[#2A2A2A] font-body-medium mb-2 block">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`border ${errors.email ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-3 w-full focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors`}
          placeholder="twoj@email.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="password" className="text-[#2A2A2A] font-body-medium">Hasło *</Label>
          <Link 
            href="/partner-program/reset-password" 
            className="text-sm text-[#D4AF37] hover:text-[#B8941F] transition-colors"
          >
            Zapomniałeś hasła?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            className={`border ${errors.password ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-3 w-full pr-12 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors`}
            placeholder="Wprowadź hasło"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#666666] hover:text-[#2A2A2A] transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      {/* Remember Me */}
      <div className="flex items-center space-x-3">
        <Checkbox
          id="rememberMe"
          name="rememberMe"
          checked={formData.rememberMe}
          onCheckedChange={(checked) => setFormData({...formData, rememberMe: !!checked})}
          className="border-[#E8E8E8] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
        />
        <Label 
          htmlFor="rememberMe" 
          className="text-[#2A2A2A] font-body-regular cursor-pointer"
        >
          Zapamiętaj mnie
        </Label>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full bg-[#b38a34] hover:bg-[#9a7429] text-white font-body-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
      </Button>

      <div className="text-center pt-4 border-t border-[#F0F0F0]">
        <p className="text-[#666666] font-body-regular">
          Nie masz jeszcze konta?{' '}
          <Link 
            href="/partner-program/register" 
            className="text-[#D4AF37] hover:text-[#B8941F] font-body-medium transition-colors"
          >
            Zarejestruj się
          </Link>
        </p>
      </div>
    </form>
  );
} 