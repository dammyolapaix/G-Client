import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { coursesToStacks } from '@/db/schema'

export default class CourseToStackValidations {
  create = createInsertSchema(coursesToStacks, {
    courseId: z
      .string({
        required_error: 'The course is required',
      })
      .uuid({ message: 'The course is required' }),
    stackId: z
      .string({
        required_error: 'The stack is required',
      })
      .uuid({ message: 'The stack is required' }),
  })
}
