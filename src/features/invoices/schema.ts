import { relations } from 'drizzle-orm'
import { bigint, date, integer, pgTable, uuid } from 'drizzle-orm/pg-core'

import { timestamps } from '@/db/helper'
import { users } from '@/db/schema'

const invoices = pgTable('invoices', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  amount: integer().notNull(),
  date: date({ mode: 'string' }).defaultNow(),
  paidAt: date(),
  paystackTransactionId: bigint({ mode: 'number' }),
  userId: uuid()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  ...timestamps,
})

export const invoicesRelations = relations(invoices, ({ one }) => ({
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
}))

export default invoices
