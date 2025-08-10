import { logger } from '../logger';
import dns from 'dns';
import { promisify } from 'util';

const resolveTxt = promisify(dns.resolveTxt);
const resolveCname = promisify(dns.resolveCname);

export interface ValidationResult {
  valid: boolean;
  reason: string;
  record?: string;
}

export class SPFDKIMValidator {
  
  /**
   * Validates SPF record for a domain
   */
  async validateSPF(domain: string): Promise<ValidationResult> {
    try {
      const txtRecords = await resolveTxt(domain);
      const spfRecord = txtRecords.find(record => 
        record.join('').toLowerCase().startsWith('v=spf1')
      );

      if (!spfRecord) {
        return {
          valid: false,
          reason: 'No SPF record found',
        };
      }

      const spfString = spfRecord.join('');
      
      // Basic SPF validation
      if (!spfString.toLowerCase().includes('v=spf1')) {
        return {
          valid: false,
          reason: 'Invalid SPF record format',
          record: spfString
        };
      }

      // Check for common SPF issues
      const issues = this.validateSPFRecord(spfString);
      
      if (issues.length > 0) {
        return {
          valid: false,
          reason: `SPF record issues: ${issues.join(', ')}`,
          record: spfString
        };
      }

      logger.info('SPF validation successful', {
        domain,
        record: spfString
      });

      return {
        valid: true,
        reason: 'SPF record is valid',
        record: spfString
      };

    } catch (error) {
      logger.error('SPF validation failed', {
        domain,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        valid: false,
        reason: 'DNS lookup failed or domain not found'
      };
    }
  }

  /**
   * Validates DKIM setup for a domain
   */
  async validateDKIM(domain: string, selector = 'default'): Promise<ValidationResult> {
    try {
      // Common DKIM selectors to check
      const commonSelectors = [selector, 'default', 'mail', 'k1', 'dkim', 'selector1', 'selector2'];
      
      for (const sel of commonSelectors) {
        const dkimDomain = `${sel}._domainkey.${domain}`;
        
        try {
          const txtRecords = await resolveTxt(dkimDomain);
          const dkimRecord = txtRecords.find(record => 
            record.join('').toLowerCase().includes('v=dkim1')
          );

          if (dkimRecord) {
            const dkimString = dkimRecord.join('');
            
            // Validate DKIM record
            const issues = this.validateDKIMRecord(dkimString);
            
            if (issues.length > 0) {
              logger.warn('DKIM record has issues', {
                domain,
                selector: sel,
                issues,
                record: dkimString
              });
            }

            logger.info('DKIM validation successful', {
              domain,
              selector: sel,
              record: dkimString
            });

            return {
              valid: true,
              reason: `DKIM record found with selector '${sel}'`,
              record: dkimString
            };
          }
        } catch (selectorError) {
          // Continue to next selector
          continue;
        }
      }

      return {
        valid: false,
        reason: 'No DKIM record found with common selectors'
      };

    } catch (error) {
      logger.error('DKIM validation failed', {
        domain,
        selector,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        valid: false,
        reason: 'DNS lookup failed or domain not found'
      };
    }
  }

  /**
   * Validates the structure of an SPF record
   */
  private validateSPFRecord(spfRecord: string): string[] {
    const issues: string[] = [];
    const lowerRecord = spfRecord.toLowerCase();

    // Check for required v=spf1
    if (!lowerRecord.startsWith('v=spf1')) {
      issues.push('Must start with v=spf1');
    }

    // Check for policy (-all, ~all, ?all, +all)
    if (!lowerRecord.match(/[~\-\+\?]all/)) {
      issues.push('Missing final policy (e.g., -all, ~all)');
    }

    // Check for too many DNS lookups (max 10)
    const mechanisms = lowerRecord.match(/(include:|a:|mx:|exists:|redirect=)/g);
    if (mechanisms && mechanisms.length > 10) {
      issues.push('Too many DNS lookups (max 10 allowed)');
    }

    // Check for common mistakes
    if (lowerRecord.includes('ptr:') || lowerRecord.includes('ptr ')) {
      issues.push('PTR mechanism is deprecated and should be avoided');
    }

    return issues;
  }

  /**
   * Validates the structure of a DKIM record
   */
  private validateDKIMRecord(dkimRecord: string): string[] {
    const issues: string[] = [];
    const lowerRecord = dkimRecord.toLowerCase();

    // Check for required v=DKIM1
    if (!lowerRecord.includes('v=dkim1')) {
      issues.push('Must contain v=DKIM1');
    }

    // Check for public key
    if (!lowerRecord.includes('p=')) {
      issues.push('Missing public key (p= tag)');
    } else {
      // Check if public key is empty (revoked key)
      const pMatch = lowerRecord.match(/p=([^;]*)/);
      if (pMatch && pMatch[1].trim() === '') {
        issues.push('Public key is empty (revoked)');
      }
    }

    // Check for key type
    if (!lowerRecord.includes('k=')) {
      // Default is RSA, so this is just informational
    } else {
      const kMatch = lowerRecord.match(/k=([^;]*)/);
      if (kMatch && !['rsa', 'ed25519'].includes(kMatch[1].trim())) {
        issues.push('Unsupported key type');
      }
    }

    return issues;
  }

  /**
   * Validates email deliverability for a domain
   */
  async validateEmailDeliverability(domain: string): Promise<{
    spf: ValidationResult;
    dkim: ValidationResult;
    overall: {
      deliverable: boolean;
      score: number;
      recommendations: string[];
    };
  }> {
    const spfResult = await this.validateSPF(domain);
    const dkimResult = await this.validateDKIM(domain);

    let score = 0;
    const recommendations: string[] = [];

    // Calculate deliverability score
    if (spfResult.valid) {
      score += 50;
    } else {
      recommendations.push('Set up SPF record to improve deliverability');
    }

    if (dkimResult.valid) {
      score += 50;
    } else {
      recommendations.push('Set up DKIM signing to improve deliverability');
    }

    // Additional recommendations
    if (!spfResult.valid && !dkimResult.valid) {
      recommendations.push('Consider using a professional email service like SendGrid or AWS SES');
    }

    const deliverable = score >= 50; // At least one authentication method should be present

    logger.info('Email deliverability assessment', {
      domain,
      score,
      deliverable,
      spfValid: spfResult.valid,
      dkimValid: dkimResult.valid
    });

    return {
      spf: spfResult,
      dkim: dkimResult,
      overall: {
        deliverable,
        score,
        recommendations
      }
    };
  }

  /**
   * Get DNS configuration recommendations for email setup
   */
  async getEmailDNSRecommendations(domain: string): Promise<{
    spf: string[];
    dkim: string[];
    dmarc: string[];
  }> {
    return {
      spf: [
        `Create TXT record for ${domain}:`,
        `v=spf1 include:_spf.google.com include:sendgrid.net -all`,
        '(Adjust includes based on your email providers)'
      ],
      dkim: [
        `Create CNAME record for default._domainkey.${domain}:`,
        `Point to your email provider's DKIM key`,
        `Example: default._domainkey.${domain} → mail.${domain}.domainkey.sendgrid.net`
      ],
      dmarc: [
        `Create TXT record for _dmarc.${domain}:`,
        `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}; ruf=mailto:dmarc@${domain}`,
        'Start with p=none, then move to p=quarantine, finally to p=reject'
      ]
    };
  }
}
