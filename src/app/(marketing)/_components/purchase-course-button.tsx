'use client'

import { useActionState } from 'react'

import SubmitButton from '@/components/submit-button'
import SuccessErrorMessage from '@/components/success-error-message'
import { purchaseCourseAction } from '@/features/courses/actions'

type Props = {
  courseId: string
}

export function PurchaseCourseButton({ courseId }: Props) {
  const [state, formAction] = useActionState(purchaseCourseAction, {})

  return (
    <div>
      {state?.error && (
        <SuccessErrorMessage messageType="error" message={state.error} />
      )}

      <form action={formAction}>
        <input
          type="text"
          name="courseId"
          defaultValue={courseId}
          className="hidden"
        />

        <SubmitButton cta="Purchase Course" />
      </form>
    </div>
  )
}
