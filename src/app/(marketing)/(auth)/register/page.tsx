import { Suspense } from 'react'

import AuthLayout from '../_components/auth-layout'
import { RegisterForm } from '../_components/register-form'

export default function RegisterPage() {
  return (
    <Suspense>
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </Suspense>
  )
}
