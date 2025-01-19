import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, unique, uuid } from 'drizzle-orm/pg-core'

import { courses, stacks } from '@/db/schema'

const coursesToStacks = pgTable(
  'courses_to_stacks',
  {
    courseId: uuid()
      .references(() => courses.id, { onDelete: 'cascade' })
      .notNull(),
    stackId: uuid()
      .references(() => stacks.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.courseId, t.stackId] }),
    unq: unique().on(t.courseId, t.stackId),
  })
)

export const coursesToStacksRelations = relations(
  coursesToStacks,
  ({ one }) => ({
    course: one(courses, {
      fields: [coursesToStacks.courseId],
      references: [courses.id],
    }),
    stack: one(stacks, {
      fields: [coursesToStacks.stackId],
      references: [stacks.id],
    }),
  })
)

export default coursesToStacks
