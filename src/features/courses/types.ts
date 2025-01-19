import { courses } from '@/db/schema'

export type Course = typeof courses.$inferSelect

export type InsertCourse = typeof courses.$inferInsert
