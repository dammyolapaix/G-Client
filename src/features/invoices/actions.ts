'use server'

import { redirect } from 'next/navigation'

import { z } from 'zod'

import course from '@/features/courses'
import user from '@/features/users'
import auth from '@/lib/auth'
import { DASHBOARD_INVOICES_ROUTE } from '@/lib/routes'

import invoice from '.'
import { UserWithRelationships } from '../users/types'

export const createInvoiceAction = auth.middlewares.validatedActionWithUser(
  invoice.validations.create,
  ['admin'],
  async (state: z.infer<typeof invoice.validations.create>) => {
    const [courseData, learner] = await Promise.all([
      course.services.retrieve({ id: state.courseId }),
      user.services.retrieve({
        id: state.learnerId,
        with: { profile: true },
      }),
    ])

    if (!courseData) {
      return {
        form: state,
        error: 'Course not found',
      }
    }

    if (!learner) {
      return {
        form: state,
        error: 'Learner not found',
      }
    }

    await invoice.services.create({
      ...state,
      course: courseData,
      learner: learner as unknown as Omit<UserWithRelationships, 'password'>,
    })

    redirect(DASHBOARD_INVOICES_ROUTE)
  }
)
