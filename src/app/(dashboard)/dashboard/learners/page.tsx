import { Suspense } from 'react'

import Skeleton from '@/components/skeleton'

import Learners from './_components/learners'

export default function LearnersPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Learners />
    </Suspense>
  )
}
