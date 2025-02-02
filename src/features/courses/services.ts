import 'server-only'

import { and, eq, ilike } from 'drizzle-orm'

import db from '@/db'
import { courses } from '@/db/schema'
import { INTERNAL_ERROR_MESSAGE } from '@/lib/constants'
import paystack from '@/lib/payments/paystack'

import courseToLearner from './coursesToLearners'
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

  purchaseCourse = async ({
    courseId,
    learnerId,
    amount,
    learnerEmail,
  }: {
    learnerId: string
    courseId: string
    amount: number
    learnerEmail: string
  }) => {
    /**
     * @todo
     * Steps
     * 1. Check if user has a completed profile
     * 2. Only learner can purchase a course
     * 3. Check if user has already purchase the course to avoid duplicate purchase of course
     * 4. Create invoice and set invoiceId as the paystack reference
     */

    const createdCourseToLearner = await courseToLearner.services.create({
      learnerId,
      courseId,
      amount,
    })

    const transaction = await paystack.initializeTransaction({
      amount: amount.toString(),
      currency: 'GHS',
      email: learnerEmail,
      reference: createdCourseToLearner.id,
    })

    if (!transaction) throw new Error(INTERNAL_ERROR_MESSAGE)

    return { transactionAuthorizationUrl: transaction.data.authorization_url }
  }
}
