'use server'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { redirect } from 'next/navigation'

import { z } from 'zod'

import auth from '@/lib/auth'
import { DASHBOARD_COURSES_ROUTE } from '@/lib/routes'

import courseToStack from '.'

export const createCourseToStackAction =
  auth.middlewares.validatedActionWithUser(
    courseToStack.validations.create,
    ['admin'],
    async (
      state: z.infer<typeof courseToStack.validations.create>,
      formData: FormData,
      authUser
    ) => {
      const courseToStackExist = await courseToStack.services.retrieve(state)

      if (courseToStackExist) return { error: 'CourseToStack already exist' }

      await courseToStack.services.create(state)

      redirect(`${DASHBOARD_COURSES_ROUTE}/${state.courseId}`)
    }
  )
