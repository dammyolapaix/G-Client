'use client'

import { useActionState } from 'react'

import CustomFormInput from '@/components/custom-form-inputs'
import ErrorMessage from '@/components/error-message'
import SubmitButton from '@/components/submit-button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  createCourseAction,
  updateCourseAction,
} from '@/features/courses/actions'
import { Course } from '@/features/courses/types'

type Props = {
  course?: Course
}

export default function CourseForm({ course }: Props) {
  const [state, formAction] = useActionState(
    course ? updateCourseAction : createCourseAction,
    {}
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{course ? 'Edit course' : 'Add new course'}</CardTitle>
        <CardDescription>
          {course
            ? 'Edit the course information in the form below'
            : 'Add the course information in the form below'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state?.error && <ErrorMessage message={state.error} />}

        <form action={formAction}>
          <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {course && (
              <input
                type="text"
                name="id"
                defaultValue={course.id}
                className="hidden"
              />
            )}

            <CustomFormInput
              formElement="input"
              inputType="text"
              name="title"
              label="Title"
              placeholder="Title"
              defaultValue={state?.form?.title || course?.title}
              errors={state?.errors?.title}
              required
            />

            <CustomFormInput
              formElement="input"
              inputType="text"
              name="price"
              label="Price"
              placeholder="Price"
              defaultValue={
                state?.form?.price
                  ? state.form.price / 100
                  : course?.price
                    ? course.price / 100
                    : undefined
              }
              errors={state?.errors?.price}
              required
            />

            <CustomFormInput
              formElement="input"
              inputType="number"
              name="duration"
              label="Duration"
              placeholder="Duration"
              defaultValue={state?.form?.duration || course?.duration}
              errors={state?.errors?.duration}
              required
            />

            <CustomFormInput
              formElement="textarea"
              inputType="text"
              name="description"
              label="Description"
              placeholder="A description about the course"
              defaultValue={state?.form?.description || course?.description}
              errors={state?.errors?.description}
              required
            />
          </div>

          <SubmitButton cta={course ? 'Update course' : 'Add Course'} />
        </form>
      </CardContent>
    </Card>
  )
}
