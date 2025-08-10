import { logger } from './logger';

export interface EmailConfig {
  provider: 'smtp' | 'sendgrid' | 'ses';
  smtp?: {
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
  };
  sendgrid?: {
    apiKey: string;
  };
  ses?: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  from: string;
  replyTo?: string;
}

export class EnvConfig {
  private static instance: EnvConfig;
  private config: Map<string, any> = new Map();

  private constructor() {
    this.loadConfiguration();
  }

  public static getInstance(): EnvConfig {
    if (!EnvConfig.instance) {
      EnvConfig.instance = new EnvConfig();
    }
    return EnvConfig.instance;
  }

  private loadConfiguration(): void {
    try {
      // Load environment variables with validation
      this.validateRequiredEnvVars();
      
      // Cache commonly used configurations
      this.config.set('email', this.getEmailConfig());
      this.config.set('app', this.getAppConfig());
      this.config.set('database', this.getDatabaseConfig());
      this.config.set('auth', this.getAuthConfig());

      logger.info('Environment configuration loaded successfully', {
        emailProvider: this.getEmailConfig().provider,
        environment: process.env.NODE_ENV,
        appUrl: process.env.NEXT_PUBLIC_APP_URL
      });
    } catch (error) {
      logger.error('Failed to load environment configuration', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private validateRequiredEnvVars(): void {
    const required = [
      'NEXT_PUBLIC_APP_URL',
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'JWT_SECRET'
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Validate email configuration based on provider
    const provider = process.env.EMAIL_PROVIDER || 'smtp';
    
    switch (provider) {
      case 'smtp':
        this.validateSMTPConfig();
        break;
      case 'sendgrid':
        this.validateSendGridConfig();
        break;
      case 'ses':
        this.validateSESConfig();
        break;
      default:
        throw new Error(`Unsupported email provider: ${provider}`);
    }
  }

  private validateSMTPConfig(): void {
    const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_FROM_EMAIL'];
    
    // Check if using OAuth2
    if (process.env.SMTP_OAUTH2_CLIENT_ID) {
      required.push('SMTP_OAUTH2_CLIENT_SECRET', 'SMTP_OAUTH2_REFRESH_TOKEN');
    } else {
      required.push('SMTP_PASSWORD');
    }

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing SMTP configuration: ${missing.join(', ')}`);
    }
  }

  private validateSendGridConfig(): void {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is required for SendGrid provider');
    }
    if (!process.env.SMTP_FROM_EMAIL) {
      throw new Error('SMTP_FROM_EMAIL is required');
    }
  }

  private validateSESConfig(): void {
    const required = ['AWS_SES_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'SMTP_FROM_EMAIL'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing AWS SES configuration: ${missing.join(', ')}`);
    }
  }

  public getEmailConfig(): EmailConfig {
    const provider = (process.env.EMAIL_PROVIDER || 'smtp') as 'smtp' | 'sendgrid' | 'ses';
    
    const config: EmailConfig = {
      provider,
      from: process.env.SMTP_FROM_EMAIL!,
      replyTo: process.env.SMTP_REPLY_TO_EMAIL
    };

    switch (provider) {
      case 'smtp':
        config.smtp = {
          host: process.env.SMTP_HOST!,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASSWORD,
            accessToken: process.env.SMTP_ACCESS_TOKEN,
            refreshToken: process.env.SMTP_REFRESH_TOKEN,
            clientId: process.env.SMTP_CLIENT_ID,
            clientSecret: process.env.SMTP_CLIENT_SECRET
          }
        };

        // Configure OAuth2 if credentials are available
        if (process.env.SMTP_OAUTH2_CLIENT_ID) {
          config.smtp.oauth2 = {
            clientId: process.env.SMTP_OAUTH2_CLIENT_ID,
            clientSecret: process.env.SMTP_OAUTH2_CLIENT_SECRET!,
            refreshToken: process.env.SMTP_OAUTH2_REFRESH_TOKEN!,
            accessToken: process.env.SMTP_OAUTH2_ACCESS_TOKEN
          };
        }
        break;

      case 'sendgrid':
        config.sendgrid = {
          apiKey: process.env.SENDGRID_API_KEY!
        };
        break;

      case 'ses':
        config.ses = {
          region: process.env.AWS_SES_REGION!,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        };
        break;
    }

    return config;
  }

  private getAppConfig(): any {
    return {
      url: process.env.NEXT_PUBLIC_APP_URL!,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.APP_VERSION || '1.0.0',
      serviceName: process.env.SERVICE_NAME || 'artsc-api'
    };
  }

  private getDatabaseConfig(): any {
    return {
      url: process.env.DATABASE_URL!,
      poolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
      connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000')
    };
  }

  private getAuthConfig(): any {
    return {
      nextAuthSecret: process.env.NEXTAUTH_SECRET!,
      jwtSecret: process.env.JWT_SECRET!,
      sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '86400'), // 24 hours
      tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || '1h'
    };
  }

  public get<T>(key: string): T {
    const value = this.config.get(key);
    if (value === undefined) {
      throw new Error(`Configuration key '${key}' not found`);
    }
    return value as T;
  }

  public getEnv(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (!value && defaultValue === undefined) {
      throw new Error(`Environment variable '${key}' not found and no default value provided`);
    }
    return value || defaultValue!;
  }

  public isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  public isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  public isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  }

  /**
   * Validates that all environment variables are properly formatted
   */
  public validateConfiguration(): {
    valid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check email configuration
    try {
      const emailConfig = this.getEmailConfig();
      
      if (emailConfig.provider === 'smtp' && emailConfig.smtp) {
        // Check for OAuth2 setup
        if (!emailConfig.smtp.oauth2 && emailConfig.smtp.auth.pass) {
          recommendations.push('Consider using OAuth2 instead of password authentication for better security');
        }

        // Check for secure connection
        if (!emailConfig.smtp.secure && emailConfig.smtp.port === 587) {
          recommendations.push('Consider using port 465 with secure=true for encrypted connection');
        }
      }
    } catch (error) {
      issues.push(`Email configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Check URL format
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl && !appUrl.startsWith('http')) {
      issues.push('NEXT_PUBLIC_APP_URL must start with http:// or https://');
    }

    // Check if using production URLs in development
    if (this.isDevelopment() && appUrl?.includes('localhost') === false) {
      recommendations.push('Consider using localhost URL for development environment');
    }

    // Check secret strength
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
      issues.push('JWT_SECRET should be at least 32 characters long');
    }

    return {
      valid: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Refreshes configuration from environment variables
   */
  public refreshConfiguration(): void {
    this.config.clear();
    this.loadConfiguration();
    logger.info('Configuration refreshed');
  }

  /**
   * Gets a sanitized version of the configuration for logging
   */
  public getSanitizedConfig(): any {
    const sanitized: any = {};
    
    // Include non-sensitive configuration
    const appConfig = this.get<any>('app');
    sanitized.app = appConfig;
    
    const emailConfig = this.get<EmailConfig>('email');
    sanitized.email = {
      provider: emailConfig.provider,
      from: emailConfig.from,
      smtp: emailConfig.smtp ? {
        host: emailConfig.smtp.host,
        port: emailConfig.smtp.port,
        secure: emailConfig.smtp.secure
      } : undefined
    };

    return sanitized;
  }
}

// Export singleton instance
export const envConfig = EnvConfig.getInstance();
