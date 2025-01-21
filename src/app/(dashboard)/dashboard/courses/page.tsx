import { Suspense } from 'react'

import Skeleton from '@/components/skeleton'

import Courses from './_components/courses'

export default function page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Courses />
    </Suspense>
  )
}
