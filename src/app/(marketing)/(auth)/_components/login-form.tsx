'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import CustomFormInput from '@/components/custom-form-inputs'
import SubmitButton from '@/components/submit-button'
import SuccessErrorMessage from '@/components/success-error-message'
import { Label } from '@/components/ui/label'
import { loginAction } from '@/features/users/auth/actions'
import { REGISTER_ROUTE } from '@/lib/routes'
import { cn } from '@/lib/utils'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const [state, formAction] = useActionState(loginAction, {})

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
          Login to your account
        </h2>
        <div className="grid gap-6">
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
          <SubmitButton cta="Login" />
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href={REGISTER_ROUTE} className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  )
}
