import 'server-only'

import { eq } from 'drizzle-orm'

import db from '@/db'
import { stacks } from '@/db/schema'
import { INTERNAL_ERROR_MESSAGE } from '@/lib/constants'

import { InsertStack, RetrieveStack } from './types'

export default class StackServices {
  /**
   * Create Stack
   */
  create = async (stackInfo: InsertStack) => {
    const [stack] = await db
      .insert(stacks)
      .values(stackInfo)
      .returning({ id: stacks.id })

    if (!stack) throw new Error(INTERNAL_ERROR_MESSAGE)

    return stack
  }

  retrieve = async (query: RetrieveStack) =>
    await db.query.stacks.findFirst({
      where: query.id
        ? eq(stacks.id, query.id)
        : query.slug
          ? eq(stacks.slug, query.slug)
          : undefined,
    })
}
