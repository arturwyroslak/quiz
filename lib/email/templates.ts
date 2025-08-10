// Email templates for the application

export const welcomeEmailTemplate = (name: string, email: string, tempPassword: string) => {
  return {
    subject: 'Witamy w ARTSCore - Twoje dane dostępu',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #D4AF37, #B8941F); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37; }
          .button { display: inline-block; background: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Witamy w ARTSCore!</h1>
            <p>Twoje konto zostało utworzone przez administratora</p>
          </div>
          
          <div class="content">
            <p>Cześć ${name},</p>
            
            <p>Twoje konto w systemie partnerskim ARTSCore zostało pomyślnie utworzone przez administratora. Poniżej znajdziesz dane dostępu do Twojego konta:</p>
            
            <div class="credentials">
              <h3>Dane dostępu:</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Tymczasowe hasło:</strong> <code>${tempPassword}</code></p>
            </div>
            
            <p><strong>Ważne:</strong> Ze względów bezpieczeństwa, zalecamy zmianę hasła po pierwszym logowaniu.</p>
            
            <a href="${process.env.NEXTAUTH_URL}/partner-program/login" class="button">Zaloguj się teraz</a>
            
            <h3>Co dalej?</h3>
            <ul>
              <li>Zaloguj się używając powyższych danych</li>
              <li>Uzupełnij swój profil</li>
              <li>Zacznij dodawać leady i rozwijać swój biznes</li>
            </ul>
            
            <p>Jeśli masz jakiekolwiek pytania, skontaktuj się z naszym zespołem wsparcia.</p>
            
            <p>Pozdrawiamy,<br>Zespół ARTSCore</p>
          </div>
          
          <div class="footer">
            <p>© 2024 ARTSCore. Wszystkie prawa zastrzeżone.</p>
            <p>Ten email został wysłany automatycznie. Prosimy nie odpowiadać na tę wiadomość.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Witamy w ARTSCore!

Cześć ${name},

Twoje konto w systemie partnerskim ARTSCore zostało pomyślnie utworzone przez administratora.

Dane dostępu:
Email: ${email}
Tymczasowe hasło: ${tempPassword}

Ze względów bezpieczeństwa, zalecamy zmianę hasła po pierwszym logowaniu.

Zaloguj się: ${process.env.NEXTAUTH_URL}/partner-program/login

Co dalej?
- Zaloguj się używając powyższych danych
- Uzupełnij swój profil
- Zacznij dodawać leady i rozwijać swój biznes

Jeśli masz jakiekolwiek pytania, skontaktuj się z naszym zespołem wsparcia.

Pozdrawiamy,
Zespół ARTSCore
    `
  };
};
