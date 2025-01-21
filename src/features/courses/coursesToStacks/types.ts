import { coursesToStacks } from '@/db/schema'

export type CourseToStack = typeof coursesToStacks.$inferSelect

export type InsertCourseToStack = typeof coursesToStacks.$inferInsert
