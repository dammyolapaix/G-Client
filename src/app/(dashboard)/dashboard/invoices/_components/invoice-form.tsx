'use client'

import { useActionState } from 'react'

import CustomFormInput from '@/components/custom-form-inputs'
import SubmitButton from '@/components/submit-button'
import SuccessErrorMessage from '@/components/success-error-message'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Course } from '@/features/courses/types'
import { createInvoiceAction } from '@/features/invoices/actions'
import { UserWithRelationships } from '@/features/users/types'

type Props = {
  courses: Course[]
  learners: Omit<UserWithRelationships, 'password'>[]
}

export default function InvoiceForm({ courses, learners }: Props) {
  const [state, formAction] = useActionState(createInvoiceAction, {})

  const filteredCourses = courses.map((course) => ({
    id: course.id,
    name: course.title,
  }))

  const filteredLearners = learners.map(({ profile }) => ({
    name: profile!.name,
    id: profile!.userId,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Invoice</CardTitle>
        <CardDescription>Create a new invoice for a learner</CardDescription>
      </CardHeader>
      <CardContent>
        {state?.error && (
          <SuccessErrorMessage messageType="error" message={state.error} />
        )}

        <form action={formAction}>
          <div className="mb-5">
            <div className="mb-3 grid grid-cols-1 gap-5 md:grid-cols-2">
              <CustomFormInput
                formElement="combobox"
                label="Course"
                items={filteredCourses}
                query="courseId"
                name="Course"
                defaultValue={state?.form?.courseId}
                errors={state?.errors?.courseId}
                required
              />

              <CustomFormInput
                formElement="combobox"
                label="Learner"
                items={filteredLearners}
                query="learnerId"
                name="Learner"
                defaultValue={state?.form?.learnerId}
                errors={state?.errors?.learnerId}
                required
              />
            </div>

            <div className="mb-3 grid grid-cols-1 gap-5 md:grid-cols-2">
              <CustomFormInput
                formElement="input"
                inputType="text"
                name="amount"
                label="Amount"
                placeholder="Amount"
                defaultValue={
                  state?.form?.amount ? state.form.amount / 100 : undefined
                }
                errors={state?.errors?.amount}
                required
              />

              <CustomFormInput
                formElement="input"
                inputType="date"
                name="dueDate"
                label="Due Date"
                defaultValue={
                  state?.form?.dueDate
                    ? state.form.dueDate.toString()
                    : undefined
                }
                errors={state?.errors?.dueDate}
                required
              />
            </div>
          </div>

          <SubmitButton cta="Create Invoice" />
        </form>
      </CardContent>
    </Card>
  )
}
