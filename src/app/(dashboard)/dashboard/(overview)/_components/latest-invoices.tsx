import Image from 'next/image'

import { CheckCircle2Icon, LoaderIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import invoice from '@/features/invoices'
import utils from '@/lib/utils'

export default async function LatestInvoices() {
  const latestInvoices = await invoice.services.list({ limit: 5 })

  return (
    <section>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="mb-3 text-xl font-bold">
            Latest Invoice
          </CardTitle>
        </CardHeader>
        <CardContent>
          {latestInvoices.map((invoice) => (
            <div
              key={`${invoice.learnerId}${invoice.courseId}`}
              className="grid grid-cols-3 gap-3"
            >
              <div className="flex items-center gap-3">
                <Image
                  alt={`photo of ${invoice.profile?.name}`}
                  src={invoice.profile.image!}
                  width={100}
                  height={100}
                  className="h-10 w-10 rounded-full"
                />
                <div className="col-span-4">
                  <div className="text-sm font-medium">
                    {invoice.profile.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {invoice.course.title}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">GHS</span>{' '}
                {utils.formatToMoney(invoice.amount)}
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
                >
                  {invoice.status === 'paid' ? (
                    <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
                  ) : (
                    <LoaderIcon />
                  )}
                  {invoice.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
