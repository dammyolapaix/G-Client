import { coursesToLearners } from '@/db/schema'
import { Profile } from '@/features/users/profiles/types'

import { Course } from '../types'

export type CourseToLearner = typeof coursesToLearners.$inferSelect

export type InsertCourseToLearner = typeof coursesToLearners.$inferInsert

export type CourseToLearnerRelationships = CourseToLearner & {
  learner: Profile
  course: Course
}

export type CourseToLearnerWithRelationships = CourseToLearnerRelationships
