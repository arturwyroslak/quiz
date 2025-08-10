import { v4 as uuidv4 } from 'uuid';
import { NextRequest } from 'next/server';

// Log levels
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// Log metadata interface
export interface LogMetadata {
  correlationId?: string;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  error?: Error;
  [key: string]: any;
}

// Structured log entry
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata: LogMetadata;
  environment: string;
  service: string;
  version: string;
}

// Sensitive data patterns to scrub
const SENSITIVE_PATTERNS = [
  // Passwords and tokens
  /password/i,
  /token/i,
  /secret/i,
  /key/i,
  /credential/i,
  /auth/i,
  // Email patterns (for SMTP)
  /smtp.*password/i,
  /smtp.*pass/i,
  /email.*password/i,
  // Generic sensitive fields
  /bearer/i,
  /authorization/i,
  /x-api-key/i,
  /x-auth-token/i,
];

// Sensitive data scrubber
export class DataScrubber {
  private static readonly MASK = '***REDACTED***';
  private static readonly EMAIL_MASK_REGEX = /(.{2}).*(@.*)/;

  /**
   * Scrubs sensitive data from any object
   */
  static scrub(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      return this.scrubString(data);
    }

    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        return data.map(item => this.scrub(item));
      }

      const scrubbed: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (this.isSensitiveKey(key)) {
          scrubbed[key] = this.MASK;
        } else if (key.toLowerCase().includes('email') && typeof value === 'string') {
          scrubbed[key] = this.maskEmail(value);
        } else {
          scrubbed[key] = this.scrub(value);
        }
      }
      return scrubbed;
    }

    return data;
  }

  /**
   * Scrubs sensitive data from strings
   */
  private static scrubString(str: string): string {
    // Don't scrub if the string is too short to contain sensitive data
    if (str.length < 8) {
      return str;
    }

    // Check for JWT tokens (they start with 'eyJ')
    if (str.startsWith('eyJ')) {
      return this.MASK;
    }

    // Check for Bearer tokens
    if (str.toLowerCase().startsWith('bearer ')) {
      return `Bearer ${this.MASK}`;
    }

    // Check for other common token patterns
    if (/^[A-Za-z0-9+/=]{20,}$/.test(str)) {
      return this.MASK;
    }

    return str;
  }

  /**
   * Masks email addresses partially
   */
  private static maskEmail(email: string): string {
    return email.replace(this.EMAIL_MASK_REGEX, '$1***$2');
  }

  /**
   * Checks if a key is sensitive
   */
  private static isSensitiveKey(key: string): boolean {
    return SENSITIVE_PATTERNS.some(pattern => pattern.test(key));
  }
}

// Correlation ID manager
export class CorrelationManager {
  private static readonly CORRELATION_ID_HEADER = 'x-correlation-id';
  private static readonly REQUEST_ID_HEADER = 'x-request-id';

  /**
   * Generates a new correlation ID
   */
  static generateCorrelationId(): string {
    return uuidv4();
  }

  /**
   * Extracts correlation ID from request headers or generates a new one
   */
  static getCorrelationId(request: NextRequest): string {
    const existingId = request.headers.get(this.CORRELATION_ID_HEADER) || 
                      request.headers.get(this.REQUEST_ID_HEADER);
    
    return existingId || this.generateCorrelationId();
  }

  /**
   * Adds correlation ID to response headers
   */
  static addCorrelationHeaders(headers: Headers, correlationId: string): void {
    headers.set(this.CORRELATION_ID_HEADER, correlationId);
    headers.set(this.REQUEST_ID_HEADER, correlationId);
  }
}

// Main logger class
export class Logger {
  private static instance: Logger;
  private readonly environment: string;
  private readonly service: string;
  private readonly version: string;

