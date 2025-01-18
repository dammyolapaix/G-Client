import { relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

import { authProviderEnum, roleEnum } from '@/db/enums'
import { timestamps } from '@/db/helper'
import { profiles } from '@/db/schema'

const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  email: varchar({ length: 320 }).notNull().unique(),
  emailVerified: timestamp({ mode: 'string' }),
  password: varchar({ length: 256 }),
  role: roleEnum().default('learner').notNull(),
  provider: authProviderEnum().default('email').notNull(),
  ...timestamps,
})

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profiles),
}))

export default users
