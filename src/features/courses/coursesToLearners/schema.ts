import { relations } from 'drizzle-orm'
import { date, pgTable, primaryKey, unique, uuid } from 'drizzle-orm/pg-core'

import { applicationStatusEnum } from '@/db/enums'
import { courses, invoices, users } from '@/db/schema'

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
    invoiceId: uuid()
      .references(() => invoices.id, { onDelete: 'cascade' })
      .notNull(),
    applicationDate: date({ mode: 'string' }).defaultNow().notNull(),
    status: applicationStatusEnum().default('pending').notNull(),
    acceptanceDeclineDate: date({ mode: 'string' }),
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
