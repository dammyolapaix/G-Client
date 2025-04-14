import { coursesToLearners } from '@/db/schema'
import { Profile } from '@/features/users/profiles/types'
import { User } from '@/features/users/types'

import { Course } from '../types'

export type CourseToLearner = typeof coursesToLearners.$inferSelect

export type InsertCourseToLearner = typeof coursesToLearners.$inferInsert

export type CourseToLearnerRelationships = CourseToLearner & {
  profile: Profile
  user: Omit<User, 'password'>
  course: Course
}

export type CourseToLearnerWithRelationships = CourseToLearnerRelationships
