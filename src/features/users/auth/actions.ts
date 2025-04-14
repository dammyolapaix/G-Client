'use server'

import { redirect } from 'next/navigation'

import { z } from 'zod'

import VerifyEmail from '@/components/email/verify-email'
import auth from '@/lib/auth'
import email from '@/lib/emails'
import {
  COMPLETE_PROFILE_ROUTE,
  DASHBOARD_ROUTE,
  HOME_ROUTE,
  VERIFY_EMAIL_ROUTE,
} from '@/lib/routes'

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
    await auth.utils.setSession({
      id: foundUser.id,
    })

    const redirectRoute =
      foundUser.role === 'admin' ? DASHBOARD_ROUTE : HOME_ROUTE

    redirect(redirectRoute)
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

    redirect(VERIFY_EMAIL_ROUTE)
  }
)

export const verifyEmailAction = auth.middlewares.validatedActionWithUser(
  user.auth.validations.verifyEmail,
  ['learner', 'instructor'],
  async (
    state: z.infer<typeof user.auth.validations.verifyEmail>,
    formData: FormData,
    authUser
  ) => {
    if (authUser.emailVerified)
      return {
        form: state,
        error: 'Email already verified',
      }

    const token = auth.utils.getHashedToken(state.otp)

    const userWithValidToken = await user.services.retrieve({
      id: authUser.id,
      token,
      tokenExpiresAtGte: true,
    })

    if (!userWithValidToken)
      return {
        form: state,
        error:
          'Your code is invalid or has expired, please request for a new verification code',
      }

    // Verify user email
    await user.services.update(authUser.id, {
      user: {
        emailVerified: new Date().toISOString(),
        token: null,
        tokenExpiresAt: null,
      },
    })

    redirect(COMPLETE_PROFILE_ROUTE)
  }
)

export const resendTokenAction = auth.middlewares.validatedActionWithUser(
  user.auth.validations.resendToken,
  ['learner', 'instructor'],
  async (
    state: z.infer<typeof user.auth.validations.resendToken>,
    formData: FormData,
    authUser
  ) => {
    if (authUser.emailVerified)
      return {
        form: state,
        error: 'Email already verified',
      }

    const { token, hashedToken, tokenExpiresAt } = auth.utils.getToken({
      tokenType: state.tokenType,
    })

    await user.services.update(authUser.id, {
      user: { token: hashedToken, tokenExpiresAt },
    })

    /**
     * @todo
     *
     * Adjust the email subject and emailTemple for forget password
     */
    await email.send({
      subject: 'Verify Your email',
      to: [authUser.email],
      emailTemplate: VerifyEmail({ verificationCode: token }),
    })

    return {
      success: `We've sent an OTP code to your email "${authUser.email}", please check your inbox"`,
    }
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
      profile: { ...state, disabled: state.disabled as boolean },
    })

    redirect(HOME_ROUTE)
  }
)
