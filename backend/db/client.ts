import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../generated/prisma/client'

declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

const adapter = new PrismaPg(pool)

function createPrismaClient() {
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? [{ emit: 'stdout', level: 'query' }, { emit: 'stdout', level: 'error' }]
      : [{ emit: 'stdout', level: 'error' }],
  })
}

export const db = globalThis.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}

async function connectWithRetry(attempt = 1, maxAttempts = 5) {
  try {
    await db.$connect()
    console.log('Database connected')
  } catch (err) {
    if (attempt >= maxAttempts) {
      console.error('Max DB connection attempts reached. Exiting.')
      process.exit(1)
    }
    const delay = Math.min(1000 * 2 ** attempt, 30000)
    console.warn(`DB connection failed. Retry ${attempt + 1} in ${delay / 1000}s...`)
    setTimeout(() => connectWithRetry(attempt + 1, maxAttempts), delay)
  }
}

async function shutdown() {
  await db.$disconnect()
  await pool.end()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

if (!process.env.SKIP_DB_CONNECT) {
  connectWithRetry()
}

export async function disconnectDB() {
  await db.$disconnect()
  await pool.end()
}