'use client'

import Image from 'next/image'
import { useActionState, useState } from 'react'

import CustomCldUploadWidget from '@/components/cld-upload-widget'
import CustomFormInput from '@/components/custom-form-inputs'
import ErrorMessage from '@/components/error-message'
import SubmitButton from '@/components/submit-button'
import { Label } from '@/components/ui/label'
import { completeProfileAction } from '@/features/users/auth/actions'
import { cn } from '@/lib/utils'

export function CompleteProfileForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const [state, formAction] = useActionState(completeProfileAction, {})

  const [image, setImage] = useState('')

  const handleUploadImage = (url?: string) => {
    if (url) setImage(url)
  }

  const DISABLED = ['Yes', 'No']

  return (
    <form
      action={formAction}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      {state?.error && <ErrorMessage message={state.error} />}

      <div className="grid gap-6">
        <div className="grid gap-2">
          <CustomFormInput
            formElement="input"
            inputType="tel"
            name="phone"
            label="Phone"
            defaultValue={state?.form?.phone}
            required
            errors={state?.errors?.phone}
          />
        </div>
        <div className="grid gap-2">
          <CustomFormInput
            formElement="input"
            inputType="text"
            name="location"
            label="Location"
            defaultValue={state?.form?.location}
            required
            errors={state?.errors?.location}
          />
        </div>
        <div className="grid gap-2">
          <Label>Profile Image *</Label>
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
                width={300}
                height={300}
                className="mx-auto my-3 w-full md:w-2/4"
              />
            </>
          )}

          <CustomCldUploadWidget onUploadSuccess={handleUploadImage} />
        </div>
        <div className="grid gap-2">
          <CustomFormInput
            formElement="select"
            name="disabled"
            label="Disabled"
            selectItems={DISABLED}
            isQuery
            required
            errors={state?.errors?.disabled}
          />
        </div>
        <div className="grid gap-2">
          <CustomFormInput
            formElement="textarea"
            inputType="text"
            name="bio"
            label="Bio"
            defaultValue={state?.form?.bio}
            required
            errors={state?.errors?.bio}
          />
        </div>
        <SubmitButton cta="Complete Profile" />
      </div>
    </form>
  )
}
