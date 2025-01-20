import db from '@/db'
import { users } from '@/db/schema'
import { env } from '@/env/server'

import { InsertUser } from './types'

export default async function seed() {
  const usersSeedData: InsertUser[] = [
    {
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
      provider: 'email',
      role: 'admin',
      emailVerified: new Date().toISOString(),
    },
  ]

  await db.insert(users).values(usersSeedData)
}
