import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import auth from '@/lib/auth'
import { HOME_ROUTE } from '@/lib/routes'

import AuthLayout from '../_components/auth-layout'
import { LoginForm } from '../_components/login-form'

export default async function LoginPage() {
  const authUser = await auth.utils.getAuthUser()

  if (authUser) redirect(HOME_ROUTE)
  return (
    <Suspense>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </Suspense>
  )
}
