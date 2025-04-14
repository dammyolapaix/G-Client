'use client'

import { useActionState, useEffect, useState } from 'react'

import CustomFormInput from '@/components/custom-form-inputs'
import SubmitButton from '@/components/submit-button'
import SuccessErrorMessage from '@/components/success-error-message'
import { purchaseCourseAction } from '@/features/courses/actions'
import { CourseWithRelationships } from '@/features/courses/types'
import { UserWithRelationships } from '@/features/users/types'
import { PAYMENT_TYPES } from '@/lib/constants'
import utils from '@/lib/utils'

type Props = {
  authUser: UserWithRelationships
  courses: CourseWithRelationships[]
}

type PAYMENT_TYPE = (typeof PAYMENT_TYPES)[number]

export default function RegisterCourseForm({ authUser, courses }: Props) {
  const [state, formAction] = useActionState(purchaseCourseAction, {})

  const [paymentType, setPaymentType] = useState<PAYMENT_TYPE | undefined>(
    undefined
  )

  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(
    undefined
  )

  const [selectedCourseName, setSelectedCourseName] = useState<
    string | undefined
  >(undefined)

  const filteredCourses = courses.map(
    ({ title, price }) => `${title} - GHS ${utils.formatToMoney(price)}`
  )

  const authUserIsLearner = authUser.role === 'learner'

  useEffect(() => {
    if (selectedCourseName) {
      setSelectedCourseId(
        courses.find(
          ({ title, price }) =>
            `${title} - GHS ${utils.formatToMoney(price)}`.trim() ===
            selectedCourseName.trim()
        )?.id
      )
    }
  }, [courses, selectedCourseName])

  return (
    <form action={formAction}>
      {state?.error && (
        <SuccessErrorMessage messageType="error" message={state.error} />
      )}

      <div className="mb-5">
        <CustomFormInput
          formElement="input"
          inputType="text"
          name="name"
          label="Full name"
          defaultValue={authUser.profile?.name}
          disabled
        />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-5">
        <CustomFormInput
          formElement="input"
          inputType="text"
          name="email"
          label="Email"
          defaultValue={authUser.email}
          disabled
        />

        <CustomFormInput
          formElement="input"
          inputType="text"
          name="location"
          label="Location"
          defaultValue={authUser.profile?.location || undefined}
          disabled
        />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-5">
        <CustomFormInput
          formElement="input"
          inputType="text"
          name="email"
          label="Disabled"
          defaultValue={
            authUser.profile?.disabled === true
              ? 'Yes'
              : authUser.profile?.disabled === false
                ? 'No'
                : undefined
          }
          disabled
        />

        <CustomFormInput
          formElement="input"
          inputType="text"
          name="phone"
          label="Phone"
          defaultValue={authUser.profile?.phone || undefined}
          disabled
        />
      </div>

      <div className="mb-5">
        <CustomFormInput
          formElement="select"
          name=""
          label="Module"
          placeholder="Select Module"
          selectItems={filteredCourses}
          selectOnValueChange={setSelectedCourseName}
          errors={state.errors?.courseId}
          required
        />

        <input type="hidden" name="courseId" value={selectedCourseId} />
      </div>

      <div className="mb-5">
        <CustomFormInput
          formElement="select"
          name="type"
          label="Type"
          placeholder="Select payment type"
          selectItems={PAYMENT_TYPES as unknown as string[]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          selectOnValueChange={setPaymentType}
          required
        />

        <input type="hidden" name="paymentType" value={paymentType} />
      </div>

      {paymentType === 'Partial' && (
        <div className="mb-5">
          <CustomFormInput
            formElement="input"
            inputType="text"
            name="amount"
            label="Amount"
            placeholder="250"
            defaultValue={state?.form?.amount ? state?.form?.amount : undefined}
            errors={state.errors?.amount}
            required
          />
        </div>
      )}

      <div className="mb-5">
        <CustomFormInput
          formElement="textarea"
          inputType="text"
          name="description"
          label="Description"
          defaultValue={authUser.profile?.bio || undefined}
          disabled
        />
      </div>

      <div className="mb-5">
        <SubmitButton
          cta={authUserIsLearner ? 'Enroll' : 'Only learners can enroll'}
          disabled={!authUserIsLearner}
          className="w-full"
        />
      </div>
    </form>
  )
}
