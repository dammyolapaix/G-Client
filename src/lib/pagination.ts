import { PgSelect } from 'drizzle-orm/pg-core'

export default function withPagination<T extends PgSelect>(
  qb: T,
  page: number = 1,
  limit: number = 15
) {
  return qb.limit(limit).offset((page - 1) * limit)
}
