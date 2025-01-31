import AuthLayout from '../_components/auth-layout'
import { VerifyEmailForm } from '../_components/verify-email-form'

export default function RegisterPage() {
  return <AuthLayout component={<VerifyEmailForm />} />
}
