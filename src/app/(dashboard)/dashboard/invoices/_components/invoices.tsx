import Image from 'next/image'

import { format } from 'date-fns'
import { Check, Clock } from 'lucide-react'

import CustomFormInput from '@/components/custom-form-inputs'
import { TableCell, TableRow } from '@/components/ui/table'
import ViewItems from '@/components/view-items'
import courseToLearner from '@/features/courses/coursesToLearners'
import { CourseToLearnerWithRelationships } from '@/features/courses/coursesToLearners/types'
import utils from '@/lib/utils'

type Props = {
  searchParams: { invoiceStatus: 'paid' | 'pending' }
}

export default async function Invoices({
  searchParams: { invoiceStatus },
}: Props) {
  const invoices = await courseToLearner.services.list({
    invoiceStatus,
  })

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
          { name: 'Date' },
          { name: 'Status' },
        ],
        tableBody: invoices.map((courseToLearner) => (
          <InvoiceItem
            key={`${courseToLearner.learnerId}${courseToLearner.courseId}`}
            courseToLearner={courseToLearner}
          />
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

type CourseLearnerItemProps = {
  courseToLearner: CourseToLearnerWithRelationships
}

function InvoiceItem({
  courseToLearner: { course, profile, user, date, paidAt },
}: CourseLearnerItemProps) {
  const isPaidInvoice = paidAt !== null
  return (
    <TableRow>
      <TableCell className="flex items-center gap-3 font-medium">
        <Image
          alt={`photo of ${profile?.name}`}
          src={profile?.image!}
          width={100}
          height={100}
          className="h-10 w-10 rounded-full"
        />
        {profile?.name}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>GHS {utils.formatToMoney(course.price)}</TableCell>
      <TableCell>{format(date, 'PP')}</TableCell>
      <InvoiceStatus isPaidInvoice={isPaidInvoice} />
    </TableRow>
  )
}

function SearchFilter() {
  const invoiceStatuses = [
    { id: 'paid', name: 'Paid' },
    { id: 'pending', name: 'Pending' },
    { id: 'both', name: 'Both' },
  ]

  return (
    <div className="flex gap-5">
      <CustomFormInput
        formElement="combobox"
        items={invoiceStatuses}
        query="invoiceStatus"
        name="Invoice Status"
      />
    </div>
  )
}

function InvoiceStatus({ isPaidInvoice }: { isPaidInvoice: boolean }) {
  if (isPaidInvoice) {
    return (
      <TableCell>
        <div className="flex items-center justify-center gap-1 rounded-sm bg-green-600 py-1 text-center text-white">
          Paid
          <Check className="h-4 w-4" />
        </div>
      </TableCell>
    )
  }

  return (
    <TableCell>
      <div className="flex items-center justify-center gap-1 rounded-sm bg-gray-200 py-1 text-center">
        Pending
        <Clock className="h-4 w-4" />
      </div>
    </TableCell>
  )
}
