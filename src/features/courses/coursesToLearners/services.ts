import 'server-only'

import { and, count, eq, getTableColumns, ilike } from 'drizzle-orm'

import db from '@/db'
import { courses, coursesToLearners, profiles, users } from '@/db/schema'
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

  retrieve = async (
    query: Partial<Pick<CourseToLearner, 'courseId' | 'learnerId'>> & {
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
          : undefined
      ),
    })

  list = async (
    query?: Partial<
      Pick<CourseToLearner, 'courseId' | 'learnerId'> & {
        learnerName: string
      }
    >
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...usersTable } = getTableColumns(users)

    return await db
      .select({
        ...getTableColumns(coursesToLearners),
        course: { ...getTableColumns(courses) },
        profile: { ...getTableColumns(profiles) },
        user: { ...usersTable },
      })
      .from(coursesToLearners)
      .innerJoin(courses, eq(courses.id, coursesToLearners.courseId))
      .innerJoin(users, eq(users.id, coursesToLearners.learnerId))
      .innerJoin(profiles, eq(profiles.userId, users.id))
      .where(
        and(
          // query?.invoiceStatus === 'paid'
          //   ? isNotNull(coursesToLearners.paidAt)
          //   : query?.invoiceStatus === 'pending'
          //     ? isNull(coursesToLearners.paidAt)
          //     : undefined,
          query?.courseId
            ? eq(coursesToLearners.courseId, query.courseId)
            : undefined,
          query?.learnerId
            ? eq(coursesToLearners.learnerId, query.learnerId)
            : undefined,
          query?.learnerName
            ? ilike(profiles.name, `%${query.learnerName}%`)
            : undefined
        )
      )
  }

  totalLearners = async () => {
    const [totalLearners] = await db
      .select({
        count: count(),
      })
      .from(coursesToLearners)

    return totalLearners.count
  }
}
