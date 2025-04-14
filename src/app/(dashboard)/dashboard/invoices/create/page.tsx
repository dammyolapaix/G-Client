import { Suspense } from 'react'

import course from '@/features/courses'
import user from '@/features/users'
import { UserWithRelationships } from '@/features/users/types'

import InvoiceForm from '../_components/invoice-form'

export default async function CreateInvoicePage() {
  const [courses, learners] = await Promise.all([
    course.services.list(),
    user.services.list({ role: 'learner', with: { profile: true } }),
  ])

  return (
    <Suspense fallback={<></>}>
      <InvoiceForm
        courses={courses}
        learners={learners as Omit<UserWithRelationships, 'password'>[]}
      />
    </Suspense>
  )
}
