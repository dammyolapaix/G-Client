import { users } from '@/db/schema'
import { With } from '@/types'

import { Profile } from './profiles/types'

export type User = typeof users.$inferSelect

export type InsertUser = typeof users.$inferInsert

type SingleUserQuery =
  | { id: User['id']; email?: never }
  | { email: User['email']; id?: never }

type WithPassword = {
  password?: true
}

type UserRelationships = {
  profile: Profile | null
}

export type UserWithRelationships = User & UserRelationships

export type RetrieveUser = SingleUserQuery & WithPassword

export type ListUser = Partial<Pick<User, 'role'>> &
  With<{
    [key in keyof UserRelationships]: true
  }>
