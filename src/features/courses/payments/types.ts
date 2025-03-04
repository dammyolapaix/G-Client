import { coursePayments } from '@/db/schema'
import { Profile } from '@/features/users/profiles/types'
import { User } from '@/features/users/types'

import { Course } from '../types'

export type CoursePayment = typeof coursePayments.$inferSelect

export type InsertCoursePayment = typeof coursePayments.$inferInsert

export type CoursePaymentStatus = 'Paid' | 'Pending'

export type CoursePaymentRelationships = {
  totalCoursePayment: number
  status: CoursePaymentStatus
  paidAt: string
  profile: Profile
  user: Omit<User, 'password'>
  course: Course
}

export type CoursePaymentWithRelationships = CoursePaymentRelationships
