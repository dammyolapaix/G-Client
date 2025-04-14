import { DollarSign, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import coursesToLearners from '@/features/courses/coursesToLearners'
import invoice from '@/features/invoices'
import utils from '@/lib/utils'

export default async function Stats() {
  const [
    {
      totalCancelledInvoiceAmount,
      totalPaidInvoiceAmount,
      totalPendingInvoiceAmount,
    },
    totalLearners,
  ] = await Promise.all([
    invoice.services.totalInvoice(),
    coursesToLearners.services.totalLearners(),
  ])

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            <small className="text-xs font-thin">GHS</small>{' '}
            {utils.formatToMoney(totalPaidInvoiceAmount)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Pending Invoices
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            <small className="text-xs font-thin">GHS</small>{' '}
            {utils.formatToMoney(totalPendingInvoiceAmount)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Cancelled Invoices
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            <small className="text-xs font-thin">GHS</small>{' '}
            {utils.formatToMoney(totalCancelledInvoiceAmount)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">
            {totalLearners}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
