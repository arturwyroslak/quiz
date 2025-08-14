import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const details = await prisma.detail.findMany()
    return NextResponse.json(details)
  } catch (error) {
    console.error('Error fetching details:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
