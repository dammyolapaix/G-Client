import { pgEnum } from 'drizzle-orm/pg-core'

import { AUTH_PROVIDERS, ROLES } from '@/lib/constants'

export const roleEnum = pgEnum('role', ROLES)

export const authProviderEnum = pgEnum('auth_provider', AUTH_PROVIDERS)
