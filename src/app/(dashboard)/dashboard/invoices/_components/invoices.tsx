import Image from 'next/image'

import { format } from 'date-fns'
import { Check, Clock } from 'lucide-react'

import CustomFormInput from '@/components/custom-form-inputs'
import { TableCell, TableRow } from '@/components/ui/table'
import ViewItems from '@/components/view-items'
import coursePayment from '@/features/courses/payments'
import {
  CoursePaymentRelationships,
  CoursePaymentStatus,
} from '@/features/courses/payments/types'
import utils from '@/lib/utils'

type Props = {
  searchParams: { invoiceStatus?: CoursePaymentStatus }
}

export default async function Invoices({
  searchParams: { invoiceStatus },
}: Props) {
  const invoices = await coursePayment.services.list({ invoiceStatus })

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
            key={`${courseToLearner.course.id}${courseToLearner.user.id}`}
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
  courseToLearner: CoursePaymentRelationships
}

function InvoiceItem({
  courseToLearner: { profile, user, paidAt, status, totalCoursePayment },
}: CourseLearnerItemProps) {
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
      <TableCell>GHS {utils.formatToMoney(totalCoursePayment)}</TableCell>
      <TableCell>{format(paidAt, 'PP')}</TableCell>
      <InvoiceStatus status={status} />
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

function InvoiceStatus({ status }: { status: CoursePaymentStatus }) {
  if (status === 'Paid') {
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
