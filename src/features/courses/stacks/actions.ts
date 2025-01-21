'use server'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { redirect } from 'next/navigation'

import { z } from 'zod'

import auth from '@/lib/auth'
import { DASHBOARD_STACKS_ROUTE } from '@/lib/routes'

import stack from '.'

export const createStackAction = auth.middlewares.validatedActionWithUser(
  stack.validations.create,
  ['admin'],
  async (
    state: z.infer<typeof stack.validations.create>,
    formData: FormData,
    authUser
  ) => {
    const { slug } = state

    const stackExist = await stack.services.retrieve({ slug: slug! })

    if (stackExist) return { error: 'Stack already exist' }

    await stack.services.create({ ...state, slug: slug! })

    redirect(DASHBOARD_STACKS_ROUTE)
  }
)
