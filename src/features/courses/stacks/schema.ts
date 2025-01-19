import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

import { timestamps } from '@/db/helper'

const stacks = pgTable('stacks', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  name: varchar({ length: 320 }).notNull().unique(),
  ...timestamps,
})

export default stacks
