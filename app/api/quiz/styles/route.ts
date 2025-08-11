import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const styles = await prisma.style.findMany({
      include: {
        images: true,
      },
    })
    return NextResponse.json(styles)
  } catch (error) {
    console.error('Error fetching styles:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
