import { Suspense } from 'react'

import Skeleton from '@/components/skeleton'

import Learners from './_components/learners'

type Props = {
  searchParams: Promise<{
    learnerName?: string
    courseId?: string
  }>
}

export default async function LearnersPage(props: Props) {
  const searchParams = await props.searchParams
  return (
    <Suspense fallback={<Skeleton />}>
      <Learners searchParams={searchParams} />
    </Suspense>
  )
}
