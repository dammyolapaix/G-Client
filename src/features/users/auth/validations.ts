import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { users } from '@/db/schema'
import auth from '@/lib/auth'

export default class AuthValidations {
  private authSchema = createInsertSchema(users, {
    email: z
      .string({ required_error: 'Email is required' })
      .email('Email must be a valid email')
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .refine((password) => auth.utils.isPasswordStrong(password), {
        message:
          'Your password is weak, please make sure it contains at least a capital and a small letter, a number, and a special character',
      }),
  })

  login = this.authSchema.pick({ email: true, password: true })

  register = z.intersection(
    this.authSchema,
    z.object({
      name: z
        .string({ required_error: 'Name is required' })
        .min(3, { message: 'Name must be at least 3 characters' })
        .trim(),
    })
  )
}
