import { relations } from 'drizzle-orm'
import { date, integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

import { invoiceStatusEnum } from '@/db/enums'
import { timestamps } from '@/db/helper'
import { users } from '@/db/schema'

const invoices = pgTable('invoices', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  number: varchar({ length: 256 }).notNull(),
  amount: integer().notNull(),
  status: invoiceStatusEnum().default('draft').notNull(),
  date: date({ mode: 'string' }).defaultNow(),
  paidAt: date(),
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
