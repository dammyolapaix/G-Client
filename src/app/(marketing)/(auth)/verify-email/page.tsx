import { redirect } from 'next/navigation'

import auth from '@/lib/auth'
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from '@/lib/routes'

import AuthLayout from '../_components/auth-layout'
import { VerifyEmailForm } from '../_components/verify-email-form'

export default async function RegisterPage() {
  const authUser = await auth.utils.getAuthUser()

  if (!authUser) redirect(LOGIN_ROUTE)

  if (authUser.emailVerified) redirect(DASHBOARD_ROUTE)

  return (
    <AuthLayout
      component={<VerifyEmailForm authUserEmail={authUser.email} />}
    />
  )
}
