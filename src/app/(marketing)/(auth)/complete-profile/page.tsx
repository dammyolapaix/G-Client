import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { UserWithRelationships } from '@/features/users/types'
import auth from '@/lib/auth'
import { HOME_ROUTE, LOGIN_ROUTE, VERIFY_EMAIL_ROUTE } from '@/lib/routes'

import AuthLayout from '../_components/auth-layout'
import { CompleteProfileForm } from '../_components/complete-profile-form'

export default async function CompleteProfilePage() {
  const authUser = (await auth.utils.getAuthUser({
    with: { profile: true },
  })) as UserWithRelationships

  if (!authUser) redirect(LOGIN_ROUTE)

  if (!authUser.emailVerified) redirect(VERIFY_EMAIL_ROUTE)

  if (auth.utils.authUserProfileIsCompleted(authUser)) redirect(HOME_ROUTE)

  return (
    <Suspense>
      <AuthLayout>
        <CompleteProfileForm />
      </AuthLayout>
    </Suspense>
  )
}
