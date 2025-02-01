'use client'

import { useActionState } from 'react'

import CustomFormInput from '@/components/custom-form-inputs'
import ErrorMessage from '@/components/error-message'
import SubmitButton from '@/components/submit-button'
import { verifyEmailAction } from '@/features/users/auth/actions'

type Props = {
  authUserEmail: string
}

export function VerifyEmailForm({ authUserEmail }: Props) {
  const [state, formAction] = useActionState(verifyEmailAction, {})

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && <ErrorMessage message={state.error} />}

      <h1 className="text-2xl font-bold text-primary">Verify your email</h1>

      <p>
        Enter the verification code sent to your email{' '}
        <span className="font-bold">{authUserEmail}</span>
      </p>

      <CustomFormInput
        formElement="input"
        inputType="otp"
        name="otp"
        required
        errors={state?.errors?.otp}
      />

      <SubmitButton cta="Verify Email" />

      <div className="text-center text-sm">
        Didn&apos;t receive a code?{' '}
        <div className="text-primary underline underline-offset-4">
          Resend code
        </div>
      </div>
    </form>
  )
}
