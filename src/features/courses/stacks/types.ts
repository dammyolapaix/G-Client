import { stacks } from '@/db/schema'

export type Stack = typeof stacks.$inferSelect

export type InsertStack = typeof stacks.$inferInsert

type SingleStackQuery =
  | { id: Stack['id']; slug?: never }
  | { slug: Stack['slug']; id?: never }

export type RetrieveStack = SingleStackQuery
