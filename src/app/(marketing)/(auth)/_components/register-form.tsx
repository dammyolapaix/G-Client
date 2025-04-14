'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import CustomFormInput from '@/components/custom-form-inputs'
import SubmitButton from '@/components/submit-button'
import SuccessErrorMessage from '@/components/success-error-message'
import { Label } from '@/components/ui/label'
import { registerAction } from '@/features/users/auth/actions'
import { LOGIN_ROUTE } from '@/lib/routes'
import { cn } from '@/lib/utils'

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const [state, formAction] = useActionState(registerAction, {})

  return (
    <form
      action={formAction}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      {state?.error && (
        <SuccessErrorMessage messageType="error" message={state.error} />
      )}

      <div>
        <h2 className="mb-5 text-center text-2xl font-bold text-primary">
          Register for an account
        </h2>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <CustomFormInput
              formElement="input"
              inputType="text"
              name="name"
              label="Full name"
              placeholder="John Doe"
              defaultValue={state?.form?.name}
              required
              errors={state?.errors?.name}
            />
          </div>

          <div className="grid gap-2">
            <CustomFormInput
              formElement="input"
              inputType="email"
              name="email"
              label="Email"
              placeholder="m@example.com"
              defaultValue={state?.form?.email}
              required
              errors={state?.errors?.email}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password *</Label>
              <Link
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <CustomFormInput
              formElement="input"
              inputType="password"
              name="password"
              defaultValue={state?.form?.password}
              required
              errors={state?.errors?.password}
            />
          </div>
          <SubmitButton cta="Register" />
        </div>
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href={LOGIN_ROUTE} className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </div>
    </form>
  )
}
