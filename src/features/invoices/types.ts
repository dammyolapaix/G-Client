import { invoices } from '@/db/schema'
import { Course } from '@/features/courses/types'
import { Profile } from '@/features/users/profiles/types'
import { User } from '@/features/users/types'
import { INVOICE_STATUSES } from '@/lib/constants'

export type Invoice = typeof invoices.$inferSelect

export type InsertInvoice = typeof invoices.$inferInsert

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]

export type InvoiceRelationships = {
  totalInvoice: number
  status: InvoiceStatus
  paidAt: string
  profile: Profile
  user: Omit<User, 'password'>
  course: Course
}

export type InvoiceWithRelationships = InvoiceRelationships
