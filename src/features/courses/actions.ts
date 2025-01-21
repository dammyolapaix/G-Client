'use server'

import { redirect } from 'next/navigation'

import { z } from 'zod'

import auth from '@/lib/auth'
import { DASHBOARD_COURSES_ROUTE } from '@/lib/routes'

import course from '.'
import { InsertCourse } from './types'

export const createCourseAction = auth.middlewares.validatedActionWithUser(
  course.validations.create,
  ['admin'],
  async (
    state: z.infer<typeof course.validations.create>,
    formData: FormData,
    authUser
  ) => {
    console.log(state, authUser)

    await course.services.create(state as InsertCourse)
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