  private constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.service = process.env.SERVICE_NAME || 'artsc-api';
    this.version = process.env.APP_VERSION || '1.0.0';
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Creates a structured log entry
   */
  private createLogEntry(level: LogLevel, message: string, metadata: LogMetadata = {}): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata: DataScrubber.scrub(metadata),
      environment: this.environment,
      service: this.service,
      version: this.version,
    };
  }

  /**
   * Outputs log to console or external service
   */
  private output(entry: LogEntry): void {
    const logString = JSON.stringify(entry);

    // In development, use pretty printing
    if (this.environment === 'development') {
      const color = this.getLogColor(entry.level);
      console.log(`${color}[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}\x1b[0m`);
      if (Object.keys(entry.metadata).length > 0) {
        console.log(`${color}Metadata:`, entry.metadata, '\x1b[0m');
      }
    } else {
      // In production, output JSON for external log aggregation
      console.log(logString);
    }

    // Send to external logging service if configured
    this.sendToExternalService(entry);
  }

  /**
   * Get color code for log level
   */
  private getLogColor(level: LogLevel): string {
    switch (level) {
      case 'error': return '\x1b[31m'; // Red
      case 'warn': return '\x1b[33m';  // Yellow
      case 'info': return '\x1b[36m';  // Cyan
      case 'debug': return '\x1b[90m'; // Gray
      default: return '\x1b[0m';       // Reset
    }
  }

  /**
   * Send logs to external service (Logtail, Datadog, etc.)
   */
  private sendToExternalService(entry: LogEntry): void {
    // Only send to external service in production
    if (this.environment !== 'production') {
      return;
    }

    const externalLogUrl = process.env.EXTERNAL_LOG_URL;
    const externalLogToken = process.env.EXTERNAL_LOG_TOKEN;

    if (!externalLogUrl || !externalLogToken) {
      return;
    }

    // Send asynchronously to avoid blocking
    setImmediate(async () => {
      try {
        await fetch(externalLogUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${externalLogToken}`,
          },
          body: JSON.stringify(entry),
        });
      } catch (error) {
        // Fallback to console if external service fails
        console.error('Failed to send log to external service:', error);
      }
    });
  }

  /**
   * Log error level message
   */
  error(message: string, metadata?: LogMetadata): void {
    const entry = this.createLogEntry('error', message, metadata);
    this.output(entry);
  }

  /**
   * Log warning level message
   */
  warn(message: string, metadata?: LogMetadata): void {
    const entry = this.createLogEntry('warn', message, metadata);
    this.output(entry);
  }

  /**
   * Log info level message
   */
  info(message: string, metadata?: LogMetadata): void {
    const entry = this.createLogEntry('info', message, metadata);
    this.output(entry);
  }

  /**
   * Log debug level message
   */
  debug(message: string, metadata?: LogMetadata): void {
    // Only log debug in development
    if (this.environment === 'development') {
      const entry = this.createLogEntry('debug', message, metadata);
      this.output(entry);
    }
  }

  /**
   * Log HTTP request
   */
  logRequest(request: NextRequest, correlationId: string, metadata: LogMetadata = {}): void {
    const requestMetadata: LogMetadata = {
      correlationId,
      method: request.method,
      url: request.url,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      ...metadata,
    };

    this.info('HTTP Request', requestMetadata);
  }

  /**
   * Log HTTP response
   */
  logResponse(
    request: NextRequest,
    statusCode: number,
    correlationId: string,
    duration: number,
    metadata: LogMetadata = {}
  ): void {
    const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    
    const responseMetadata: LogMetadata = {
      correlationId,
      method: request.method,
      url: request.url,
      statusCode,
      duration,
      ...metadata,
    };

    this[level]('HTTP Response', responseMetadata);
  }

  /**
   * Log authentication events
   */
  logAuth(event: string, metadata: LogMetadata = {}): void {
    // Always scrub auth-related data
    const authMetadata = DataScrubber.scrub(metadata);
    this.info(`Auth: ${event}`, authMetadata);
  }

  /**
   * Log database operations
   */
  logDatabase(operation: string, metadata: LogMetadata = {}): void {
    const dbMetadata: LogMetadata = {
      operation,
      ...metadata,
    };
    this.info('Database Operation', dbMetadata);
  }

  /**
   * Log security events
   */
  logSecurity(event: string, metadata: LogMetadata = {}): void {
    const securityMetadata: LogMetadata = {
      event,
      ...metadata,
    };
    this.warn(`Security: ${event}`, securityMetadata);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
