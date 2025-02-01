import { createInsertSchema } from 'drizzle-zod'
import parsePhoneNumber, { isValidPhoneNumber } from 'libphonenumber-js'
import { z } from 'zod'

import { profiles, users } from '@/db/schema'
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

  private completeProfileSchema = createInsertSchema(profiles, {
    phone: z
      .string({
        required_error: 'Phone number is required',
        message: 'Phone number is required',
      })
      .trim()
      .refine((val) => isValidPhoneNumber(val), {
        message: 'Please enter a valid phone number',
      })
      .transform((val) => parsePhoneNumber(val)?.number?.toString()),
    location: z
      .string({ required_error: 'Location is required' })
      .min(2, { message: 'Location must be at least 2 characters' })
      .trim(),
    image: z
      .string({ required_error: 'Location is required' })
      .url()
      .startsWith('https://', {
        message: 'Please provide secure URL for the profile image',
      }),
    disabled: z
      .string()
      .refine((val) => val === 'Yes' || val === 'No', {
        message: 'Please select "Yes" or "No"',
      })
      .transform((val) => val === 'Yes'),
    bio: z
      .string({ required_error: 'Bio is required' })
      .min(3, { message: 'Bio must be at least 3 characters' })
      .trim(),
  })

  completeProfile = this.completeProfileSchema.omit({
    userId: true,
    name: true,
  })

  verifyEmail = z.object({
    otp: z.coerce
      .number({
        message: 'The verification code is required and it must be a number',
      })
      .refine((val) => val.toString().length === 6, {
        message: 'The verification code must be at 6 characters',
      }),
  })
}
