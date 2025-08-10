import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

// Use the singleton Prisma client
const db = prisma;

// Token rotation configuration
const TOKEN_ROTATION_INTERVAL = 15 * 60 * 1000; // 15 minutes
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

// Extend default types to include custom role and permissions
declare module "next-auth" {
  interface User {
    id: string;
    accountType?: string;
    isVerified?: boolean;
    isActive?: boolean;
    role?: string;
    permissions?: string[];
    referralCode?: string;
  }
  interface Session {
    user: {
      id: string;
      accountType?: string;
      isVerified?: boolean;
      isActive?: boolean;
      role?: string;
      permissions?: string[];
      referralCode?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accountType?: string;
    isVerified?: boolean;
    isActive?: boolean;
    role?: string;
    permissions?: string[];
    referralCode?: string;
    jti?: string;
    lastRotated?: number;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dni
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Secure only in production
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null;
        }

        if (typeof user.password !== 'string' || !user.password) {
          // Log sanitized information without exposing sensitive data
          logger.logAuth('Missing password for user account', { 
            email: credentials.email,
            userId: user.id
          });
          throw new Error('Authentication error: Account does not have a password set. Please contact administrator.');
        }

        // Validate user account status
        if (!user.isVerified) {
          logger.logAuth('Authentication attempt with unverified account', { 
            email: credentials.email,
            userId: user.id
          });
          return null;
        }

        if (!user.isActive) {
          logger.logAuth('Authentication attempt with inactive account', { 
            email: credentials.email,
            userId: user.id
          });
          return null;
        }

        const passwordMatch = await compare(
          credentials.password, 
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        // Determine role and permissions based on account type
        const role = getUserRole(user.accountType);
        const permissions = getUserPermissions(user.accountType);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          accountType: user.accountType,
          isVerified: user.isVerified,
          isActive: user.isActive,
          role,
          permissions,
          referralCode: user.referralCode
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      const now = Date.now();
      
      // Handle initial sign-in
      if (user) {
        token.id = user.id;
        token.accountType = user.accountType;
        token.isVerified = user.isVerified;
        token.isActive = user.isActive;
        token.role = user.role;
        token.permissions = user.permissions;
        token.referralCode = user.referralCode;
        token.jti = randomUUID(); // JWT ID for token tracking
        token.lastRotated = now;
      }
      
      // Token rotation logic
      if (token.lastRotated && (now - token.lastRotated) > TOKEN_ROTATION_INTERVAL) {
        // Rotate token by generating new JTI
        token.jti = randomUUID();
        token.lastRotated = now;
        
        // Re-validate user status from database
        try {
          const currentUser = await db.user.findUnique({
            where: { id: token.id as string },
            select: {
              isVerified: true,
              isActive: true,
              accountType: true
            }
          });
          
          if (currentUser) {
            token.isVerified = currentUser.isVerified;
            token.isActive = currentUser.isActive;
            token.accountType = currentUser.accountType;
            token.role = getUserRole(currentUser.accountType);
            token.permissions = getUserPermissions(currentUser.accountType);
          }
        } catch (error) {
          logger.error('Error validating user during token rotation', {
            error: error instanceof Error ? error.message : 'Unknown error',
            userId: token.id,
            stack: error instanceof Error ? error.stack : undefined
          });
          // Return null to force re-authentication
          return null;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.accountType = token.accountType;
        session.user.isVerified = token.isVerified;
        session.user.isActive = token.isActive;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.referralCode = token.referralCode;
      }
      return session;
    }
  },
  pages: {
    signIn: "/partner-program/login",
    error: "/partner-program/login?error=true",
    signOut: "/partner-program/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};

// Helper function to determine user role based on account type
function getUserRole(accountType: string): string {
  switch (accountType) {
    case 'PARTNER':
      return 'INDIVIDUAL_PARTNER';
    case 'COMPANY':
      return 'COMPANY_PARTNER';
    case 'ADMIN':
      return 'ADMIN';
    default:
      return 'INDIVIDUAL_PARTNER';
  }
}

// Helper function to get user permissions based on account type
function getUserPermissions(accountType: string): string[] {
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
