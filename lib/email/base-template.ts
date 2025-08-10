// Bazowy szablon e-maili zgodny ze stylistyką strony programu partnerskiego

export interface EmailTemplateData {
  title: string;
  preheader?: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
}

export const createEmailTemplate = (data: EmailTemplateData): string => {
  const {
    title,
    preheader = '',
    content,
    buttonText,
    buttonUrl,
    footerText = 'Ten email został wysłany automatycznie. Prosimy nie odpowiadać na tę wiadomość.'
  } = data;

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    /* Reset styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #2A2A2A;
      background-color: #FDFDFD;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FDFDFD;
    }
    
    .preheader {
      display: none;
      font-size: 1px;
      color: #FDFDFD;
      line-height: 1px;
      max-height: 0px;
      max-width: 0px;
      opacity: 0;
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #D4AF37 0%, #b38a34 100%);
      padding: 40px 30px;
      text-align: center;
      border-radius: 12px 12px 0 0;
    }
    
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .logo-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      color: white;
    }
    
    .logo-text {
      color: white;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    
    .header h1 {
      color: white;
      font-size: 28px;
      font-weight: 600;
      margin: 0;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .content {
      background: white;
      padding: 40px 30px;
      border-left: 1px solid #F0F0F0;
      border-right: 1px solid #F0F0F0;
    }
    
    .content p {
      margin-bottom: 20px;
      font-size: 16px;
      line-height: 1.6;
      color: #2A2A2A;
    }
    
    .content ul {
      margin: 20px 0;
      padding-left: 20px;
    }
    
    .content li {
      margin-bottom: 8px;
      color: #2A2A2A;
    }
    
    .highlight-box {
      background: linear-gradient(135deg, #FFF9E6 0%, #FFF5D6 100%);
      border: 1px solid #F0E68C;
      border-left: 4px solid #D4AF37;
      padding: 20px;
      margin: 25px 0;
      border-radius: 8px;
    }
    
    .highlight-box h3 {
      color: #b38a34;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    
    .highlight-box p {
      margin-bottom: 10px;
      color: #2A2A2A;
    }
    
    .highlight-box code {
      background: rgba(212, 175, 55, 0.1);
      padding: 4px 8px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      color: #b38a34;
      font-weight: 600;
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #D4AF37 0%, #b38a34 100%);
      color: white;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 25px 0;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
      transition: all 0.3s ease;
      text-align: center;
      min-width: 200px;
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
    }
    
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    
    .footer {
      background: #F8F8F8;
      padding: 30px;
      text-align: center;
      border-radius: 0 0 12px 12px;
      border: 1px solid #F0F0F0;
      border-top: none;
    }
    
    .footer p {
      color: #666666;
      font-size: 14px;
      margin-bottom: 10px;
    }
    
    .footer .company-info {
      color: #2A2A2A;
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, #F0F0F0 50%, transparent 100%);
      margin: 30px 0;
    }
    
    /* Responsive styles */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      
      .header,
      .content,
      .footer {
        padding: 25px 20px !important;
      }
      
      .header h1 {
        font-size: 24px !important;
      }
      
      .logo-text {
        font-size: 20px !important;
      }
      
      .button {
        padding: 14px 24px !important;
        font-size: 14px !important;
        min-width: 180px !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    ${preheader ? `<div class="preheader">${preheader}</div>` : ''}
    
    <div class="header">
      <div class="logo">
        <div class="logo-icon">A</div>
        <div class="logo-text">ARTSCore</div>
      </div>
      <h1>${title}</h1>
    </div>
    
    <div class="content">
      ${content}
      
      ${buttonText && buttonUrl ? `
        <div class="button-container">
          <a href="${buttonUrl}" class="button">${buttonText}</a>
        </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <p class="company-info">© ${new Date().getFullYear()} ARTSCore</p>
      <p>Program Partnerski - Rozwijaj swój biznes z nami</p>
      <div class="divider"></div>
      <p>${footerText}</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Funkcje pomocnicze do tworzenia konkretnych typów e-maili
export const createWelcomeEmailContent = (name: string, verificationUrl: string): string => {
  return `
    <p>Witaj <strong>${name}</strong>!</p>
    
    <p>Dziękujemy za dołączenie do programu partnerskiego ARTSCore. Jesteśmy podekscytowani, że będziesz częścią naszej społeczności partnerów!</p>
    
    <div class="highlight-box">
      <h3>🎉 Witamy w zespole!</h3>
      <p>Twoje konto zostało utworzone i czeka na aktywację. Aby rozpocząć korzystanie z platformy, potwierdź swój adres email klikając przycisk poniżej.</p>
    </div>
    
    <p><strong>Co możesz zrobić po aktywacji konta:</strong></p>
    <ul>
      <li>Dodawać nowych klientów i śledzić ich status</li>
      <li>Generować raporty sprzedażowe</li>
      <li>Zarządzać swoim zespołem (dla kont firmowych)</li>
      <li>Otrzymywać prowizje od udanych transakcji</li>
    </ul>
    
    <p>Link aktywacyjny jest ważny przez <strong>24 godziny</strong>. Jeśli przycisk nie działa, skopiuj i wklej poniższy adres do przeglądarki:</p>
    <p style="word-break: break-all; color: #666666; font-size: 14px;">${verificationUrl}</p>
    
    <p>Masz pytania? Nasz zespół wsparcia jest zawsze gotowy do pomocy!</p>
    
    <p>Pozdrawiamy,<br><strong>Zespół ARTSCore</strong></p>
  `;
};

export const createTeamMemberWelcomeEmailContent = (name: string, setupUrl: string): string => {
  return `
    <p>Witaj <strong>${name}</strong>!</p>

    <p>Zostałeś dodany jako członek zespołu w programie partnerskim ARTSCore. Aby aktywować swoje konto i uzyskać dostęp do panelu, musisz najpierw ustawić swoje hasło.</p>

    <div class="highlight-box">
      <h3>🔑 Ustaw swoje hasło</h3>
      <p>Kliknij przycisk poniżej, aby ustawić hasło dla swojego konta. Link jest ważny przez <strong>24 godziny</strong>.</p>
    </div>

    <p>Jeśli nie spodziewałeś się tej wiadomości, możesz ją zignorować.</p>

    <p>Link do ustawienia hasła (jeśli przycisk nie działa):</p>
    <p style="word-break: break-all; color: #666666; font-size: 14px;">${setupUrl}</p>

    <p>Po ustawieniu hasła będziesz mógł zalogować się do swojego panelu i rozpocząć dodawanie nowych leadów.</p>

    <p>Pozdrawiamy,<br><strong>Zespół ARTSCore</strong></p>
  `;
};

export const createPasswordResetEmailContent = (resetUrl: string): string => {
  return `
    <p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta w programie partnerskim ARTSCore.</p>
    
    <div class="highlight-box">
      <h3>🔐 Resetowanie hasła</h3>
      <p>Aby ustawić nowe hasło, kliknij przycisk poniżej. Link jest ważny przez <strong>1 godzinę</strong>.</p>
    </div>
    
    <p>Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość. Twoje konto pozostanie bezpieczne.</p>
    
    <p>Link resetowania (jeśli przycisk nie działa):</p>
    <p style="word-break: break-all; color: #666666; font-size: 14px;">${resetUrl}</p>
    
    <p><strong>Wskazówki bezpieczeństwa:</strong></p>
    <ul>
      <li>Używaj silnego hasła (min. 8 znaków)</li>
      <li>Nie udostępniaj hasła nikomu</li>
      <li>Regularnie zmieniaj hasło</li>
    </ul>
    
    <p>Pozdrawiamy,<br><strong>Zespół ARTSCore</strong></p>
  `;
};

export const createNewLeadEmailContent = (leadName: string, leadId: string): string => {
  return `
    <p>Mamy świetne wiadomości! Otrzymałeś nowego leada w systemie partnerskim ARTSCore.</p>
    
    <div class="highlight-box">
      <h3>🎯 Nowy lead</h3>
      <p><strong>Klient:</strong> ${leadName}</p>
      <p><strong>ID zgłoszenia:</strong> <code>#${leadId}</code></p>
      <p><strong>Status:</strong> Oczekuje na kontakt</p>
    </div>
    
    <p><strong>Następne kroki:</strong></p>
    <ul>
      <li>Skontaktuj się z klientem w ciągu 24 godzin</li>
      <li>Zaktualizuj status leada w systemie</li>
      <li>Dodaj notatki z rozmowy</li>
    </ul>
    
    <p>Pamiętaj: Szybka reakcja zwiększa szanse na konwersję!</p>
    
    <p>Powodzenia,<br><strong>Zespół ARTSCore</strong></p>
  `;
};

export const createLeadStatusUpdateEmailContent = (leadName: string, leadId: string, status: string): string => {
  const statusMap: Record<string, { label: string; emoji: string; color: string }> = {
    'CONTACTED': { label: 'Skontaktowany', emoji: '📞', color: '#3B82F6' },
    'CONVERTED': { label: 'Skonwertowany', emoji: '✅', color: '#10B981' },
    'REJECTED': { label: 'Odrzucony', emoji: '❌', color: '#EF4444' },
    'PENDING': { label: 'Oczekuje', emoji: '⏳', color: '#F59E0B' }
  };

  const statusInfo = statusMap[status] || { label: status, emoji: '📋', color: '#6B7280' };

  return `
    <p>Status Twojego leada został zaktualizowany w systemie partnerskim ARTSCore.</p>
    
    <div class="highlight-box">
      <h3>${statusInfo.emoji} Aktualizacja statusu</h3>
      <p><strong>Klient:</strong> ${leadName}</p>
      <p><strong>ID zgłoszenia:</strong> <code>#${leadId}</code></p>
      <p><strong>Nowy status:</strong> <span style="color: ${statusInfo.color}; font-weight: 600;">${statusInfo.label}</span></p>
    </div>
    
    ${status === 'CONVERTED' ? `
      <p>🎉 <strong>Gratulacje!</strong> Twój lead został skonwertowany. Prowizja zostanie naliczona zgodnie z regulaminem programu partnerskiego.</p>
    ` : status === 'REJECTED' ? `
      <p>Niestety, ten lead nie został skonwertowany. Nie martw się - to część procesu sprzedażowego. Analizuj i ucz się z każdego doświadczenia!</p>
    ` : `
      <p>Śledź dalszy postęp tego leada w swoim panelu partnerskim.</p>
    `}
    
    <p>Pozdrawiamy,<br><strong>Zespół ARTSCore</strong></p>
  `;
};
