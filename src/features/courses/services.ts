import 'server-only'

import { and, eq, ilike } from 'drizzle-orm'

import db from '@/db'
import { courses } from '@/db/schema'

import { InsertCourse, ListCourse, RetrieveCourse } from './types'

export default class CourseServices {
  create = async (courseInfo: InsertCourse) =>
    await db.insert(courses).values(courseInfo)

  /**
   * Get course
   */
  list = async (query?: ListCourse) =>
    await db.query.courses.findMany({
      where: and(
        query?.title ? ilike(courses.title, `%${query.title}%`) : undefined,
        query?.slug ? eq(courses.slug, query.slug) : undefined
      ),
      with: {
        instructor: {
          columns: { id: true },
          with: {
            profile: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    })

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
