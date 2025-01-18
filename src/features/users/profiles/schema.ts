import { relations } from 'drizzle-orm'
import { boolean, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'

import { timestamps } from '@/db/helper'
import { users } from '@/db/schema'

const profiles = pgTable('profiles', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  name: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 256 }),
  location: varchar({ length: 256 }),
  image: varchar({ length: 256 }),
  disabled: boolean().notNull(),
  bio: text(),
  userId: uuid()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  ...timestamps,
})

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}))

export default profiles
