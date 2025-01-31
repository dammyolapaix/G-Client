'use client'

import { useActionState } from 'react'

import CustomFormInput from '@/components/custom-form-inputs'
import ErrorMessage from '@/components/error-message'
import SubmitButton from '@/components/submit-button'
import { completeProfileAction } from '@/features/users/auth/actions'
import { cn } from '@/lib/utils'

export function VerifyEmailForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const [state, formAction] = useActionState(completeProfileAction, {})

  return (
    <form
      action={formAction}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      {state?.error && <ErrorMessage message={state.error} />}

      <h1 className="text-2xl font-bold">Verify your email</h1>

      <p>
        Enter the verification code sent to your email{' '}
        <span className="font-bold">admin@gmail.com</span>
      </p>

      <CustomFormInput
        formElement="input"
        inputType="otp"
        name="otp"
        required
        //   errors={state?.errors?.otp}
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
