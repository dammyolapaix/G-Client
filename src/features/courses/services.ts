import 'server-only'

import { eq } from 'drizzle-orm'

import db from '@/db'
import { courses } from '@/db/schema'

import { InsertCourse, RetrieveCourse } from './types'

export default class CourseServices {
  create = async (courseInfo: InsertCourse) =>
    await db.insert(courses).values(courseInfo)

  /**
   * Get single course by query
   */
  retrieve = async (query: RetrieveCourse) =>
    await db.query.courses.findFirst({
      where: query.id
        ? eq(courses.id, query.id)
        : query.slug
          ? eq(courses.slug, query.slug)
          : undefined,
    })
}
