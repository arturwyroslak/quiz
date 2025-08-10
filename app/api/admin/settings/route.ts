import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Mock settings storage - in a real app, this would be in database
let systemSettings = {
  emailSettings: {
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: parseInt(process.env.SMTP_PORT || '587'),
    smtpUser: process.env.SMTP_USER || '',
    smtpEnabled: process.env.SMTP_ENABLED === 'true'
  },
  partnerSettings: {
    defaultCommission: 10,
    minLeadValue: 1000,
    autoApproval: false,
    maxTeamMembers: 10
  },
  systemSettings: {
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxLoginAttempts: 5
  },
  notificationSettings: {
    newLeadNotifications: true,
    conversionNotifications: true,
    systemAlerts: true,
    emailDigest: false
  }
};

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.accountType !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    return NextResponse.json({ settings: systemSettings }, { status: 200 });

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.accountType !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const newSettings = await request.json();

    // Validate and update settings
    if (newSettings.emailSettings) {
      systemSettings.emailSettings = {
        ...systemSettings.emailSettings,
        ...newSettings.emailSettings
      };
    }

    if (newSettings.partnerSettings) {
      systemSettings.partnerSettings = {
        ...systemSettings.partnerSettings,
        ...newSettings.partnerSettings
      };
    }

    if (newSettings.systemSettings) {
      systemSettings.systemSettings = {
        ...systemSettings.systemSettings,
        ...newSettings.systemSettings
      };
    }

    if (newSettings.notificationSettings) {
      systemSettings.notificationSettings = {
        ...systemSettings.notificationSettings,
        ...newSettings.notificationSettings
      };
    }

    // In a real app, you would save these to database
    // For now, we'll just keep them in memory

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings: systemSettings 
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
