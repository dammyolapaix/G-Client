import 'server-only'

import {
  and,
  eq,
  getTableColumns,
  ilike,
  isNotNull,
  isNull,
  sql,
} from 'drizzle-orm'

import db from '@/db'
import {
  coursePayments,
  courses,
  coursesToLearners,
  profiles,
  users,
} from '@/db/schema'
import { INTERNAL_ERROR_MESSAGE } from '@/lib/constants'

import {
  CoursePayment,
  CoursePaymentStatus,
  InsertCoursePayment,
} from './types'

export default class CoursePaymentServices {
  totalCoursePayment = async ({
    courseId,
    learnerId,
  }: Partial<CoursePayment>) => {
    const [totalCoursePayment] = await db
      .select({
        totalCoursePayment:
          sql`COALESCE(sum(${coursePayments.amount}), 0.00)`.mapWith(Number),
      })
      .from(coursePayments)
      .where(
        and(
          courseId ? eq(coursePayments.courseId, courseId) : undefined,
          learnerId ? eq(coursePayments.learnerId, learnerId) : undefined
        )
      )

    return totalCoursePayment
  }

  retrieve = async (
    query: Partial<
      Pick<CoursePayment, 'courseId' | 'learnerId' | 'paystackReference'>
    > & {
      isPaid?: boolean
    }
  ) =>
    await db.query.coursePayments.findFirst({
      where: and(
        query.courseId
          ? eq(coursePayments.courseId, query.courseId)
          : undefined,
        query.learnerId
          ? eq(coursePayments.learnerId, query.learnerId)
          : undefined,
        query.paystackReference
          ? eq(coursePayments.paystackReference, query.paystackReference)
          : undefined,
        query.isPaid === true
          ? isNotNull(coursePayments.paidAt)
          : query.isPaid === false
            ? isNull(coursePayments.paidAt)
            : undefined
      ),
      with: { course: true },
    })

  update = async (
    coursePaymentInfo: Pick<InsertCoursePayment, 'courseId' | 'learnerId'> &
      Partial<Omit<InsertCoursePayment, 'courseId' | 'learnerId'>>
  ) => {
    const { courseId, learnerId, ...rest } = coursePaymentInfo

    const [coursePayment] = await db
      .update(coursePayments)
      .set(rest)
      .where(
        and(
          eq(coursePayments.learnerId, learnerId),
          eq(coursePayments.courseId, courseId)
        )
      )
      .returning()

    if (!coursePayment) throw new Error(INTERNAL_ERROR_MESSAGE)

    return coursePayment
  }

  list = async (
    query?: Partial<
      Pick<CoursePayment, 'courseId' | 'learnerId'> & {
        learnerName: string
        invoiceStatus?: CoursePaymentStatus
      }
    >
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...usersTable } = getTableColumns(users)

    return await db
      .select({
        courseId: coursesToLearners.courseId,
        learnerId: coursesToLearners.learnerId,
        coursePrice: coursesToLearners.coursePrice,
        totalCoursePayment: sql`COALESCE(sum(${coursePayments.amount}), 0.00)`
          .mapWith(Number)
          .as('total_course_payment'),
        status: sql<CoursePaymentStatus>`
          CASE
            WHEN ${coursesToLearners.coursePrice} = COALESCE(sum(${coursePayments.amount}), 0.00) THEN 'Paid'
            ELSE 'Pending'
          END
        `,
        paidAt: sql<string>`MAX(${coursePayments.paidAt})`,
        course: { ...getTableColumns(courses) },
        profile: { ...getTableColumns(profiles) },
        user: { ...usersTable },
      })
      .from(coursePayments)
      .innerJoin(
        coursesToLearners,
        and(
          eq(coursesToLearners.learnerId, coursePayments.learnerId),
          eq(coursesToLearners.courseId, coursePayments.courseId)
        )
      )
      .innerJoin(courses, eq(courses.id, coursePayments.courseId))
      .innerJoin(users, eq(users.id, coursePayments.learnerId))
      .innerJoin(profiles, eq(profiles.userId, users.id))
      .groupBy(
        coursesToLearners.courseId,
        coursesToLearners.learnerId,
        coursesToLearners.coursePrice,
        courses.id,
        profiles.id,
        users.id
      )
      .where(
        and(
          query?.courseId
            ? eq(coursePayments.courseId, query.courseId)
            : undefined,
          query?.learnerId
            ? eq(coursePayments.learnerId, query.learnerId)
            : undefined,
          query?.learnerName
            ? ilike(profiles.name, `%${query.learnerName}%`)
            : undefined
        )
      )
  }
}
