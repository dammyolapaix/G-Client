import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import auth from '@/lib/auth'
import { HOME_ROUTE } from '@/lib/routes'

import AuthLayout from '../_components/auth-layout'
import { RegisterForm } from '../_components/register-form'

export default async function RegisterPage() {
  const authUser = await auth.utils.getAuthUser()

  if (authUser) redirect(HOME_ROUTE)

  return (
    <Suspense>
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </Suspense>
  )
}
