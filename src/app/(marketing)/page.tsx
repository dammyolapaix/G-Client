import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import Hero from '@/components/hero'
import { UserWithRelationships } from '@/features/users/types'
import auth from '@/lib/auth'
import { COMPLETE_PROFILE_ROUTE, VERIFY_EMAIL_ROUTE } from '@/lib/routes'

import OurSolutions from './_components/our-solutions'
import OurStacks from './_components/our-stacks'
import RegisterForCourse from './_components/register-for-course'

export default async function Home() {
  const authUser = await auth.utils.getAuthUser({ with: { profile: true } })

  if (authUser && authUser.role === 'learner') {
    if (!authUser.emailVerified) redirect(VERIFY_EMAIL_ROUTE)

    if (
      !auth.utils.authUserProfileIsCompleted(authUser as UserWithRelationships)
    )
      redirect(COMPLETE_PROFILE_ROUTE)
  }

  return (
    <Suspense>
      <main>
        <Hero />
        <OurSolutions />
        <OurStacks />
        <RegisterForCourse />
      </main>
    </Suspense>
  )
}
