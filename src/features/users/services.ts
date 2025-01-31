import 'server-only'

import { and, eq } from 'drizzle-orm'

import VerifyEmail from '@/components/email/verify-email'
import db from '@/db'
import { profiles, users } from '@/db/schema'
import auth from '@/lib/auth'
import { INTERNAL_ERROR_MESSAGE } from '@/lib/constants'
import email from '@/lib/emails'

import { InsertProfile } from './profiles/types'
import { InsertUser, ListUser, RetrieveUser } from './types'

export default class UserServices {
  /**
   * Register User
   */
  register = async (userProfileInfo: InsertUser & { name: string }) => {
    const { name, ...userInfo } = userProfileInfo

    let userId: undefined | string = undefined

    const { token } = auth.utils.getToken({
      tokenType: 'otp',
    })

    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values(userInfo)
        .returning({ id: users.id })

      userId = user.id

      const [profile] = await tx
        .insert(profiles)
        .values({ name, userId: user.id })
        .returning({ id: profiles.id })

      if (!user || !profile) throw new Error(INTERNAL_ERROR_MESSAGE)
    })

    await email.send({
      subject: 'Verify Your email',
      to: [userInfo.email],
      emailTemplate: VerifyEmail({ verificationCode: token }),
    })

    return { id: userId! }
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

  update = async (
    userId: string,
    userProfileInfo: Omit<Partial<InsertProfile>, 'userId'>
  ) =>
    await db
      .update(profiles)
      .set(userProfileInfo)
      .where(eq(profiles.userId, userId))
}
