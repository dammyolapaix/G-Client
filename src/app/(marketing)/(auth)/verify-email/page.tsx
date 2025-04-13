import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import auth from '@/lib/auth'
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from '@/lib/routes'

import AuthLayout from '../_components/auth-layout'
import { VerifyEmailForm } from '../_components/verify-email-form'

export default async function VerifyEmailPage() {
  const authUser = await auth.utils.getAuthUser()

  if (!authUser) redirect(LOGIN_ROUTE)

  if (authUser.emailVerified) redirect(DASHBOARD_ROUTE)

  return (
    <Suspense>
      <AuthLayout
        component={<VerifyEmailForm authUserEmail={authUser.email} />}
      />
    </Suspense>
  )
}
