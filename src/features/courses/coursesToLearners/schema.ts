import { relations } from 'drizzle-orm'
import {
  bigint,
  date,
  integer,
  pgTable,
  primaryKey,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

import { courses, users } from '@/db/schema'

/**
 * This schema is to track
 * 1. The learners application for a course
 * 2. The learners enrollment for a course
 */

const coursesToLearners = pgTable(
  'courses_to_learners',
  {
    courseId: uuid()
      .references(() => courses.id, { onDelete: 'cascade' })
      .notNull(),
    learnerId: uuid()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    amount: integer().notNull(),
    date: date({ mode: 'string' }).defaultNow().notNull(),
    paidAt: date(),
    paystackReference: varchar({ length: 320 }).notNull().unique(),
    paystackTransactionId: bigint({ mode: 'number' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.courseId, t.learnerId] }),
    unq: unique().on(t.courseId, t.learnerId),
  })
)

export const coursesToLearnersRelations = relations(
  coursesToLearners,
  ({ one }) => ({
    course: one(courses, {
      fields: [coursesToLearners.courseId],
      references: [courses.id],
    }),
    learner: one(users, {
      fields: [coursesToLearners.learnerId],
      references: [users.id],
    }),
  })
)

export default coursesToLearners
