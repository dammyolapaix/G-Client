import 'server-only'

import { and, eq, isNotNull } from 'drizzle-orm'

import db from '@/db'
import { coursesToLearners } from '@/db/schema'
import { INTERNAL_ERROR_MESSAGE } from '@/lib/constants'

import { CourseToLearner, InsertCourseToLearner } from './types'

export default class CourseToLearnerServices {
  create = async (courseToLearnerInfo: InsertCourseToLearner) => {
    const [courseToLearner] = await db
      .insert(coursesToLearners)
      .values(courseToLearnerInfo)
      .returning()

    if (!courseToLearner) throw new Error(INTERNAL_ERROR_MESSAGE)

    return courseToLearner
  }

  update = async (
    courseToLearnerInfo: Pick<InsertCourseToLearner, 'courseId' | 'learnerId'> &
      Partial<Omit<InsertCourseToLearner, 'courseId' | 'learnerId'>>
  ) => {
    const { courseId, learnerId, ...rest } = courseToLearnerInfo

    const [courseToLearner] = await db
      .update(coursesToLearners)
      .set(rest)
      .where(
        and(
          eq(coursesToLearners.learnerId, courseToLearnerInfo.learnerId),
          eq(coursesToLearners.courseId, courseToLearnerInfo.courseId)
        )
      )
      .returning()

    if (!courseToLearner) throw new Error(INTERNAL_ERROR_MESSAGE)

    return courseToLearner
  }

  retrieve = async (
    query: Partial<
      Pick<CourseToLearner, 'courseId' | 'learnerId' | 'paystackReference'>
    > & {
      paidAtIsNotNull?: true
    }
  ) =>
    await db.query.coursesToLearners.findFirst({
      where: and(
        query.courseId
          ? eq(coursesToLearners.courseId, query.courseId)
          : undefined,
        query.learnerId
          ? eq(coursesToLearners.learnerId, query.learnerId)
          : undefined,
        query.paystackReference
          ? eq(coursesToLearners.paystackReference, query.paystackReference)
          : undefined,
        query.paidAtIsNotNull ? isNotNull(coursesToLearners.paidAt) : undefined
      ),
    })

  list = async () =>
    await db.query.coursesToLearners.findMany({
      where: and(isNotNull(coursesToLearners.paidAt)),
      with: {
        course: true,
        learner: { columns: { password: false }, with: { profile: true } },
      },
    })
}
