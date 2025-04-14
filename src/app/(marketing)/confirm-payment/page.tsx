import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import courseToLearner from '@/features/courses/coursesToLearners'
import auth from '@/lib/auth'
import { HOME_ROUTE } from '@/lib/routes'

type SearchParams = Promise<{ courseId?: string }>

export default async function ConfirmPaymentPage(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams

  if (!searchParams.courseId) redirect(HOME_ROUTE)

  const authUser = await auth.utils.getAuthUser()

  if (!authUser) redirect(HOME_ROUTE)

  const authUserCourseEnrolled = await courseToLearner.services.retrieve({
    courseId: searchParams.courseId,
    learnerId: authUser.id,
  })

  return (
    <Suspense>
      <div>
        {authUserCourseEnrolled ? 'Payment Successful' : 'Payment Failed'}
      </div>
    </Suspense>
  )
}
