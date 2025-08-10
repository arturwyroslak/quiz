import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

// Sekret do podpisywania tokenów JWT
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_key_change_in_production'
);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generuje unikalny losowy kod polecający
 * @returns Wygenerowany kod polecający (8 znaków alfanumerycznych)
 */
export function generateReferralCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

/**
 * Hashuje hasło używając bcrypt
 * @param password Hasło do zahashowania
 * @returns Zahashowane hasło
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Weryfikuje hasło z jego hashem
 * @param password Hasło do zweryfikowania
 * @param hash Hash hasła
 * @returns True jeśli hasło jest poprawne, false w przeciwnym razie
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (typeof hash !== 'string' || !hash) {
    console.error('verifyPassword: hash is missing or invalid', { passwordType: typeof password, hash });
    throw new Error('Błąd weryfikacji hasła: hash jest nieprawidłowy lub nie został ustawiony. Skontaktuj się z administratorem.');
  }
  return bcrypt.compare(password, hash);
}

/**
 * Generuje token weryfikacyjny
 * @returns Wygenerowany token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Sprawdza, czy adres email ma poprawny format
 * @param email Adres email do sprawdzenia
 * @returns True jeśli email ma poprawny format, false w przeciwnym razie
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formatuje datę do czytelnego formatu
 * @param date Data do sformatowania
 * @returns Sformatowana data
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Formatuje wartość pieniężną
 * @param value Wartość do sformatowania
 * @returns Sformatowana wartość pieniężna
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(value);
}
