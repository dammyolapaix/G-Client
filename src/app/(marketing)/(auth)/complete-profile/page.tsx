import AuthLayout from '../_components/auth-layout'
import { CompleteProfileForm } from '../_components/complete-profile-form'

export default function CompletePage() {
  return <AuthLayout component={<CompleteProfileForm />} />
}
