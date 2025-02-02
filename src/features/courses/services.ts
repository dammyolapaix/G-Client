import 'server-only'

import { and, eq, ilike } from 'drizzle-orm'

import db from '@/db'
import { courses } from '@/db/schema'
import { INTERNAL_ERROR_MESSAGE } from '@/lib/constants'
import paystack from '@/lib/payments/paystack'
import { TransactionSuccessResponse } from '@/lib/payments/types'

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
    isCompletingCoursePurchase,
  }: {
    learnerId: string
    courseId: string
    amount: number
    learnerEmail: string
    isCompletingCoursePurchase: boolean | undefined
  }) => {
    /**
     * @todo
     * Steps
     * 1. Check if user has a completed profile
     * 2. Only learner can purchase a course
     * 3. Check if user has already purchase the course to avoid duplicate purchase of course
     * 4. Create invoice and set invoiceId as the paystack reference
     */

    const transaction = await paystack.initializeTransaction({
      amount: amount.toString(),
      currency: 'GHS',
      email: learnerEmail,
    })

    if (!transaction) throw new Error(INTERNAL_ERROR_MESSAGE)

    if (!isCompletingCoursePurchase)
      await courseToLearner.services.create({
        learnerId,
        courseId,
        amount,
        paystackReference: transaction.data.reference,
      })

    if (isCompletingCoursePurchase)
      await courseToLearner.services.update({
        learnerId,
        courseId,
        paystackReference: transaction.data.reference,
      })

    return { transactionAuthorizationUrl: transaction.data.authorization_url }
  }

  enrollLearnerToCourse = async ({
    amount,
    status,
    paid_at: paidAt,
    reference: paystackReference,
    id: paystackTransactionId,
  }: TransactionSuccessResponse) => {
    // This may never occur, just an extra check
    const transactionExist = await courseToLearner.services.retrieve({
      paystackReference,
    })

    if (!transactionExist) throw new Error(INTERNAL_ERROR_MESSAGE)

    if (transactionExist.paidAt) return

    // This may never occur, just an extra check. We'll be listening to a 'charge.success' event
    if (
      status !== 'success' ||
      paidAt === null ||
      amount !== transactionExist.amount
    )
      throw new Error(INTERNAL_ERROR_MESSAGE)

    const { courseId, learnerId } = transactionExist

    // Enroll Learner
    await courseToLearner.services.update({
      courseId,
      learnerId,
      paidAt,
      paystackTransactionId,
    })
  }
}
