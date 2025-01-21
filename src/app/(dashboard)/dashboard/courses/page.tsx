import { Suspense } from 'react'

import Courses from './_components/courses'

export default function page() {
  return (
    <Suspense fallback={<></>}>
      <Courses />
    </Suspense>
  )
}
