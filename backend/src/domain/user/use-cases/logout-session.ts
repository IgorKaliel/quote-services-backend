import { AppError } from "../../../shared/errors/app.error.ts"
import { JWTService } from "../../../shared/services/jwt.service.ts"
import { UserSessionsRepository } from "../repositories/user-sessions-repository.ts"

interface LogoutSessionRequest {
  refreshToken: string
}

export class LogoutSessionUseCase {
  constructor(
    private readonly userSessionsRepository: UserSessionsRepository,
    private readonly jwtService: JWTService,
  ) {}

  async execute(data: LogoutSessionRequest): Promise<void> {
    const refreshTokenHash = this.jwtService.hashRefreshToken(data.refreshToken)
    const session = await this.userSessionsRepository.findByRefreshTokenHash(refreshTokenHash)

    if (!session || session.revokedAt) {
      throw new AppError("Refresh token invalido.", 401, undefined, "INVALID_REFRESH_TOKEN")
    }

    const now = new Date().toISOString()

    await this.userSessionsRepository.revoke({
      sessionId: session.id,
      revokedAt: now,
      updatedAt: now,
    })
  }
}
