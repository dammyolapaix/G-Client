import { coursesToLearners } from '@/db/schema'
import { UserWithRelationships } from '@/features/users/types'

import { Course } from '../types'

export type CourseToLearner = typeof coursesToLearners.$inferSelect

export type InsertCourseToLearner = typeof coursesToLearners.$inferInsert

export type CourseToLearnerRelationships = CourseToLearner & {
  learner: Omit<UserWithRelationships, 'password'>
  course: Course
}

export type CourseToLearnerWithRelationships = CourseToLearnerRelationships
