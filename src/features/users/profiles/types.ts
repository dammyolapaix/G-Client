import { profiles } from '@/db/schema'

export type Profile = typeof profiles.$inferSelect

export type InsertProfile = typeof profiles.$inferInsert
