import { relations } from 'drizzle-orm'
import {
  date,
  integer,
  pgTable,
  primaryKey,
  unique,
  uuid,
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
    // The price of the course may change, so we use this to track outstanding course payment since this will be the course price as at the time the learner is enrolling to the course
    coursePrice: integer().notNull(),
    date: date({ mode: 'string' }).defaultNow().notNull(),
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
