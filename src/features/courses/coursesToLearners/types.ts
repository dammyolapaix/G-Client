import { coursesToLearners } from '@/db/schema'

export type CourseToLearner = typeof coursesToLearners.$inferSelect

export type InsertCourseToLearner = typeof coursesToLearners.$inferInsert
