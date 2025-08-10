import { z } from "zod";

// Base schemas for reuse
export const emailSchema = z.string().email({ message: "Wprowadź poprawny adres e-mail" });
export const phoneSchema = z.string()
  .regex(/^\+?[0-9]{9,15}$/, { message: "Wprowadź poprawny numer telefonu" })
  .optional();
export const nameSchema = z.string().min(2, { message: "Imię jest wymagane" });
export const passwordSchema = z.string().min(8, { message: "Hasło musi mieć co najmniej 8 znaków" });

// Lead submission schema
export const LeadSubmissionSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().max(255, { message: "Adres nie może przekraczać 255 znaków" }).optional(),
  preferences: z.string().max(500, { message: "Opis preferencji nie może przekraczać 500 znaków" }).optional(),
  consentContact: z.boolean().refine(val => val === true, { 
    message: "Musisz wyrazić zgodę na kontakt" 
  }),
  consentPromoMaterials: z.boolean().optional()
});

// Registration schema
export const RegistrationSchema = z.object({
  accountType: z.enum(['individual', 'company'], { message: "Nieprawidłowy typ konta" }),
  firstName: z.string().min(2, { message: "Imię jest wymagane" }).optional(),
  lastName: z.string().min(2, { message: "Nazwisko jest wymagane" }).optional(),
  companyName: z.string().optional(),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  address: z.string().max(255, { message: "Adres nie może przekraczać 255 znaków" }).optional(),
  referralCode: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, { 
    message: "Musisz zaakceptować regulamin" 
  }),
  acceptPrivacy: z.boolean().refine(val => val === true, { 
    message: "Musisz zaakceptować politykę prywatności" 
  })
}).refine(data => {
  if (data.accountType === 'individual') {
    return data.firstName && data.lastName;
  } else if (data.accountType === 'company') {
    return data.companyName;
  }
  return false;
}, {
  message: "Wymagane pola zależne od typu konta",
  path: ['accountType']
});

// Report generation schema
export const ReportGenerationSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Nieprawidłowy format daty" }),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Nieprawidłowy format daty" }),
  reportType: z.enum(['leads', 'commissions', 'combined'], { message: "Nieprawidłowy typ raportu" })
}).refine(data => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return startDate <= endDate;
}, {
  message: "Data początkowa musi być wcześniejsza niż data końcowa",
  path: ['endDate']
});

// Login schema
export const LoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Hasło jest wymagane" })
});

// Password reset schema
export const PasswordResetSchema = z.object({
  email: emailSchema
});

// Team member schema
export const TeamMemberSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  role: z.string().min(1, { message: "Rola jest wymagana" }),
  permissions: z.array(z.string()).optional()
});

// Task schema
export const TaskSchema = z.object({
  title: z.string().min(1, { message: "Tytuł jest wymagany" }),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], { message: "Nieprawidłowy priorytet" }),
  dueDate: z.string().datetime().optional(),
  assigneeId: z.string().optional()
});

// Common error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.any().optional(),
  timestamp: z.string().datetime().optional()
});

// Success response schema
export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional()
});

// Type exports for TypeScript
export type LeadSubmissionData = z.infer<typeof LeadSubmissionSchema>;
export type RegistrationData = z.infer<typeof RegistrationSchema>;
export type ReportGenerationData = z.infer<typeof ReportGenerationSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type PasswordResetData = z.infer<typeof PasswordResetSchema>;
export type TeamMemberData = z.infer<typeof TeamMemberSchema>;
export type TaskData = z.infer<typeof TaskSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
