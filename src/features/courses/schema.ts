import { relations } from 'drizzle-orm'
import { integer, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'

import { timestamps } from '@/db/helper'
import { coursesToStacks } from '@/db/schema'

const courses = pgTable('courses', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  title: varchar({ length: 320 }).notNull().unique(),
  slug: varchar({ length: 320 }).notNull().unique(),
  price: integer().notNull(),
  description: text().notNull(),
  image: varchar({ length: 320 }).notNull(),
  duration: integer().notNull(), // measures in weeks. 4 weeks will be stored as 4
  ...timestamps,
})

export const coursesRelations = relations(courses, ({ many }) => ({
  stacks: many(coursesToStacks),
}))

export default courses
