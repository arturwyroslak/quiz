import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { logger } from '../logger';
import { EmailQueue } from './queue';
import { EmailTemplateEngine } from './templates';
import { RetryManager } from './retry-manager';
import { SPFDKIMValidator } from './spf-dkim-validator';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  template?: string;
  templateData?: Record<string, any>;
  language?: 'pl' | 'en';
  priority?: 'high' | 'normal' | 'low';
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailProviderConfig {
  provider: 'smtp' | 'sendgrid' | 'ses';
  config: SMTPConfig | SendGridConfig | SESConfig;
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass?: string;
    accessToken?: string;
    refreshToken?: string;
    clientId?: string;
    clientSecret?: string;
  };
  oauth2?: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    accessToken?: string;
  };
}

export interface SendGridConfig {
  apiKey: string;
}

export interface SESConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: Error;
  provider?: string;
  attempt?: number;
  retries?: number;
}

export class EmailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;
  private queue: EmailQueue;
  private templateEngine: EmailTemplateEngine;
  private retryManager: RetryManager;
  private spfDkimValidator: SPFDKIMValidator;
  private config: EmailProviderConfig;

  constructor(config: EmailProviderConfig) {
    this.config = config;
    this.queue = new EmailQueue();
    this.templateEngine = new EmailTemplateEngine();
    this.retryManager = new RetryManager();
    this.spfDkimValidator = new SPFDKIMValidator();
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      switch (this.config.provider) {
        case 'smtp':
          this.transporter = this.createSMTPTransporter(this.config.config as SMTPConfig);
          break;
        case 'sendgrid':
          this.transporter = this.createSendGridTransporter(this.config.config as SendGridConfig);
          break;
        case 'ses':
          this.transporter = this.createSESTransporter(this.config.config as SESConfig);
          break;
        default:
          throw new Error(`Unsupported email provider: ${this.config.provider}`);
      }

      logger.info('Email service initialized', {
        provider: this.config.provider,
        host: this.config.provider === 'smtp' ? (this.config.config as SMTPConfig).host : undefined
      });
    } catch (error) {
      logger.error('Failed to initialize email service', {
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.config.provider
      });
      throw error;
    }
  }

  private createSMTPTransporter(config: SMTPConfig): Transporter<SMTPTransport.SentMessageInfo> {
    const transporterOptions: SMTPTransport.Options = {
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.oauth2 ? {
        type: 'OAuth2',
        user: config.auth.user,
        clientId: config.oauth2.clientId,
        clientSecret: config.oauth2.clientSecret,
        refreshToken: config.oauth2.refreshToken,
        accessToken: config.oauth2.accessToken,
      } : {
        user: config.auth.user,
        pass: config.auth.pass,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 14, // messages per second
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
    };

    return createTransport(transporterOptions);
  }

  private createSendGridTransporter(config: SendGridConfig): Transporter<SMTPTransport.SentMessageInfo> {
    return createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: config.apiKey,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 14,
    });
  }

  private createSESTransporter(config: SESConfig): Transporter<SMTPTransport.SentMessageInfo> {
    return createTransport({
      SES: {
        region: config.region,
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      }
    });
  }

  /**
   * Validates SPF and DKIM records for the sender domain
   */
  async validateDomainConfiguration(domain: string): Promise<{
    spfValid: boolean;
    dkimValid: boolean;
    issues: string[];
  }> {
    try {
      const spfResult = await this.spfDkimValidator.validateSPF(domain);
      const dkimResult = await this.spfDkimValidator.validateDKIM(domain);

      const issues: string[] = [];
      if (!spfResult.valid) {
        issues.push(`SPF validation failed: ${spfResult.reason}`);
      }
      if (!dkimResult.valid) {
        issues.push(`DKIM validation failed: ${dkimResult.reason}`);
      }

      return {
        spfValid: spfResult.valid,
        dkimValid: dkimResult.valid,
        issues
      };
    } catch (error) {
      logger.error('Domain validation failed', {
        domain,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return {
        spfValid: false,
        dkimValid: false,
        issues: ['Validation service unavailable']
      };
    }
  }

  /**
   * Sends email with retry mechanism and queue management
   */
  async sendEmail(options: EmailOptions): Promise<EmailSendResult> {
    const emailId = this.generateEmailId();
    
    try {
      // Validate email options
      this.validateEmailOptions(options);

      // Generate template if specified
      if (options.template) {
        const templateResult = await this.templateEngine.render(
          options.template,
          options.templateData || {},
          options.language || 'pl'
        );
        options.html = templateResult.html;
        options.text = templateResult.text;
      }

      // Ensure plaintext fallback exists
      if (options.html && !options.text) {
        options.text = this.generatePlaintextFromHTML(options.html);
      }

      // Add to queue for processing
      return await this.queue.add({
        id: emailId,
        options,
        createdAt: new Date(),
        attempts: 0,
        maxAttempts: 3
      });

    } catch (error) {
      logger.error('Email sending failed', {
        emailId,
        error: error instanceof Error ? error.message : 'Unknown error',
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to
      });

      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        provider: this.config.provider
      };
    }
  }

  /**
   * Process email queue with retry logic
   */
  async processQueue(): Promise<void> {
    const queuedEmails = await this.queue.getQueuedEmails();
    
    for (const queuedEmail of queuedEmails) {
      await this.processQueuedEmail(queuedEmail);
    }
  }

  private async processQueuedEmail(queuedEmail: any): Promise<void> {
    try {
      const result = await this.retryManager.executeWithRetry(
        () => this.sendEmailDirect(queuedEmail.options),
        {
          maxRetries: queuedEmail.maxAttempts,
          baseDelay: 1000,
          maxDelay: 30000,
          backoffFactor: 2
        }
      );

      if (result.success) {
        await this.queue.markAsCompleted(queuedEmail.id);
        logger.info('Email sent successfully', {
          emailId: queuedEmail.id,
          messageId: result.messageId,
          provider: this.config.provider,
          attempts: result.attempt
        });
      } else {
        await this.queue.markAsFailed(queuedEmail.id, result.error);
        logger.error('Email sending failed after retries', {
          emailId: queuedEmail.id,
          error: result.error?.message,
          attempts: result.attempt
        });
      }
    } catch (error) {
      await this.queue.markAsFailed(queuedEmail.id, error instanceof Error ? error : new Error('Unknown error'));
      logger.error('Email processing failed', {
        emailId: queuedEmail.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async sendEmailDirect(options: EmailOptions): Promise<EmailSendResult> {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized');
    }

    const mailOptions = {
      from: options.from || process.env.SMTP_FROM_EMAIL,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      priority: options.priority,
      attachments: options.attachments
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: info.messageId,
        provider: this.config.provider
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown sending error');
    }
  }

  private validateEmailOptions(options: EmailOptions): void {
    if (!options.to) {
      throw new Error('Recipient email address is required');
    }

    if (!options.subject) {
      throw new Error('Email subject is required');
    }

    if (!options.html && !options.text && !options.template) {
      throw new Error('Email content (html, text, or template) is required');
    }

    // Validate email addresses
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    for (const recipient of recipients) {
      if (!this.isValidEmail(recipient)) {
        throw new Error(`Invalid email address: ${recipient}`);
      }
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generatePlaintextFromHTML(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  private generateEmailId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get email service health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    provider: string;
    queueSize: number;
    lastError?: string;
  }> {
    try {
      if (!this.transporter) {
        return {
          status: 'unhealthy',
          provider: this.config.provider,
          queueSize: await this.queue.getQueueSize(),
          lastError: 'Transporter not initialized'
        };
      }

      // Test connection
      await this.transporter.verify();
      
      const queueSize = await this.queue.getQueueSize();
      
      return {
        status: queueSize > 100 ? 'degraded' : 'healthy',
        provider: this.config.provider,
        queueSize
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        provider: this.config.provider,
        queueSize: await this.queue.getQueueSize(),
        lastError: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Close connections and cleanup
   */
  async close(): Promise<void> {
    if (this.transporter) {
      this.transporter.close();
    }
    await this.queue.close();
  }
}
