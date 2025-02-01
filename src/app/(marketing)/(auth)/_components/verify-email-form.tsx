'use client'

import { useActionState } from 'react'

import CustomFormInput from '@/components/custom-form-inputs'
import SubmitButton from '@/components/submit-button'
import SuccessErrorMessage from '@/components/success-error-message'
import {
  resendTokenAction,
  verifyEmailAction,
} from '@/features/users/auth/actions'

type Props = {
  authUserEmail: string
}

export function VerifyEmailForm({ authUserEmail }: Props) {
  const [VerifyEmailState, VerifyEmailFormAction] = useActionState(
    verifyEmailAction,
    {}
  )

  const [resendTokenState, resendTokenFormAction] = useActionState(
    resendTokenAction,
    {}
  )

  return (
    <div>
      {VerifyEmailState?.error && (
        <SuccessErrorMessage
          messageType="error"
          message={VerifyEmailState.error}
        />
      )}
      {resendTokenState?.error && (
        <SuccessErrorMessage
          messageType="error"
          message={resendTokenState.error}
        />
      )}
      {resendTokenState?.success && (
        <SuccessErrorMessage
          messageType="success"
          message={resendTokenState.success}
        />
      )}

      <form action={VerifyEmailFormAction} className="flex flex-col gap-6">
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
          errors={VerifyEmailState?.errors?.otp}
        />

        <SubmitButton cta="Verify Email" />
      </form>

      <form action={resendTokenFormAction}>
        <input
          type="text"
          name="tokenType"
          defaultValue="otp"
          className="hidden"
        />

        <div className="text-center text-sm">
          Didn&apos;t receive a code?
          <SubmitButton cta="Resend code" variant="link" />
        </div>
      </form>
    </div>
  )
}
