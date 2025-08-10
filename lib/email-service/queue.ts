import { logger } from '../logger';

export interface QueuedEmail {
  id: string;
  options: any;
  createdAt: Date;
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'retry';
  lastAttemptAt?: Date;
  nextAttemptAt?: Date;
  error?: Error;
}

export class EmailQueue {
  private queue: Map<string, QueuedEmail> = new Map();
  private processingInterval: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor() {
    this.startProcessing();
  }

  /**
   * Add email to the queue
   */
  async add(emailData: Omit<QueuedEmail, 'status'>): Promise<any> {
    const queuedEmail: QueuedEmail = {
      ...emailData,
      status: 'pending'
    };

    this.queue.set(emailData.id, queuedEmail);

    logger.info('Email added to queue', {
      emailId: emailData.id,
      queueSize: this.queue.size
    });

    // For immediate processing, return a promise that resolves when the email is processed
    return new Promise((resolve, reject) => {
      const checkStatus = () => {
        const email = this.queue.get(emailData.id);
        if (!email) {
          reject(new Error('Email not found in queue'));
          return;
        }

        if (email.status === 'completed') {
          resolve({
            success: true,
            messageId: `queued_${email.id}`,
            provider: 'queue'
          });
        } else if (email.status === 'failed') {
          reject(email.error || new Error('Email sending failed'));
        } else {
          // Check again after a short delay
          setTimeout(checkStatus, 100);
        }
      };

      // Start checking after a short delay
      setTimeout(checkStatus, 100);
    });
  }

  /**
   * Get all queued emails ready for processing
   */
  async getQueuedEmails(): Promise<QueuedEmail[]> {
    const now = new Date();
    return Array.from(this.queue.values()).filter(email => 
      (email.status === 'pending' || email.status === 'retry') &&
      (email.attempts < email.maxAttempts) &&
      (!email.nextAttemptAt || email.nextAttemptAt <= now)
    );
  }

  /**
   * Mark email as completed
   */
  async markAsCompleted(emailId: string): Promise<void> {
    const email = this.queue.get(emailId);
    if (email) {
      email.status = 'completed';
      // Remove from queue after a delay to allow status checking
      setTimeout(() => {
        this.queue.delete(emailId);
      }, 5000);
    }
  }

  /**
   * Mark email as failed
   */
  async markAsFailed(emailId: string, error: Error): Promise<void> {
    const email = this.queue.get(emailId);
    if (email) {
      email.status = 'failed';
      email.error = error;
      email.lastAttemptAt = new Date();
      
      // Remove from queue after a delay to allow status checking
      setTimeout(() => {
        this.queue.delete(emailId);
      }, 10000);
    }
  }

  /**
   * Mark email for retry with exponential backoff
   */
  async markForRetry(emailId: string, attempt: number): Promise<void> {
    const email = this.queue.get(emailId);
    if (email) {
      email.status = 'retry';
      email.attempts = attempt;
      email.lastAttemptAt = new Date();
      
      // Calculate next attempt time with exponential backoff
      const baseDelay = 1000; // 1 second
      const maxDelay = 300000; // 5 minutes
      const backoffFactor = 2;
      
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt - 1),
        maxDelay
      );
      
      email.nextAttemptAt = new Date(Date.now() + delay);
      
      logger.info('Email marked for retry', {
        emailId,
        attempt,
        nextAttemptAt: email.nextAttemptAt,
        delay
      });
    }
  }

  /**
   * Get current queue size
   */
  async getQueueSize(): Promise<number> {
    return this.queue.size;
  }

  /**
   * Start automatic queue processing
   */
  private startProcessing(): void {
    if (this.processingInterval) {
      return;
    }

    this.processingInterval = setInterval(async () => {
      if (this.isProcessing) {
        return;
      }

      this.isProcessing = true;
      try {
        await this.processQueueBatch();
      } catch (error) {
        logger.error('Queue processing error', {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        this.isProcessing = false;
      }
    }, 1000); // Process every second
  }

  /**
   * Process a batch of queued emails
   */
  private async processQueueBatch(): Promise<void> {
    const queuedEmails = await this.getQueuedEmails();
    
    if (queuedEmails.length === 0) {
      return;
    }

    logger.debug('Processing email queue batch', {
      batchSize: queuedEmails.length,
      totalQueueSize: this.queue.size
    });

    // Process emails in parallel but limit concurrency
    const concurrencyLimit = 3;
    const chunks = this.chunkArray(queuedEmails, concurrencyLimit);

    for (const chunk of chunks) {
      await Promise.allSettled(
        chunk.map(email => this.processEmail(email))
      );
    }
  }

  /**
   * Process individual email
   */
  private async processEmail(email: QueuedEmail): Promise<void> {
    email.status = 'processing';
    email.attempts++;
    email.lastAttemptAt = new Date();

    try {
      // This would normally call the actual email sending logic
      // For now, we'll simulate processing
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
      
      // Simulate success/failure based on attempt number
      if (email.attempts <= 2 && Math.random() < 0.3) {
        throw new Error('Simulated transient error');
      }

      await this.markAsCompleted(email.id);
    } catch (error) {
      if (email.attempts < email.maxAttempts) {
        await this.markForRetry(email.id, email.attempts);
      } else {
        await this.markAsFailed(email.id, error instanceof Error ? error : new Error('Unknown error'));
      }
    }
  }

  /**
   * Split array into chunks
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Get queue statistics
   */
  async getStatistics(): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    retry: number;
  }> {
    const emails = Array.from(this.queue.values());
    
    return {
      total: emails.length,
      pending: emails.filter(e => e.status === 'pending').length,
      processing: emails.filter(e => e.status === 'processing').length,
      completed: emails.filter(e => e.status === 'completed').length,
      failed: emails.filter(e => e.status === 'failed').length,
      retry: emails.filter(e => e.status === 'retry').length,
    };
  }

  /**
   * Clear completed and failed emails older than specified time
   */
  async cleanup(olderThanMinutes: number = 60): Promise<void> {
    const cutoffTime = new Date(Date.now() - (olderThanMinutes * 60 * 1000));
    let cleanedCount = 0;

    for (const [id, email] of this.queue.entries()) {
      if (
        (email.status === 'completed' || email.status === 'failed') &&
        email.lastAttemptAt &&
        email.lastAttemptAt < cutoffTime
      ) {
        this.queue.delete(id);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info('Queue cleanup completed', {
        cleanedCount,
        remainingSize: this.queue.size
      });
    }
  }

  /**
   * Stop processing and cleanup
   */
  async close(): Promise<void> {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }

    // Wait for current processing to complete
    while (this.isProcessing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    logger.info('Email queue closed', {
      remainingEmails: this.queue.size
    });
  }
}
