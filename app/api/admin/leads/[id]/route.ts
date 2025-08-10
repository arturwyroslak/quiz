import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const leadId = params.id;

    // Fetch lead with full details
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
            accountType: true,
            phone: true,
            address: true,
            nip: true,
            regon: true
          }
        }
      }
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ lead }, { status: 200 });

  } catch (error) {
    console.error('Error fetching lead details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const leadId = params.id;
    const { status, estimatedValue, notes } = await request.json();

    // Update lead
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        ...(status && { status }),
        ...(estimatedValue !== undefined && { estimatedValue }),
        ...(notes !== undefined && { notes }),
        updatedAt: new Date()
      },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Lead updated successfully',
      lead: updatedLead 
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
