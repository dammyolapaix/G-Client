import { courses } from '@/db/schema'
import { Columns } from '@/types'

export type Course = typeof courses.$inferSelect

export type InsertCourse = typeof courses.$inferInsert

export type CourseRelationships = {
  instructor: { id: string; profile: { name: string } | null }
}

export type CourseWithRelationships = Course & CourseRelationships

type SingleCourseQuery =
  | { id: Course['id']; slug?: never }
  | { slug: Course['slug']; id?: never }

export type RetrieveCourse = SingleCourseQuery

export type ListCourse = Partial<Omit<Course, 'id'>> & Columns<Course>
