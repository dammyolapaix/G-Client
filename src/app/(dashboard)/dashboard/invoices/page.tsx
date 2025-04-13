import { Suspense } from 'react'

import Skeleton from '@/components/skeleton'
import { InvoiceStatus } from '@/features/invoices/types'

import Invoices from './_components/invoices'

type Props = {
  searchParams: Promise<{ status?: InvoiceStatus }>
}

export default async function InvoicesPage(props: Props) {
  const searchParams = await props.searchParams
  return (
    <Suspense fallback={<Skeleton />}>
      <Invoices searchParams={searchParams} />
    </Suspense>
  )
}
