import nodemailer from 'nodemailer';
import { createEmailTemplate, createWelcomeEmailContent, createPasswordResetEmailContent, createNewLeadEmailContent, createLeadStatusUpdateEmailContent, createTeamMemberWelcomeEmailContent } from './base-template';

// Konfiguracja transportera SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.artscore.pro',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'support@artscore.pro',
    pass: process.env.SMTP_PASSWORD || '!Sudvid123',
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});

// Interfejs dla opcji emaila
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
  messageId?: string;
  code?: string;
}

/**
 * Wysyła email używając skonfigurowanego transportera SMTP
 * @param options Opcje emaila (odbiorca, temat, treść HTML)
 * @returns Promise z informacją o wysłaniu
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const { to, subject, html, from = process.env.SMTP_FROM_EMAIL || 'support@artscore.pro', text = '' } = options;

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Convert HTML to plain text if text not provided
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send email',
      code: error.code
    };
  }
}

/**
 * Wysyła email powitalny z linkiem do weryfikacji
 * @param email Adres email odbiorcy
 * @param name Nazwa użytkownika
 * @param token Token weryfikacyjny
 */
export async function sendWelcomeEmail(email: string, name: string, token: string): Promise<EmailResult> {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/partner-program/verify?token=${token}`;

  const emailHtml = createEmailTemplate({
    title: 'Witaj w programie partnerskim!',
    preheader: 'Potwierdź swoje konto i rozpocznij zarabianie z ARTSCore',
    content: createWelcomeEmailContent(name, verificationUrl),
    buttonText: 'Potwierdź konto',
    buttonUrl: verificationUrl
  });

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL || 'support@artscore.pro',
    to: email,
    subject: 'Witaj w ARTSCore - Potwierdź swoje konto',
    html: emailHtml,
  };

  try {
    const result = await sendEmail(mailOptions);
    if (!result.success) {
      throw new Error(result.error || 'Failed to send welcome email');
    }
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('Błąd podczas wysyłania emaila weryfikacyjnego:', error);
    return { 
      success: false, 
      error: error.message || 'Nie udało się wysłać emaila weryfikacyjnego'
    };
  }
}

/**
 * Wysyła email z linkiem do resetowania hasła
 * @param to Adres email partnera
 * @param resetToken Token resetowania hasła
 * @returns Promise z informacją o wysłaniu
 */
export async function sendPasswordResetEmail(to: string, resetToken: string): Promise<EmailResult> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/partner-program/reset-password?token=${resetToken}`;
  
  const emailHtml = createEmailTemplate({
    title: 'Resetowanie hasła',
    preheader: 'Zresetuj hasło do swojego konta partnerskiego',
    content: createPasswordResetEmailContent(resetUrl),
    buttonText: 'Resetuj hasło',
    buttonUrl: resetUrl
  });

  return sendEmail({
    to,
    subject: 'ARTSCore - Resetowanie hasła',
    html: emailHtml,
  });
}

/**
 * Wysyła email powitalny do członka zespołu z linkiem do ustawienia hasła
 * @param to Adres email członka zespołu
 * @param name Imię członka zespołu
 * @param setupToken Token do ustawienia hasła
 * @returns Promise z informacją o wysłaniu
 */
export async function sendTeamMemberWelcomeEmail(to: string, name: string, setupToken: string): Promise<EmailResult> {
  const setupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/partner-program/reset-password?token=${setupToken}`;

  const emailHtml = createEmailTemplate({
    title: 'Witaj w zespole ARTSCore!',
    preheader: 'Ustaw hasło do swojego nowego konta',
    content: createTeamMemberWelcomeEmailContent(name, setupUrl),
    buttonText: 'Ustaw hasło',
    buttonUrl: setupUrl
  });

  return sendEmail({
    to,
    subject: 'ARTSCore - Zaproszenie do zespołu i konfiguracja konta',
    html: emailHtml,
  });
}

/**
 * Wysyła powiadomienie o nowym leadzie
 * @param to Adres email partnera
 * @param leadName Nazwa leada
 * @param leadId ID leada
 * @returns Promise z informacją o wysłaniu
 */
export async function sendNewLeadNotification(to: string, leadName: string, leadId: number): Promise<EmailResult> {
  const leadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/partner-program/dashboard/leads/${leadId}`;
  
  const emailHtml = createEmailTemplate({
    title: 'Nowy lead!',
    preheader: `Otrzymałeś nowego leada: ${leadName}`,
    content: createNewLeadEmailContent(leadName, leadId.toString()),
    buttonText: 'Zobacz szczegóły leada',
    buttonUrl: leadUrl
  });

  return sendEmail({
    to,
    subject: 'ARTSCore - Nowy lead w systemie!',
    html: emailHtml,
  });
}

/**
 * Wysyła powiadomienie o aktualizacji statusu leada
 * @param to Adres email partnera
 * @param leadName Nazwa leada
 * @param leadId ID leada
 * @param status Nowy status leada
 * @returns Promise z informacją o wysłaniu
 */
export async function sendLeadStatusUpdateNotification(to: string, leadName: string, leadId: number, status: string): Promise<EmailResult> {
  const leadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/partner-program/dashboard/leads/${leadId}`;
  
  const emailHtml = createEmailTemplate({
    title: 'Aktualizacja statusu leada',
    preheader: `Status leada ${leadName} został zaktualizowany`,
    content: createLeadStatusUpdateEmailContent(leadName, leadId.toString(), status),
    buttonText: 'Zobacz szczegóły leada',
    buttonUrl: leadUrl
  });

  return sendEmail({
    to,
    subject: 'ARTSCore - Aktualizacja statusu leada',
    html: emailHtml,
  });
}
