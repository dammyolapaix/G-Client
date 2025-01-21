import { Suspense } from 'react'

import user from '@/features/users'
import { UserWithRelationships } from '@/features/users/types'

import CourseForm from '../_components/course-form'

export default async function page() {
  const [instructors] = await Promise.all([
    user.services.list({ role: 'instructor', with: { profile: true } }),
  ])

  return (
    <Suspense fallback={<></>}>
      <CourseForm
        instructors={instructors as Omit<UserWithRelationships, 'password'>[]}
      />
    </Suspense>
  )
}
