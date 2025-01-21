import 'server-only'

import { and, eq } from 'drizzle-orm'

import db from '@/db'
import { users } from '@/db/schema'
import { INTERNAL_ERROR_MESSAGE } from '@/lib/constants'

import { InsertUser, ListUser, RetrieveUser } from './types'

export default class UserServices {
  /**
   * Register User
   */
  register = async (userInfo: InsertUser) => {
    const [user] = await db
      .insert(users)
      .values(userInfo)
      .returning({ id: users.id })

    if (!user) throw new Error(INTERNAL_ERROR_MESSAGE)

    return user
  }

  /**
   * Get users
   */
  list = async (query?: ListUser) =>
    await db.query.users.findMany({
      where: and(query?.role ? eq(users.role, query.role) : undefined),
      columns: { password: false },
      with: query?.with,
    })

  /**
   * Get single user by query
   */
  retrieve = async (query: RetrieveUser) =>
    await db.query.users.findFirst({
      where: query.id
        ? eq(users.id, query.id)
        : query.email
          ? eq(users.email, query.email)
          : undefined,
      columns: query.password === true ? undefined : { password: false },
    })
}
