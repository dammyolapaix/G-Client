import { pgEnum } from 'drizzle-orm/pg-core'

import { APPLICATION_STATUSES, AUTH_PROVIDERS, ROLES } from '@/lib/constants'

export const roleEnum = pgEnum('role', ROLES)

export const authProviderEnum = pgEnum('auth_provider', AUTH_PROVIDERS)

export const applicationStatusEnum = pgEnum(
  'application_status',
  APPLICATION_STATUSES
)
