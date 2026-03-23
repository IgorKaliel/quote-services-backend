import { and, eq, isNull } from "../../../../../../packages/drizzle/node_modules/drizzle-orm/index.js"
import { userSessionsTable } from "../../../../../../packages/drizzle/dist/index.js"
import { UserSession } from "../../../../domain/user/entities/user-session.ts"
import {
  CreateUserSessionInput,
  RevokeUserSessionInput,
  RotateUserSessionInput,
  UserSessionsRepository,
} from "../../../../domain/user/repositories/user-sessions-repository.ts"
import { getDb } from "../client.ts"

const mapUserSession = (row: typeof userSessionsTable.$inferSelect): UserSession => ({
  id: row.id,
  userId: row.userId,
  refreshTokenHash: row.refreshTokenHash,
  expiresAt: row.expiresAt.toISOString(),
  revokedAt: row.revokedAt?.toISOString() ?? null,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
})

export class DrizzleUserSessionsRepository implements UserSessionsRepository {
  async create(data: CreateUserSessionInput): Promise<UserSession> {
    const db = getDb()

    await db.insert(userSessionsTable).values({
      id: data.id,
      userId: data.userId,
      refreshTokenHash: data.refreshTokenHash,
      expiresAt: new Date(data.expiresAt),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    })

    return (await this.findByRefreshTokenHash(data.refreshTokenHash))!
  }

  async findByRefreshTokenHash(refreshTokenHash: string): Promise<UserSession | null> {
    const db = getDb()
    const row = await db.query.userSessionsTable.findFirst({
      where: eq(userSessionsTable.refreshTokenHash, refreshTokenHash),
    })

    return row ? mapUserSession(row) : null
  }

  async rotate(data: RotateUserSessionInput): Promise<UserSession | null> {
    const db = getDb()

    await db
      .update(userSessionsTable)
      .set({
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: new Date(data.expiresAt),
        revokedAt: null,
        updatedAt: new Date(data.updatedAt),
      })
      .where(and(eq(userSessionsTable.id, data.sessionId), isNull(userSessionsTable.revokedAt)))

    return this.findByRefreshTokenHash(data.refreshTokenHash)
  }

  async revoke(data: RevokeUserSessionInput): Promise<void> {
    const db = getDb()

    await db
      .update(userSessionsTable)
      .set({
        revokedAt: new Date(data.revokedAt),
        updatedAt: new Date(data.updatedAt),
      })
      .where(and(eq(userSessionsTable.id, data.sessionId), isNull(userSessionsTable.revokedAt)))
  }
}
