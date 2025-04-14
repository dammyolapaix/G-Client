import { z } from 'zod'

export default class InvoiceValidations {
  create = z.object({
    courseId: z
      .string({
        required_error: 'The course is required',
      })
      .uuid({ message: 'The course is required' }),
    learnerId: z
      .string({
        required_error: 'The learner is required',
      })
      .uuid({ message: 'The learner is required' }),
    amount: z.coerce
      .number({
        required_error: 'The amount is required',
      })
      .min(1, 'Amount must be greater than 0')
      .transform((val) => val * 100),
    dueDate: z
      .string({ required_error: 'The due date is required' })
      .refine((date) => new Date(date) > new Date(), {
        message: 'Due date must be in the future',
      }),
  })
}
