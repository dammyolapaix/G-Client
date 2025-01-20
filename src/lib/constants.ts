export const ROLES = ['admin', 'instructor', 'learner'] as const

export const AUTH_PROVIDERS = ['email', 'google'] as const

export const INVOICE_STATUSES = [
  'draft',
  'open',
  'paid',
  'uncollectible',
  'void',
] as const

export const APPLICATION_STATUSES = ['pending', 'accepted', 'declined'] as const

export const INTERNAL_ERROR_MESSAGE =
  'Something went wrong from our end, please try again later. Report the issue if it persists' as const

export const UNAUTHORIZE_ERROR_MESSAGE =
  "You do not have permission to access this resource. Please ensure you're logged in with the correct account or contact support for assistance." as const

export const UNAUTHENTICATED_ERROR_MESSAGE =
  'You need to log in to access this resource. Please sign in with your account to continue.' as const
