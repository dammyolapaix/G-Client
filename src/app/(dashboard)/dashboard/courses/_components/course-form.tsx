'use client'

import Image from 'next/image'
import { useActionState, useState } from 'react'

import CustomCldUploadWidget from '@/components/cld-upload-widget'
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
import {
  createCourseAction,
  updateCourseAction,
} from '@/features/courses/actions'
import { Course } from '@/features/courses/types'
import { UserWithRelationships } from '@/features/users/types'

type Props = {
  course?: Course
  instructors: Omit<UserWithRelationships, 'password'>[]
}

export default function CourseForm({ course, instructors }: Props) {
  const [state, formAction] = useActionState(
    course ? updateCourseAction : createCourseAction,
    {}
  )

  const [image, setImage] = useState(course?.image || '')

  const handleUploadImage = (url?: string) => {
    if (url) setImage(url)
  }

  const filteredInstructors = instructors.map(({ profile }) => ({
    name: profile!.name,
    id: profile!.userId,
  }))

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
        {state?.error && (
          <SuccessErrorMessage messageType="error" message={state.error} />
        )}

        <form action={formAction}>
          <div className="mb-5">
            {course && (
              <input
                type="text"
                name="id"
                defaultValue={course.id}
                className="hidden"
              />
            )}
            <div className="mb-3 grid grid-cols-1 gap-5 md:grid-cols-2">
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
            </div>

            <div className="mb-3 grid grid-cols-1 gap-5 md:grid-cols-2">
              <CustomFormInput
                formElement="combobox"
                label="Instructor"
                items={filteredInstructors}
                query="instructorId"
                name="Instructor"
                defaultValue={state?.form?.instructorId || course?.instructorId}
                errors={state.errors?.instructorId}
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
            </div>

            <div className="mb-3">
              {image && (
                <>
                  <input
                    type="text"
                    name="image"
                    value={image}
                    className="hidden"
                  />

                  <Image
                    alt=""
                    src={image}
                    width={1000}
                    height={1000}
                    className="mx-auto my-3 w-full md:w-2/4"
                  />
                </>
              )}

              <CustomCldUploadWidget onUploadSuccess={handleUploadImage} />
            </div>

            <div className="mb-3">
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
          </div>

          <SubmitButton cta={course ? 'Update course' : 'Add Course'} />
        </form>
      </CardContent>
    </Card>
  )
}
