import Image from 'next/image'

import { format } from 'date-fns'
import { CheckCircle2Icon, LoaderIcon } from 'lucide-react'

import CustomFormInput from '@/components/custom-form-inputs'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import ViewItems from '@/components/view-items'
import invoice from '@/features/invoices'
import {
  InvoiceStatus,
  InvoiceWithRelationships,
} from '@/features/invoices/types'
import utils from '@/lib/utils'

type Props = {
  searchParams: { status?: InvoiceStatus }
}

export default async function Invoices({ searchParams: { status } }: Props) {
  const invoices = await invoice.services.list({ status })

  return (
    <ViewItems
      title="Invoices"
      searchFilter={<SearchFilter />}
      button={{ ctaType: 'link', cta: 'Add Invoice', href: '#' }}
      items={{
        length: invoices.length,
        type: 'table',
        tableHeads: [
          { name: 'Learner' },
          { name: 'Email' },
          { name: 'Amount' },
          { name: 'Due/Paid Date' },
          { name: 'Status' },
        ],
        tableBody: invoices.map((invoice) => (
          <InvoiceItem key={invoice.id} invoice={invoice} />
        )),
      }}
      noItemFound={{
        ctaType: 'link',
        cta: 'Add Invoice',
        href: '#',
        title: 'No invoice',
        description: 'You can add a new invoice by clicking on the link below',
      }}
    />
  )
}

type InvoiceItemProps = {
  invoice: InvoiceWithRelationships
}

function InvoiceItem({
  invoice: { profile, user, paidAt, status, amount, dueDate },
}: InvoiceItemProps) {
  return (
    <TableRow>
      <TableCell className="flex items-center gap-3 font-medium">
        <Image
          alt={`photo of ${profile?.name}`}
          src={profile.image!}
          width={100}
          height={100}
          className="h-10 w-10 rounded-full"
        />
        {profile?.name}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>GHS {utils.formatToMoney(amount)}</TableCell>
      <TableCell>{format(paidAt ? paidAt : dueDate!, 'PP')}</TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
          >
            {status === 'paid' ? (
              <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
            ) : (
              <LoaderIcon />
            )}
            {status}
          </Badge>
        </div>
      </TableCell>
    </TableRow>
  )
}

function SearchFilter() {
  const invoiceStatuses = [
    { id: 'paid', name: 'Paid' },
    { id: 'pending', name: 'Pending' },
    { id: 'cancelled', name: 'Cancelled' },
  ]

  return (
    <div className="flex gap-5">
      <CustomFormInput
        formElement="combobox"
        items={invoiceStatuses}
        query="status"
        name="Status"
      />
    </div>
  )
}
