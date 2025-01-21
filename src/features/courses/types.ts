import { courses } from '@/db/schema'

export type Course = typeof courses.$inferSelect

export type InsertCourse = typeof courses.$inferInsert

type SingleCourseQuery =
  | { id: Course['id']; slug?: never }
  | { slug: Course['slug']; id?: never }

export type RetrieveCourse = SingleCourseQuery

export type ListCourse = Partial<Omit<Course, 'id'>>
