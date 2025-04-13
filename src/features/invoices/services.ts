import 'server-only'

import { and, eq, getTableColumns, ilike, sql } from 'drizzle-orm'

import db from '@/db'
import {
  courses,
  coursesToLearners,
  invoices,
  profiles,
  users,
} from '@/db/schema'
import { INTERNAL_ERROR_MESSAGE } from '@/lib/constants'
import withPagination from '@/lib/pagination'
import { Pagination } from '@/types'

import { InsertInvoice, Invoice, InvoiceStatus } from './types'

export default class InvoiceServices {
  totalInvoice = async (query?: Partial<Invoice>) => {
    const [totalInvoice] = await db
      .select({
        totalPaidInvoiceAmount: sql`
          CASE
            WHEN ${invoices.status} = 'paid' THEN COALESCE(SUM(${invoices.amount}), 0.00)
            ELSE 0.00
          END
        `.mapWith(Number),
        totalPendingInvoiceAmount: sql`
          CASE
            WHEN ${invoices.status} = 'pending' THEN COALESCE(SUM(${invoices.amount}), 0.00)
            ELSE 0.00
          END
        `.mapWith(Number),
        totalCancelledInvoiceAmount: sql`
          CASE
            WHEN ${invoices.status} = 'cancelled' THEN COALESCE(SUM(${invoices.amount}), 0.00)
            ELSE 0.00
          END
        `.mapWith(Number),
      })
      .from(invoices)
      .where(
        and(
          query?.courseId
            ? eq(coursesToLearners.courseId, query.courseId)
            : undefined,
          query?.learnerId
            ? eq(coursesToLearners.learnerId, query.learnerId)
            : undefined
        )
      )
      .groupBy(invoices.status)

    return totalInvoice
  }

  retrieve = async (
    query: Partial<
      Pick<Invoice, 'courseId' | 'learnerId' | 'paystackReference' | 'status'>
    >
  ) =>
    await db.query.invoices.findFirst({
      where: and(
        query.courseId ? eq(invoices.courseId, query.courseId) : undefined,
        query.learnerId ? eq(invoices.learnerId, query.learnerId) : undefined,
        query.paystackReference
          ? eq(invoices.paystackReference, query.paystackReference)
          : undefined,
        query.status ? eq(invoices.status, query.status) : undefined
      ),
      with: { course: true },
    })

  updateInvoiceStatus = async (
    invoiceInfo: Pick<InsertInvoice, 'courseId' | 'learnerId'> & {
      status: Exclude<InvoiceStatus, 'pending'>
    }
  ) => {
    const { courseId, learnerId, status } = invoiceInfo

    const [invoice] = await db
      .update(invoices)
      .set({ status })
      .where(
        and(eq(invoices.learnerId, learnerId), eq(invoices.courseId, courseId))
      )
      .returning()

    if (!invoice) throw new Error(INTERNAL_ERROR_MESSAGE)

    return invoice
  }

  list = async (
    query?: Partial<
      Pick<Invoice, 'courseId' | 'learnerId' | 'status'> & {
        learnerName: string
      } & Pagination
    >
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...usersTable } = getTableColumns(users)

    const queryResult = db
      .select({
        ...getTableColumns(invoices),
        course: { ...getTableColumns(courses) },
        profile: { ...getTableColumns(profiles) },
        user: { ...usersTable },
      })
      .from(invoices)
      .innerJoin(courses, eq(courses.id, invoices.courseId))
      .innerJoin(users, eq(users.id, invoices.learnerId))
      .innerJoin(profiles, eq(profiles.userId, users.id))
      .where(
        and(
          query?.courseId ? eq(invoices.courseId, query.courseId) : undefined,
          query?.learnerId
            ? eq(invoices.learnerId, query.learnerId)
            : undefined,
          query?.learnerName
            ? ilike(profiles.name, `%${query.learnerName}%`)
            : undefined
        )
      )

    const dynamicQuery = queryResult.$dynamic()

    return await withPagination(dynamicQuery, query?.page, query?.limit)
  }

  create = async (data: InsertInvoice) => {
    const [invoice] = await db.insert(invoices).values(data).returning()

    if (!invoice) throw new Error(INTERNAL_ERROR_MESSAGE)

    return invoice
  }
}
