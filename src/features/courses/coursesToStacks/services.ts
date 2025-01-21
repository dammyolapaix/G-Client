import 'server-only'

import { and, eq } from 'drizzle-orm'

import db from '@/db'
import { coursesToStacks } from '@/db/schema'
import { INTERNAL_ERROR_MESSAGE } from '@/lib/constants'

import { CourseToStack, InsertCourseToStack } from './types'

export default class CourseToStackServices {
  /**
   * Create CourseToStack
   */
  create = async (courseToStackInfo: InsertCourseToStack) => {
    const [courseToStack] = await db
      .insert(coursesToStacks)
      .values(courseToStackInfo)
      .returning()

    if (!courseToStack) throw new Error(INTERNAL_ERROR_MESSAGE)

    return courseToStack
  }

  retrieve = async (query: CourseToStack) =>
    await db.query.coursesToStacks.findFirst({
      where: and(
        eq(coursesToStacks.courseId, query.courseId),
        eq(coursesToStacks.stackId, query.stackId)
      ),
    })
}
