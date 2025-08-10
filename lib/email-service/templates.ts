import Mailgen from 'mailgen';

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'pl'];

// Template definitions
const templates: Record<string, any> = {
  'welcome': {
    en: {
      subject: 'Welcome to ARTSCore',
      body: `
        <p>Hello {{name}},</p>
        <p>Welcome to ARTSCore. Please confirm your account using the link below:</p>
        <p><a href="{{verificationUrl}}">Confirm Account</a></p>
      `,
      text: `Hello {{name}},\nWelcome to ARTSCore. Please confirm your account using the link below:\n{{verificationUrl}}`
    },
    pl: {
      subject: 'Witaj w ARTSCore',
      body: `
        <p>Witaj {{name}},</p>
        <p>Dziękujemy za rejestrację w ARTSCore. Proszę potwierdzić swoje konto, korzystając z poniższego linku:</p>
        <p><a href="{{verificationUrl}}">Potwierdź konto</a></p>
      `,
      text: `Witaj {{name}},\nDziękujemy za rejestrację w ARTSCore. Proszę potwierdzić swoje konto, korzystając z poniższego linku:\n{{verificationUrl}}`
    }
  }
};

export class EmailTemplateEngine {
  private mailGenerator: Mailgen;

  constructor() {
    this.mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'ARTSCore',
        link: 'https://artscore.pro'
      }
    });
  }

  /**
   * Renders an email template with the provided data
   */
  async render(templateName: string, data: Record<string, any>, language = 'en') {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      throw new Error(`Language not supported: ${language}`);
    }

    const template = templates[templateName];
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }

    const { subject, body, text } = template[language];
    const renderedHtml = this.interpolate(body, data);
    const renderedText = this.interpolate(text, data);

    return {
      subject: this.interpolate(subject, data),
      html: renderedHtml,
      text: renderedText
    };
  }

  /**
   * Interpolates variables into the template string
   */
  private interpolate(template: string, variables: Record<string, any>): string {
    return template.replace(/{{(\w+)}}/g, (match, key) => {
      return variables[key] || match;
    });
  }
}
