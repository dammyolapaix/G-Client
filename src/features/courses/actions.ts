'use server'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { redirect } from 'next/navigation'

import { z } from 'zod'

import auth from '@/lib/auth'
import { DASHBOARD_COURSES_ROUTE } from '@/lib/routes'

import course from '.'
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
    const { courseId } = state

    // if (!auth.utils.authUserProfileIsCompleted(authUser))
    //   return {
    //     error: 'Please complete your profile before purchasing a course',
    //   }

    const courseExist = await course.services.retrieve({ id: state.courseId })

    if (!courseExist)
      return {
        error: 'Course does not exist exist',
      }

    const learnerHasAttemptedCoursePurchase =
      await courseToLearner.services.retrieve({ courseId, learnerId })

    // Check if learner has paid for course (enrolled)
    const learnerIsEnrolledToCourse =
      learnerHasAttemptedCoursePurchase &&
      learnerHasAttemptedCoursePurchase.paidAt
        ? true
        : false

    if (learnerIsEnrolledToCourse)
      return {
        error:
          "You've already enrolled to this course, please visit your dashboard to start learning!",
      }

    // Helps to indicate if the courseToLearner is to be created or updated
    const isCompletingCoursePurchase = learnerHasAttemptedCoursePurchase
      ? true
      : false

    const { price: amount } = courseExist

    const purchaseCourse = await course.services.purchaseCourse({
      amount,
      courseId,
      learnerId,
      learnerEmail,
      isCompletingCoursePurchase,
    })

    redirect(purchaseCourse.transactionAuthorizationUrl)
  }
)
