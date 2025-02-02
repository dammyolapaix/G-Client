import 'server-only'

import db from '@/db'
import { coursesToLearners } from '@/db/schema'
import { INTERNAL_ERROR_MESSAGE } from '@/lib/constants'

import { InsertCourseToLearner } from './types'

export default class CourseToLearnerServices {
  create = async (courseToLearnerInfo: InsertCourseToLearner) => {
    const [courseToLearner] = await db
      .insert(coursesToLearners)
      .values(courseToLearnerInfo)
      .returning({ id: coursesToLearners.id })

    if (!courseToLearner) throw new Error(INTERNAL_ERROR_MESSAGE)

    return courseToLearner
  }
}
