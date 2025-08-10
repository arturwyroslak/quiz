import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextRequest, NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { blacklistToken } from '../middleware';

// Permission types
export type Permission = 
  | 'leads:read' | 'leads:create' | 'leads:update' | 'leads:delete' | 'leads:*'
  | 'team:read' | 'team:create' | 'team:update' | 'team:delete' | 'team:*'
  | 'reports:read' | 'reports:create' | 'reports:update' | 'reports:delete' | 'reports:*'
  | 'users:read' | 'users:create' | 'users:update' | 'users:delete' | 'users:*'
  | 'profile:read' | 'profile:update' | 'profile:delete' | 'profile:*'
  | 'system:read' | 'system:update' | 'system:delete' | 'system:*';

// Role types
export type Role = 'INDIVIDUAL_PARTNER' | 'COMPANY_PARTNER' | 'TEAM_MEMBER' | 'ADMIN';

// Session validation result
export interface SessionValidationResult {
  isValid: boolean;
  session: Session | null;
  error?: string;
}

// Permission check result
export interface PermissionCheckResult {
  hasPermission: boolean;
  session: Session | null;
  error?: string;
}

/**
 * Enhanced session validation with role and permission checking
 */
export async function requireSession(options?: {
  requiredRole?: Role;
  requiredPermissions?: Permission[];
  allowedAccountTypes?: string[];
}): Promise<SessionValidationResult> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return {
        isValid: false,
        session: null,
        error: 'Authentication required'
      };
    }

    // Check if user is verified and active
    if (!session.user.isVerified) {
      return {
        isValid: false,
        session: null,
        error: 'Account not verified'
      };
    }

    if (!session.user.isActive) {
      return {
        isValid: false,
        session: null,
        error: 'Account is inactive'
      };
    }

    // Check required role
    if (options?.requiredRole && session.user.role !== options.requiredRole) {
      return {
        isValid: false,
        session: null,
        error: `Required role: ${options.requiredRole}`
      };
    }

    // Check account type restrictions
    if (options?.allowedAccountTypes && 
        !options.allowedAccountTypes.includes(session.user.accountType || '')) {
      return {
        isValid: false,
        session: null,
        error: 'Account type not authorized'
      };
    }

    // Check required permissions
    if (options?.requiredPermissions) {
      const hasPermissions = hasAllPermissions(
        session.user.permissions || [], 
        options.requiredPermissions
      );
      
      if (!hasPermissions) {
        return {
          isValid: false,
          session: null,
          error: 'Insufficient permissions'
        };
      }
    }

    return {
      isValid: true,
      session
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return {
      isValid: false,
      session: null,
      error: 'Session validation failed'
    };
  }
}

/**
 * Check if user has specific permissions
 */
export function hasAllPermissions(
  userPermissions: string[], 
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every(permission => 
    hasPermission(userPermissions, permission)
  );
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  userPermissions: string[], 
  permission: Permission
): boolean {
  // Check for exact permission match
  if (userPermissions.includes(permission)) {
    return true;
  }

  // Check for wildcard permissions
  const [resource, action] = permission.split(':');
  const wildcardPermission = `${resource}:*`;
  
  if (userPermissions.includes(wildcardPermission)) {
    return true;
  }

  // Check for admin wildcard
  if (userPermissions.includes('*:*')) {
    return true;
  }

  return false;
}

/**
 * API Route helper with role-based access control
 */
export async function withAuth<T = any>(
  handler: (req: NextRequest, session: Session) => Promise<NextResponse<T>>,
  options?: {
    requiredRole?: Role;
    requiredPermissions?: Permission[];
    allowedAccountTypes?: string[];
  }
) {
  return async (req: NextRequest): Promise<NextResponse<T | { error: string }>> => {
    const validation = await requireSession(options);
    
    if (!validation.isValid || !validation.session) {
      return NextResponse.json(
        { error: validation.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      return await handler(req, validation.session);
    } catch (error) {
      console.error('API handler error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(userRole: string | undefined, allowedRoles: Role[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole as Role);
}

/**
 * Check if user has specific account type
 */
export function hasAccountType(userAccountType: string | undefined, allowedTypes: string[]): boolean {
  if (!userAccountType) return false;
  return allowedTypes.includes(userAccountType);
}

/**
 * Create authorization middleware for specific requirements
 */
export function createAuthMiddleware(options: {
  requiredRole?: Role;
  requiredPermissions?: Permission[];
  allowedAccountTypes?: string[];
}) {
  return async (req: NextRequest) => {
    const validation = await requireSession(options);
    
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Add session to request headers for downstream use
    const response = NextResponse.next();
    response.headers.set('x-user-id', validation.session?.user.id || '');
    response.headers.set('x-user-role', validation.session?.user.role || '');
    response.headers.set('x-user-account-type', validation.session?.user.accountType || '');
    
    return response;
  };
}

/**
 * Logout helper that blacklists the current token
 */
export async function logoutWithTokenBlacklist(session: Session) {
  try {
    // If using custom JWT tokens, blacklist the current token
    const token = session as any;
    if (token.jti) {
      blacklistToken(token.jti);
    }
    
    // Additional cleanup can be added here
    console.log('User logged out and token blacklisted:', {
      userId: session.user.id,
      email: session.user.email?.replace(/(.{2}).*(@.*)/, '$1***$2')
    });
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

/**
 * Check if user can access a specific resource
 */
export function canAccessResource(
  userPermissions: string[], 
  resource: string, 
  action: string
): boolean {
  const permission = `${resource}:${action}` as Permission;
  return hasPermission(userPermissions, permission);
}

/**
 * Get user's effective permissions (resolved from roles)
 */
export function getEffectivePermissions(
  userRole: string | undefined, 
  userAccountType: string | undefined
): Permission[] {
  // This would typically come from a database or configuration
  // For now, we'll use the same logic as in auth.ts
  const accountType = userAccountType || 'PARTNER';
  
  switch (accountType) {
    case 'PARTNER':
      return ['leads:read', 'leads:create', 'profile:read', 'profile:update'];
    case 'COMPANY':
      return [
        'leads:read', 'leads:create', 'leads:update',
        'team:read', 'team:create', 'team:update',
        'reports:read', 'reports:create',
        'profile:read', 'profile:update'
      ];
    case 'ADMIN':
      return [
        'leads:*', 'team:*', 'reports:*', 'users:*',
        'profile:*', 'system:*'
      ];
    default:
      return ['leads:read', 'profile:read'];
  }
}

/**
 * Validate session and return standardized error responses
 */
export function createUnauthorizedResponse(message?: string) {
  return NextResponse.json(
    { error: message || 'Unauthorized access' },
    { status: 401 }
  );
}

export function createForbiddenResponse(message?: string) {
  return NextResponse.json(
    { error: message || 'Forbidden - insufficient permissions' },
    { status: 403 }
  );
}

export function createNotFoundResponse(message?: string) {
  return NextResponse.json(
    { error: message || 'Resource not found' },
    { status: 404 }
  );
}
