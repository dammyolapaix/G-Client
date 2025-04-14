import { relations, sql } from 'drizzle-orm'
import {
  bigint,
  date,
  integer,
  pgTable,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

import { timestamps } from '@/db/helper'
import { courses, invoiceStatusEnum, users } from '@/db/schema'

const sevenDaysFromNow = sql`NOW() + INTERVAL '7 days'`

const invoices = pgTable('invoices', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  courseId: uuid()
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  learnerId: uuid()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  amount: integer().notNull(),
  status: invoiceStatusEnum().default('pending'),
  paidAt: date({ mode: 'string' }),
  paystackReference: varchar({ length: 320 }).notNull().unique(),
  paystackTransactionId: bigint({ mode: 'number' }),
  paymentLink: varchar({ length: 320 }).notNull().unique(),
  dueDate: date({ mode: 'string' }).default(sevenDaysFromNow),
  ...timestamps,
})

export const invoicesRelations = relations(invoices, ({ one }) => ({
  course: one(courses, {
    fields: [invoices.courseId],
    references: [courses.id],
  }),
  learner: one(users, {
    fields: [invoices.learnerId],
    references: [users.id],
  }),
}))

export default invoices
