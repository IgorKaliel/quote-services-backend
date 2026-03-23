import { AppError } from "../../../shared/errors/app.error.ts"
import { JWTService } from "../../../shared/services/jwt.service.ts"
import { PublicUser, toPublicUser } from "../entities/user.ts"
import { UserSessionsRepository } from "../repositories/user-sessions-repository.ts"
import { UsersRepository } from "../repositories/users-repository.ts"

interface RefreshSessionRequest {
  refreshToken: string
}

interface RefreshSessionResponse {
  token: string
  refreshToken: string
  user: PublicUser
}

export class RefreshSessionUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userSessionsRepository: UserSessionsRepository,
    private readonly jwtService: JWTService,
  ) {}

  async execute(data: RefreshSessionRequest): Promise<RefreshSessionResponse> {
    const refreshTokenHash = this.jwtService.hashRefreshToken(data.refreshToken)
    const session = await this.userSessionsRepository.findByRefreshTokenHash(refreshTokenHash)

    if (!session || session.revokedAt) {
      throw new AppError("Refresh token invalido.", 401, undefined, "INVALID_REFRESH_TOKEN")
    }

    if (!this.jwtService.isRefreshTokenValid(new Date(session.expiresAt))) {
      await this.userSessionsRepository.revoke({
        sessionId: session.id,
        revokedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      throw new AppError("Refresh token expirado.", 401, undefined, "REFRESH_TOKEN_EXPIRED")
    }

    const user = await this.usersRepository.findById(session.userId)

    if (!user) {
      await this.userSessionsRepository.revoke({
        sessionId: session.id,
        revokedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      throw new AppError("Usuario nao encontrado.", 401, undefined, "USER_NOT_FOUND")
    }

    const tokens = this.jwtService.generateTokenPair({ id: user.id, email: user.email })
    const now = new Date().toISOString()

    await this.userSessionsRepository.rotate({
      sessionId: session.id,
      refreshTokenHash: this.jwtService.hashRefreshToken(tokens.refreshToken),
      expiresAt: this.jwtService.getRefreshTokenExpiryDate().toISOString(),
      updatedAt: now,
    })

    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: toPublicUser(user),
    }
  }
}
