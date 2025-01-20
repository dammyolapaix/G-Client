import { Table, getTableName, sql } from 'drizzle-orm'

import { env } from '@/env/server'

import db from '.'
import * as schema from './schema'
import * as seed from './seed'

if (!env.DB_SEEDING)
  throw new Error('You must set DB_SEEDING to "true" when running seeds')

async function resetTable(table: Table) {
  return db.execute(
    sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
  )
}

const seedData = async () => {
  for (const table of [schema.users]) {
    // await db.delete(table); // clear tables without truncating / resetting ids
    await resetTable(table)
  }

  await seed.users()

  await db.$client.end()
}

seedData()
