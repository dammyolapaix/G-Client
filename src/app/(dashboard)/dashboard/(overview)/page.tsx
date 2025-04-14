import { Suspense } from 'react'

import Skeleton from '@/components/skeleton'

import Chart from './_components/chart'
import LatestInvoices from './_components/latest-invoices'
import Stats from './_components/stats'

export default function DashboardPage() {
  return (
    <section>
      <Suspense fallback={<Skeleton />}>
        <Stats />
      </Suspense>
      <div className="my-10 grid grid-cols-1 gap-10 md:grid-cols-2">
        <Chart />
        <Suspense fallback={<Skeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </section>
  )
}
