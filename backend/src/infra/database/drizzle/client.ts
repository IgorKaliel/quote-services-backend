import { drizzleOrm_NodePostgres, schema } from "../../../../../packages/drizzle/dist/index.js"
import { env } from "../../http/config/env.ts"

let database: ReturnType<typeof drizzleOrm_NodePostgres.drizzle<typeof schema>> | null = null

export const getDb = () => {
  if (!database) {
    database = drizzleOrm_NodePostgres.drizzle(env.DATABASE_URL, { schema })
  }

  return database
}

export const closeDatabase = async () => {
  if (database) {
    await database.$client.end()
    database = null
  }
}
