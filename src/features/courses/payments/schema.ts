import { relations } from 'drizzle-orm'
import {
  bigint,
  date,
  integer,
  pgTable,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

import { courses, users } from '@/db/schema'

const coursePayments = pgTable('course_payments', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  courseId: uuid()
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  learnerId: uuid()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  amount: integer().notNull(),
  paidAt: date(),
  paystackReference: varchar({ length: 320 }).notNull().unique(),
  paystackTransactionId: bigint({ mode: 'number' }),
})

export const coursePaymentsRelations = relations(coursePayments, ({ one }) => ({
  course: one(courses, {
    fields: [coursePayments.courseId],
    references: [courses.id],
  }),
  learner: one(users, {
    fields: [coursePayments.learnerId],
    references: [users.id],
  }),
}))

export default coursePayments
