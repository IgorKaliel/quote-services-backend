import { AppError } from "../../../shared/errors/app.error.ts"
import { PublicUser, toPublicUser } from "../entities/user.ts"
import { UsersRepository } from "../repositories/users-repository.ts"

export class GetUserProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<PublicUser> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404, undefined, "USER_NOT_FOUND")
    }

    return toPublicUser(user)
  }
}
