import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

function getDatasourceUrl() {
  if (process.env.VERCEL) {
    const sourceDb = path.join(process.cwd(), 'prisma', 'dev.db')
    const targetDb = path.join('/tmp', 'striver-dev.db')

    if (!fs.existsSync(targetDb)) {
      fs.copyFileSync(sourceDb, targetDb)
    }

    return `file:${targetDb}`
  }

  return process.env.DATABASE_URL
}

const prismaClientSingleton = () => {
  const url = getDatasourceUrl()

  return new PrismaClient(
    url
      ? {
          datasources: {
            db: { url },
          },
        }
      : undefined
  )
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
