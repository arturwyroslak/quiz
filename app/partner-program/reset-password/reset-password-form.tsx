"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AnimatedElement } from '@/components/animations/animated-element';
import { fadeIn, fadeInUp } from '@/components/animations/animation-variants';

export default function ResetPasswordForm() {
  const { toast } = useToast();
  const [stage, setStage] = useState<'request' | 'reset'>('request');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    resetToken: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setStage('reset');
      setFormData((prev) => ({ ...prev, resetToken: token }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEmailRequest = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Niepoprawny format adresu email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordReset = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Hasło musi mieć co najmniej 8 znaków';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są zgodne';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmailRequest()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/partner/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas wysyłania linku resetującego');
      }

      toast({
        title: "Link resetujący wysłany",
        description: "Sprawdź swoją skrzynkę email.",
        variant: "default",
      });

      // Optionally, you could set a timer to reset submitting state
      setTimeout(() => {
        setIsSubmitting(false);
      }, 3000);

    } catch (error) {
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : 'Wystąpił błąd podczas wysyłania linku resetującego',
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordReset()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/partner/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.password,
          resetPasswordToken: formData.resetToken
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas resetowania hasła');
      }

      toast({
        title: "Hasło zostało zresetowane",
        description: "Możesz teraz zalogować się nowym hasłem.",
        variant: "default",
      });

      // Redirect to login page after successful reset
      setTimeout(() => {
        window.location.href = '/partner-program/login';
      }, 2000);

    } catch (error) {
      toast({
        title: "Błąd resetowania hasła",
        description: error instanceof Error ? error.message : 'Wystąpił błąd podczas resetowania hasła',
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatedElement variants={fadeInUp} className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#b38a34]/10 rounded-full flex items-center justify-center">
            {stage === 'request' ? (
              <Mail className="w-12 h-12 text-[#b38a34]" />
            ) : (
              <Lock className="w-12 h-12 text-[#b38a34]" />
            )}
          </div>
        </div>
        <h1 className="font-display-bold text-4xl sm:text-5xl text-[#2A2A2A] mb-4">
          {stage === 'request' ? 'Resetowanie hasła' : 'Ustaw nowe hasło'}
        </h1>
        <p className="text-lg text-[#666666]">
          {stage === 'request'
            ? 'Podaj e-mail, aby otrzymać link do zmiany hasła.'
            : 'Wprowadź swoje nowe, bezpieczne hasło.'
          }
        </p>
      </AnimatedElement>

      <AnimatedElement variants={fadeIn} className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg border border-[#F0F0F0]">
        {stage === 'request' ? (
          <form onSubmit={handleEmailRequest} className="space-y-6">
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#b38a34] hover:bg-[#9a7429] text-white font-body-semibold py-3 rounded-xl transition-all duration-200"
            >
              {isSubmitting ? 'Wysyłanie...' : 'Wyślij link'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-6">
             <div>
              <Label htmlFor="password">Nowe hasło</Label>
              <div className="relative mt-2">
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

            <div>
              <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
              <div className="relative mt-2">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`border ${errors.confirmPassword ? 'border-red-500' : 'border-[#E8E8E8]'} rounded-lg p-3 w-full pr-12 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors`}
                  placeholder="Potwierdź hasło"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#666666] hover:text-[#2A2A2A] transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#b38a34] hover:bg-[#9a7429] text-white font-body-semibold py-3 rounded-xl transition-all duration-200"
            >
              {isSubmitting ? 'Zmienianie hasła...' : 'Ustaw nowe hasło'}
            </Button>
          </form>
        )}
         <div className="text-center pt-4 border-t border-[#F0F0F0] mt-6">
          <p className="text-[#666666] font-body-regular">
            Pamiętasz hasło?{' '}
            <Link
              href="/partner-program/login"
              className="text-[#D4AF37] hover:text-[#B8941F] font-body-medium transition-colors"
            >
              Zaloguj się
            </Link>
          </p>
        </div>
      </AnimatedElement>
    </>
  );
}
