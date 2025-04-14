import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import auth from '@/lib/auth'
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from '@/lib/routes'

import AuthLayout from '../_components/auth-layout'
import { VerifyEmailForm } from '../_components/verify-email-form'

type Props = {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage(props: Props) {
  const [searchParams, authUser] = await Promise.all([
    props.searchParams,
    auth.utils.getAuthUser({ with: { profile: true } }),
  ])

  if (!authUser) redirect(LOGIN_ROUTE)

  if (authUser.emailVerified) redirect(DASHBOARD_ROUTE)

  return (
    <Suspense>
      <AuthLayout>
        <VerifyEmailForm
          token={searchParams.token}
          authUserEmail={authUser.email}
        />
      </AuthLayout>
    </Suspense>
  )
}
