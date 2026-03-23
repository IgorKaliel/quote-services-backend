import { AppError } from "../../../shared/errors/app.error.ts"
import { randomUUID } from "node:crypto"
import { JWTService } from "../../../shared/services/jwt.service.ts"
import { verifyPassword } from "../../../shared/utils/password.ts"
import { PublicUser, toPublicUser } from "../entities/user.ts"
import { UserSessionsRepository } from "../repositories/user-sessions-repository.ts"
import { UsersRepository } from "../repositories/users-repository.ts"

interface AuthenticateUserRequest {
  email: string
  password: string
}

interface AuthenticateUserResponse {
  token: string
  refreshToken: string
  user: PublicUser
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JWTService,
    private readonly userSessionsRepository: UserSessionsRepository,
  ) {}

  async execute(data: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.usersRepository.findByEmail(data.email.trim().toLowerCase())

    if (!user || !verifyPassword(data.password, user.passwordHash)) {
      throw new AppError("E-mail ou senha inválidos.", 401, undefined, "INVALID_CREDENTIALS")
    }

    const tokens = this.jwtService.generateTokenPair({ id: user.id, email: user.email })
    const now = new Date()
    const expiresAt = this.jwtService.getRefreshTokenExpiryDate()

    await this.userSessionsRepository.create({
      id: randomUUID(),
      userId: user.id,
      refreshTokenHash: this.jwtService.hashRefreshToken(tokens.refreshToken),
      expiresAt: expiresAt.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    })

    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: toPublicUser(user),
    }
  }
}
