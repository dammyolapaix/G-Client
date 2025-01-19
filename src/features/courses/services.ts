import 'server-only'

import db from '@/db'
import { courses } from '@/db/schema'

import { InsertCourse } from './types'

export default class CourseServices {
  create = async (courseInfo: InsertCourse) =>
    await db.insert(courses).values(courseInfo)
}
