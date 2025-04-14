import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { UserWithRelationships } from '@/features/users/types'
import auth from '@/lib/auth'
import { COMPLETE_PROFILE_ROUTE, HOME_ROUTE, LOGIN_ROUTE } from '@/lib/routes'

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

  if (!auth.utils.authUserProfileIsCompleted(authUser as UserWithRelationships))
    redirect(COMPLETE_PROFILE_ROUTE)

  if (authUser.emailVerified) redirect(HOME_ROUTE)

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
