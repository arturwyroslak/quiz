import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prismaClient =
  global.prisma ||
  new PrismaClient({
    log: ['warn', 'error'],
  })

export const prisma = prismaClient.$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') global.prisma = prismaClient
