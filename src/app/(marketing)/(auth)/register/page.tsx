import AuthLayout from '../_components/auth-layout'
import { RegisterForm } from '../_components/register-form'

export default function RegisterPage() {
  return <AuthLayout component={<RegisterForm />} />
}
