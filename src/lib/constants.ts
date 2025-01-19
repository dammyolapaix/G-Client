export const ROLES = ['admin', 'instructor', 'learner'] as const

export const AUTH_PROVIDERS = ['email', 'google'] as const

export const INVOICE_STATUSES = [
  'draft',
  'open',
  'paid',
  'uncollectible',
  'void',
] as const
