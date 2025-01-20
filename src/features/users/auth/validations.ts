import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { users } from '@/db/schema'
import auth from '@/lib/auth'

export default class AuthValidations {
  private registerSchema = createInsertSchema(users, {
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

  login = this.registerSchema.pick({ email: true, password: true })
}
