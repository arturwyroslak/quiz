import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return NextResponse.json(rooms)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
