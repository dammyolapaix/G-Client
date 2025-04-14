import 'server-only'

import { and, eq, ilike } from 'drizzle-orm'

import db from '@/db'
import { courses, coursesToLearners, invoices } from '@/db/schema'
import { env } from '@/env/server'
import { INTERNAL_ERROR_MESSAGE } from '@/lib/constants'
import paystack from '@/lib/payments/paystack'
import { TransactionSuccessResponse } from '@/lib/payments/types'

import invoice from '../invoices'
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

  initializeCoursePurchase = async ({
    courseId,
    learnerId,
    amount,
    learnerEmail,
    hasAttemptedCoursePurchase,
  }: {
    learnerId: string
    courseId: string
    amount: number
    learnerEmail: string
    hasAttemptedCoursePurchase: boolean
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
      callback_url: `${env.BASE_URL}/confirm-payment?courseId=${courseId}`,
    })

    if (!transaction) throw new Error(INTERNAL_ERROR_MESSAGE)

    await db.transaction(async (tx) => {
      if (hasAttemptedCoursePurchase) {
        await tx
          .update(invoices)
          .set({
            amount,
            paystackReference: transaction.data.reference,
            paymentLink: transaction.data.authorization_url,
          })
          .where(
            and(
              eq(invoices.courseId, courseId),
              eq(invoices.learnerId, learnerId)
            )
          )
      } else {
        await tx.insert(invoices).values({
          amount,
          courseId,
          learnerId,
          paystackReference: transaction.data.reference,
          paymentLink: transaction.data.authorization_url,
        })
      }
    })

    return { transactionAuthorizationUrl: transaction.data.authorization_url }
  }

  purchaseCourse = async ({
    amount,
    status,
    paid_at: paidAt,
    reference: paystackReference,
    id: paystackTransactionId,
  }: TransactionSuccessResponse) => {
    // This may never occur, just an extra check
    const transactionExist = await invoice.services.retrieve({
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

    await db.transaction(async (tx) => {
      // Complete course payment/purchase
      const updatedInvoice = await tx
        .update(invoices)
        .set({ paidAt, paystackTransactionId, status: 'paid' })
        .where(
          and(
            eq(invoices.learnerId, learnerId),
            eq(invoices.courseId, courseId)
          )
        )
        .returning({ id: invoices.id })

      if (!updatedInvoice) {
        tx.rollback()
        throw new Error(INTERNAL_ERROR_MESSAGE)
      }

      // Enroll Student
      await tx
        .insert(coursesToLearners)
        .values({
          courseId,
          learnerId,
          coursePrice: transactionExist.course.price,
        })
        .onConflictDoNothing({
          target: [coursesToLearners.learnerId, coursesToLearners.courseId],
        })
    })
  }
}

/**
 * 1. Compared register users and users who enrolled in a course
 * 2. Export report as pdf or excel
 * 3. View paid or unpaid invoices
 */
