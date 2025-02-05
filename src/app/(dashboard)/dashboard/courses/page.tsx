import { Suspense } from 'react'

import Skeleton from '@/components/skeleton'

import Courses from './_components/courses'

type Props = {
  searchParams: Promise<{ title?: string }>
}

export default async function page(props: Props) {
  const searchParams = await props.searchParams
  return (
    <Suspense fallback={<Skeleton />}>
      <Courses searchParams={searchParams} />
    </Suspense>
  )
}
