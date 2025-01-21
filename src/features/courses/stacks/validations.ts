import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { stacks } from '@/db/schema'
import utils from '@/lib/utils'

export default class StackValidations {
  create = createInsertSchema(stacks, {
    name: z
      .string({
        required_error: 'The stack name is required',
      })
      .min(3, 'The stack name must be at least 3 characters'),
    slug: z.string().optional(),
  }).superRefine((val, { addIssue }) => {
    val.slug = utils.slugify(val.name)

    if (!val.slug) {
      addIssue({
        code: 'custom',
        path: ['name'],
        message: 'Failed to generate stack slug, please try again',
      })
    }
  })
}
