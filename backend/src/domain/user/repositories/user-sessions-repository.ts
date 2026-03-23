import { UserSession } from "../entities/user-session.ts"

export interface CreateUserSessionInput {
  id: string
  userId: string
  refreshTokenHash: string
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface RotateUserSessionInput {
  sessionId: string
  refreshTokenHash: string
  expiresAt: string
  updatedAt: string
}

export interface RevokeUserSessionInput {
  sessionId: string
  revokedAt: string
  updatedAt: string
}

export interface UserSessionsRepository {
  create(data: CreateUserSessionInput): Promise<UserSession>
  findByRefreshTokenHash(refreshTokenHash: string): Promise<UserSession | null>
  rotate(data: RotateUserSessionInput): Promise<UserSession | null>
  revoke(data: RevokeUserSessionInput): Promise<void>
}
