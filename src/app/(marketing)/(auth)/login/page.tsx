import { Suspense } from 'react'

import AuthLayout from '../_components/auth-layout'
import { LoginForm } from '../_components/login-form'

export default function LoginPage() {
  return (
    <Suspense>
      <AuthLayout component={<LoginForm />} />
    </Suspense>
  )
}
