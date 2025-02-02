import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { courses } from '@/db/schema'
import utils from '@/lib/utils'

export default class CourseValidations {
  create = createInsertSchema(courses, {
    title: z
      .string({
        required_error: 'The course title is required',
      })
      .min(3, 'The course title must be at least 3 characters'),
    slug: z.string().optional(),
    duration: z.coerce.number({
      message: 'The duration is required and it must be a number',
    }),
    price: z.coerce
      .number({
        message: 'The price is required and it must be a number',
      })
      .transform((val) => val * 100),
    description: z
      .string({
        required_error: 'The course description is required',
      })
      .min(3, 'The course description must be at least 3 characters'),
    image: z
      .string({
        required_error: 'The course image is required',
      })
      .url()
      .startsWith('https://', {
        message: 'Please provide secure URL for the image',
      }),
    instructorId: z
      .string({
        required_error: 'The instructor is required',
      })
      .uuid({ message: 'The instructor is required' }),
  }).superRefine((val, { addIssue }) => {
    val.slug = utils.slugify(val.title)

    if (!val.slug) {
      addIssue({
        code: 'custom',
        path: ['title'],
        message: 'Failed to generate course slug, please try again',
      })
    }
  })

  purchase = z.object({
    courseId: z
      .string({
        required_error: 'The course is required',
      })
      .uuid({ message: 'The course is required' }),
  })
}
