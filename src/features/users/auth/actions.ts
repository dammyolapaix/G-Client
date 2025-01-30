'use server'

import { redirect } from 'next/navigation'

import { z } from 'zod'

import auth from '@/lib/auth'
import { DASHBOARD_ROUTE } from '@/lib/routes'

import user from '..'

export const loginAction = auth.middlewares.validatedAction(
  user.auth.validations.login,
  async (
    state: z.infer<typeof user.auth.validations.login>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formData: FormData
  ) => {
    const { email, password } = state

    const foundUser = await user.services.retrieve({
      email,
      password: true, // Include user password
    })

    if (!foundUser)
      return {
        form: state,
        error: 'Invalid credentials. Please try again.',
      }

    const isPasswordValid = await auth.utils.comparePasswords(
      password,
      foundUser.password!
    )

    if (!isPasswordValid)
      return {
        form: state,
        error: 'Invalid credentials. Please try again.',
      }

    // Set session
    if (foundUser)
      await auth.utils.setSession({
        id: foundUser.id,
      })

    redirect(DASHBOARD_ROUTE)
  }
)

export const registerAction = auth.middlewares.validatedAction(
  user.auth.validations.register,
  async (
    state: z.infer<typeof user.auth.validations.register>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formData: FormData
  ) => {
    const { email, password } = state

    const foundUser = await user.services.retrieve({ email })

    if (foundUser)
      return {
        form: state,
        error: 'You already have an account, please login',
      }

    const passwordHash = await auth.utils.hashPassword(password)

    const createdUser = await user.services.register({
      ...state,
      password: passwordHash,
    })

    // Set session
    await auth.utils.setSession({ id: createdUser.id })

    redirect(DASHBOARD_ROUTE)
  }
)

export const completeProfileAction = auth.middlewares.validatedActionWithUser(
  user.auth.validations.completeProfile,
  ['learner'],
  async (
    state: Omit<
      z.infer<typeof user.auth.validations.completeProfile>,
      'disabled'
    > & { disabled: boolean | string },
    formData: FormData,
    authUser
  ) => {
    await user.services.update(authUser.id, {
      ...state,
      disabled: state.disabled as boolean,
    })

    redirect(DASHBOARD_ROUTE)
  }
)
