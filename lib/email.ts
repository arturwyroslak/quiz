import nodemailer from 'nodemailer';
import { logger } from './logger';

// Konfiguracja transportera SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Interfejs dla opcji emaila
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Wysyła email używając skonfigurowanego transportera SMTP
 * @param options Opcje emaila (odbiorca, temat, treść HTML)
 * @returns Promise z informacją o wysłaniu
 */
export async function sendEmail(options: EmailOptions) {
  const { to, subject, html, from = process.env.SMTP_FROM_EMAIL } = options;

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    logger.info('Email sent successfully', {
      messageId: info.messageId,
      to: to,
      subject: subject,
      from: from
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending email', {
      error: error instanceof Error ? error : new Error(String(error)),
      to: to,
      subject: subject,
      from: from
    });
    return { success: false, error };
  }
}

/**
 * Wysyła email powitalny z linkiem do weryfikacji
 * @param email Adres email odbiorcy
 * @param name Nazwa użytkownika
 * @param token Token weryfikacyjny
 */
export async function sendWelcomeEmail(email: string, name: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/partner-program/verify?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject: 'Witaj w ARTSCore - Potwierdź swoje konto',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Witaj ${name}!</h2>
        <p>Dziękujemy za rejestrację w programie partnerskim ARTSCore.</p>
        <p>Aby aktywować swoje konto, kliknij w poniższy link:</p>
        <p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
            Potwierdź konto
          </a>
        </p>
        <p>Jeśli link nie działa, skopiuj i wklej poniższy adres URL do przeglądarki:</p>
        <p>${verificationUrl}</p>
        <p>Link jest ważny przez 24 godziny.</p>
        <p>
          Pozdrawiamy,<br>
          Zespół ARTSCore
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('Welcome email sent successfully', {
      to: email,
      name: name,
      // Don't log the token - it's sensitive
      hasToken: !!token
    });
  } catch (error) {
    logger.error('Error sending welcome email', {
      error: error instanceof Error ? error : new Error(String(error)),
      to: email,
      name: name
    });
    throw new Error('Nie udało się wysłać emaila weryfikacyjnego');
  }
}

/**
 * Wysyła email z linkiem do resetowania hasła
 * @param to Adres email partnera
 * @param resetToken Token resetowania hasła
 * @returns Promise z informacją o wysłaniu
 */
export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/partner-program/reset-password/new?token=${resetToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Resetowanie hasła do Programu Partnerskiego Artscore</h2>
      <p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta w Programie Partnerskim Artscore.</p>
      <p>Aby zresetować hasło, kliknij poniższy link:</p>
      <p><a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Resetuj hasło</a></p>
      <p>Jeśli link nie działa, skopiuj i wklej poniższy adres URL do przeglądarki:</p>
      <p>${resetUrl}</p>
      <p>Link do resetowania hasła wygaśnie po 1 godzinie.</p>
      <p>Jeśli nie prosiłeś o zresetowanie hasła, zignoruj tę wiadomość lub skontaktuj się z nami.</p>
      <p>Pozdrawiamy,<br>Zespół Artscore</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: 'Resetowanie hasła do Programu Partnerskiego Artscore',
    html,
  });
}

/**
 * Wysyła powiadomienie o nowym leadzie
 * @param to Adres email partnera
 * @param leadName Nazwa leada
 * @param leadId ID leada
 * @returns Promise z informacją o wysłaniu
 */
export async function sendNewLeadNotification(to: string, leadName: string, leadId: string) {
  const leadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/partner-program/dashboard/leads/${leadId}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Nowy lead w Programie Partnerskim Artscore</h2>
      <p>Mamy dobrą wiadomość! Twój lead <strong>${leadName}</strong> został dodany do systemu.</p>
      <p>Możesz zobaczyć szczegóły leada klikając poniższy link:</p>
      <p><a href="${leadUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Zobacz szczegóły leada</a></p>
      <p>Będziemy Cię informować o postępach w procesie obsługi tego leada.</p>
      <p>Pozdrawiamy,<br>Zespół Artscore</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: 'Nowy lead w Programie Partnerskim Artscore',
    html,
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
export async function sendLeadStatusUpdateNotification(to: string, leadName: string, leadId: string, status: string) {
  const leadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/partner-program/dashboard/leads/${leadId}`;
  
  let statusText = '';
  switch (status) {
    case 'in_progress':
      statusText = 'W trakcie realizacji';
      break;
    case 'completed':
      statusText = 'Zakończony';
      break;
    case 'rejected':
      statusText = 'Odrzucony';
      break;
    default:
      statusText = status;
  }
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Aktualizacja statusu leada w Programie Partnerskim Artscore</h2>
      <p>Status Twojego leada <strong>${leadName}</strong> został zmieniony na <strong>${statusText}</strong>.</p>
      <p>Możesz zobaczyć szczegóły leada klikając poniższy link:</p>
      <p><a href="${leadUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Zobacz szczegóły leada</a></p>
      <p>W razie pytań, skontaktuj się z nami odpowiadając na tego emaila.</p>
      <p>Pozdrawiamy,<br>Zespół Artscore</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: 'Aktualizacja statusu leada w Programie Partnerskim Artscore',
    html,
  });
}