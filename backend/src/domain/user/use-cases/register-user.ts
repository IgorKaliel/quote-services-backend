import { randomUUID } from "node:crypto"
import { AppError } from "../../../shared/errors/app.error.ts"
import { JWTService } from "../../../shared/services/jwt.service.ts"
import { hashPassword } from "../../../shared/utils/password.ts"
import { PublicUser, toPublicUser } from "../entities/user.ts"
import { UserSessionsRepository } from "../repositories/user-sessions-repository.ts"
import { UsersRepository } from "../repositories/users-repository.ts"

interface RegisterUserRequest {
  name: string
  email: string
  phone?: string
  password: string
}

interface RegisterUserResponse {
  token: string
  refreshToken: string
  user: PublicUser
}

export class RegisterUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JWTService,
    private readonly userSessionsRepository: UserSessionsRepository,
  ) {}

  async execute(data: RegisterUserRequest): Promise<RegisterUserResponse> {
    const normalizedEmail = data.email.trim().toLowerCase()
    const existingUser = await this.usersRepository.findByEmail(normalizedEmail)

    if (existingUser) {
      throw new AppError("Já existe um usuário com este e-mail.", 409, undefined, "EMAIL_ALREADY_IN_USE")
    }

    const now = new Date().toISOString()
    const user = await this.usersRepository.create({
      id: randomUUID(),
      name: data.name.trim(),
      email: normalizedEmail,
      phone: data.phone?.trim() || null,
      passwordHash: hashPassword(data.password),
      avatarUrl: null,
      createdAt: now,
      updatedAt: now,
    })

    const tokens = this.jwtService.generateTokenPair({ id: user.id, email: user.email })
    const expiresAt = this.jwtService.getRefreshTokenExpiryDate()

    await this.userSessionsRepository.create({
      id: randomUUID(),
      userId: user.id,
      refreshTokenHash: this.jwtService.hashRefreshToken(tokens.refreshToken),
      expiresAt: expiresAt.toISOString(),
      createdAt: now,
      updatedAt: now,
    })

    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: toPublicUser(user),
    }
  }
}
