import { pgEnum } from 'drizzle-orm/pg-core'

import { AUTH_PROVIDERS, ROLES } from '@/lib/constants'

export const roleEnum = pgEnum('role', ROLES)
export const authProviderEnum = pgEnum('role', AUTH_PROVIDERS)
