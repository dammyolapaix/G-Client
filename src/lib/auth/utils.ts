import { cookies } from 'next/headers'

import 'server-only'

import { compare, hash } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

import { env } from '@/env/server'
import user from '@/features/users'
import { SessionUser } from '@/types'

export default class AuthUtils {
  private SALT_ROUNDS = 10
  private key = new TextEncoder().encode(env.AUTH_SECRET)

  hashPassword = (password: string) => hash(password, this.SALT_ROUNDS)

  comparePasswords = (plainTextPassword: string, hashedPassword: string) =>
    compare(plainTextPassword, hashedPassword)

  isPasswordStrong = (password: string): boolean => {
    // Define your complexity criteria
    const hasUpperCase = /[A-Z]/.test(password) // Check for at least one uppercase letter
    const hasLowerCase = /[a-z]/.test(password) // Check for at least one lowercase letter
    const hasNumbers = /\d/.test(password) // Check for at least one digit
    const hasSpecialChars = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password) // Check for at least one special character
    const has8CharactersOrMore = password.length >= 8 // Check for at least 8 characters

    //   Check if all complexity criteria are met
    return (
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars &&
      has8CharactersOrMore
    )
  }

  signToken = async (payload: SessionUser) =>
    await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(this.key)

  private verifyToken = async (input: string) => {
    const data = await jwtVerify(input, this.key, {
      algorithms: ['HS256'],
    })

    const sessionUser = data.payload as SessionUser

    if (new Date(sessionUser.expires) < new Date()) return null

    return sessionUser
  }

  private getSession = async () => {
    const session = (await cookies()).get('session')?.value
    if (!session) return null
    return await this.verifyToken(session)
  }

  setSession = async (user: { id: string }) => {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30d

    const session: SessionUser = {
      user,
      expires: expires.toISOString(),
    }

    const encryptedSession = (await this.signToken(session)) as string

    const cookieStore = await cookies()

    cookieStore.set('session', encryptedSession, {
      expires,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    })
  }

  getAuthUser = async () => {
    const session = await this.getSession()
    if (!session) return null

    const authUser = await user.services.retrieve({ id: session.user.id })

    if (!authUser) return null

    return authUser
  }
}
