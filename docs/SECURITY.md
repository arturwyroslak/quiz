# Security Documentation

## Authentication & Authorization Hardening

This document outlines the security measures implemented to harden the authentication and authorization systems in the application.

## Overview

The application has been updated to use a single, consistent authentication mechanism based on NextAuth.js with enhanced security features including CSRF protection, secure cookie settings, and improved logging practices.

## Changes Made

### 1. Authentication Flow Consolidation

**Before:**
- Dual authentication systems: NextAuth and custom JWT endpoint `/api/partner/login`
- Inconsistent token management
- Custom JWT verification in middleware

**After:**
- Single NextAuth-based authentication flow
- Deprecated custom JWT login endpoint
- Consistent session management using NextAuth tokens

### 2. Secret Management

**Security Measures:**
- All secrets are now 32-byte random keys generated using cryptographically secure methods
- Script provided for regenerating secrets: `scripts/regenerate-secrets.js`
- Secrets should be stored in a secure vault (AWS Secrets Manager, Azure Key Vault, etc.)

**Current Secrets:**
- `NEXTAUTH_SECRET`: Used for NextAuth session encryption
- `JWT_SECRET`: Legacy - no longer used in new implementation

### 3. Cookie Security

**Enhanced Security Settings:**
- `httpOnly: true` - Prevents JavaScript access to cookies
- `secure: true` - Ensures cookies are only sent over HTTPS
- `sameSite: 'strict'` - Prevents CSRF attacks via cookie inclusion

**NextAuth Cookie Configuration:**
```typescript
cookies: {
  sessionToken: {
    name: 'next-auth.session-token',
    options: {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: true,
    }
  }
}
```

### 4. Log Security

**Sanitized Logging:**
- Email addresses are partially masked in logs: `em***@example.com`
- Passwords are never logged
- Error messages don't expose sensitive information
- Authentication attempts are logged with sanitized data

**Example:**
```typescript
console.warn('Authentication attempt with unverified account', { 
  email: credentials.email.replace(/(.{2}).*(@.*)/, '$1***$2')
});
```

### 5. CSRF Protection

**Implementation:**
- CSRF tokens are generated using HMAC-SHA256 with session binding
- Tokens are time-limited (1 hour by default)
- All mutating API endpoints (POST, PUT, DELETE, PATCH) require CSRF tokens
- Client-side hook for automatic token management

**Files:**
- `lib/csrf.ts` - CSRF token generation and validation
- `app/api/csrf-token/route.ts` - CSRF token endpoint
- `hooks/use-csrf-token.ts` - Client-side CSRF token management

**Usage:**
```typescript
// In API routes
import { validateCSRFToken } from '@/lib/csrf';

const isValidCSRF = await validateCSRFToken(request);
if (!isValidCSRF) {
  return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
}
```

```typescript
// In client-side components
import { useCSRFToken, withCSRFToken } from '@/hooks/use-csrf-token';

const { token, loading, error } = useCSRFToken();

const response = await fetch('/api/endpoint', 
  withCSRFToken(token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
);
```

## Security Best Practices

### 1. Secret Rotation

- Rotate secrets regularly (recommended: every 90 days)
- Use the provided script: `node scripts/regenerate-secrets.js`
- Store secrets in a secure vault, not in version control
- Update secrets in all environments simultaneously

### 2. Session Management

- Sessions are limited to 30 days maximum
- Sessions are invalidated when secrets are rotated
- Users must be verified and active to maintain sessions

### 3. API Security

- All authenticated API endpoints validate session tokens
- CSRF protection on all mutating endpoints
- Rate limiting should be implemented (recommended)
- Input validation and sanitization

### 4. Monitoring and Logging

- Authentication attempts are logged with sanitized data
- Failed login attempts are tracked
- No sensitive information is logged
- Consider implementing intrusion detection

## Testing Security

### 1. CSRF Protection Testing

```bash
# Test CSRF protection (should fail)
curl -X POST http://localhost:3000/api/partner/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Test with valid CSRF token (should succeed)
curl -X POST http://localhost:3000/api/partner/register \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <valid-token>" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### 2. Cookie Security Testing

Use browser developer tools to verify:
- Cookies have `HttpOnly`, `Secure`, and `SameSite=Strict` flags
- Cookies are not accessible via JavaScript
- Cookies are only sent over HTTPS in production

### 3. Session Security Testing

- Verify sessions expire after 30 days
- Test that inactive/unverified users cannot access protected routes
- Verify session invalidation after secret rotation

## Deployment Considerations

### 1. Environment Variables

```bash
# Production environment variables
NEXTAUTH_SECRET=<32-byte-base64-encoded-secret>
JWT_SECRET=<32-byte-base64-encoded-secret>  # Legacy, can be removed
```

### 2. HTTPS Configuration

- Ensure all environments use HTTPS
- Configure proper SSL/TLS certificates
- Use HSTS headers for additional security

### 3. Database Security

- Use encrypted database connections
- Implement database connection pooling
- Regular database security audits

## Compliance

This implementation helps meet various security standards:

- **OWASP Top 10**: Addresses authentication and session management vulnerabilities
- **GDPR**: Secure handling of user data and proper data protection
- **SOC 2**: Security controls for access management and data protection

## Incident Response

In case of security incidents:

1. **Immediate Actions:**
   - Rotate all secrets using the regeneration script
   - Invalidate all active sessions
   - Review logs for suspicious activity

2. **Investigation:**
   - Analyze authentication logs
   - Check for unauthorized access attempts
   - Verify integrity of user data

3. **Recovery:**
   - Deploy security patches
   - Notify affected users if necessary
   - Update security monitoring

## Regular Security Tasks

- [ ] Monthly secret rotation
- [ ] Quarterly security audit
- [ ] Annual penetration testing
- [ ] Continuous monitoring of authentication logs
- [ ] Regular dependency updates for security patches

## Resources

- [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
