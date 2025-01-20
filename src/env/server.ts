import { createEnv } from '@t3-oss/env-nextjs'
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import { ZodError, z } from 'zod'

expand(config())

const stringBoolean = z
  .string()
  .refine((s) => s === 'true' || s === 'false')
  .transform((s) => s === 'true')
  .optional()

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production']),
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(10),
    DB_MIGRATING: stringBoolean,
    DB_SEEDING: stringBoolean,
  },
  isServer: typeof window === 'undefined',
  emptyStringAsUndefined: false,
  experimental__runtimeEnv: process.env,

  onValidationError: (error: ZodError) => {
    console.error(
      '❌ Invalid environment variables:',
      error.flatten().fieldErrors
    )
    process.exit(1)
  },
})
