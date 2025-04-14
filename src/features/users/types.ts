import { users } from '@/db/schema'
import { Columns, With } from '@/types'

import { Profile } from './profiles/types'

export type User = typeof users.$inferSelect

export type InsertUser = typeof users.$inferInsert

type SingleUserQuery =
  | { id: User['id']; email?: never }
  | { email: User['email']; id?: never }
  | { email?: never; id?: never }

type WithPassword = {
  password?: true
}

type UserRelationships = {
  profile: Profile | null
}

export type UserWithRelationships = User & UserRelationships

export type RetrieveUser = SingleUserQuery &
  WithPassword &
  Omit<Partial<User>, 'id' | 'email' | 'password' | 'tokenExpiresAt'> & {
    tokenExpiresAtGte?: true
  } & With<{
    [key in keyof UserRelationships]: true
  }>

export type ListUser = Partial<Pick<User, 'role'>> &
  Columns<User> &
  With<{
    [key in keyof UserRelationships]: true
  }>
