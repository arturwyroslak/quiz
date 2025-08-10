export class RetryManager {
  /**
   * Executes an asynchronous function with retry logic
   */
  async executeWithRetry(fn: () => Promise<any>, options: {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    backoffFactor: number;
  }): Promise<{ success: boolean; attempt: number; messageId?: string; error?: Error; }> {
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < options.maxRetries) {
      try {
        const result = await fn();
        return { success: true, attempt: attempt + 1, messageId: result.messageId };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        const delay = Math.min(options.baseDelay * Math.pow(options.backoffFactor, attempt), options.maxDelay);
        await this.delay(delay);
        attempt++;
      }
    }

    return { success: false, attempt, error: lastError };
  }

  /**
   * Delay execution for a specific time in milliseconds
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
