'use server'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { redirect } from 'next/navigation'

import { z } from 'zod'

import auth from '@/lib/auth'
import { DASHBOARD_COURSES_ROUTE } from '@/lib/routes'
import utils from '@/lib/utils'

import course from '.'
import invoice from '../invoices'
import user from '../users'
import courseToLearner from './coursesToLearners'

export const createCourseAction = auth.middlewares.validatedActionWithUser(
  course.validations.create,
  ['admin'],
  async (
    state: z.infer<typeof course.validations.create>,
    formData: FormData,
    authUser
  ) => {
    const { slug } = state

    const courseExist = await course.services.retrieve({ slug: slug! })

    if (courseExist)
      return {
        form: state,
        error: 'Course already exist',
      }

    await course.services.create({ ...state, slug: slug! })

    redirect(DASHBOARD_COURSES_ROUTE)
  }
)

export const updateCourseAction = auth.middlewares.validatedActionWithUser(
  course.validations.create,
  ['admin'],
  async (
    state: z.infer<typeof course.validations.create>,
    formData: FormData,
    authUser
  ) => {
    console.log(state, authUser)
    redirect(DASHBOARD_COURSES_ROUTE)
  }
)

export const purchaseCourseAction = auth.middlewares.validatedActionWithUser(
  course.validations.purchase,
  ['learner'],
  async (
    state: z.infer<typeof course.validations.purchase>,
    formData: FormData,
    authUser
  ) => {
    const { id: learnerId, email: learnerEmail } = authUser
    const { courseId, amount } = state

    const form = {
      ...state,
      amount: state.amount ? state.amount / 100 : undefined,
    }

    /**
     * Validations
     *
     * 1. Does course exist
     * 2. Is learner enrolled in a course
     * 3. Has learner paid fully
     * 3.
     */

    const learnerProfile = await user.services.getUserProfile(authUser.id)

    const authUserWithProfile = {
      ...authUser,
      profile: learnerProfile ? learnerProfile : null,
    }

    if (!auth.utils.authUserProfileIsCompleted(authUserWithProfile))
      return {
        form,
        error: 'Please complete your profile before purchasing a course',
      }

    const [courseExist, enrolledLearner] = await Promise.all([
      course.services.retrieve({ id: state.courseId }),
      courseToLearner.services.retrieve({
        courseId,
        learnerId,
      }),
    ])

    if (!courseExist) return { error: 'Course not found' }

    const coursePrice = courseExist.price

    if (!enrolledLearner && amount) {
      const unEnrolledLearnerIsPayingHigher = amount > coursePrice

      if (unEnrolledLearnerIsPayingHigher)
        return {
          form,
          error: `Please pay an amount of GHC ${utils.formatToMoney(coursePrice)} or less`,
        }
    }

    if (enrolledLearner) {
      // Check if learner has fully paid, then throw an error if "YES" to prevent multiple enrollment
      const { totalPaidInvoiceAmount } = await invoice.services.totalInvoice({
        courseId,
        learnerId,
      })

      if (totalPaidInvoiceAmount === enrolledLearner.coursePrice)
        return {
          form,
          error:
            "You've already enrolled and fully paid for this course, please visit your dashboard to start learning!",
        }

      const isPayingHigher =
        totalPaidInvoiceAmount + amount! > enrolledLearner.coursePrice

      const amountOwed = enrolledLearner.coursePrice - totalPaidInvoiceAmount

      if (!isPayingHigher)
        return {
          form,
          error: `Please pay an amount of GHC ${utils.formatToMoney(amountOwed)} or less`,
        }
    }

    const learnerHasAttemptedCoursePurchase = await invoice.services.retrieve({
      courseId,
      learnerId,
      status: 'pending',
    })

    // Helps to indicate if the courseToLearner is to be created or updated
    const hasAttemptedCoursePurchase = learnerHasAttemptedCoursePurchase
      ? true
      : false

    const purchaseCourse = await course.services.initializeCoursePurchase({
      amount: amount ?? coursePrice,
      courseId,
      learnerId,
      learnerEmail,
      hasAttemptedCoursePurchase,
    })

    redirect(purchaseCourse.transactionAuthorizationUrl)
  }
)
