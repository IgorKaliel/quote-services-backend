import { AppError } from "../../../shared/errors/app.error.ts"
import { UsersRepository } from "../repositories/users-repository.ts"

export interface UploadAvatarFile {
  buffer: Buffer
  mimeType: string
}

export interface AvatarStorage {
  save(userId: string, file: UploadAvatarFile, currentAvatarUrl: string | null): string
}

export class UploadUserAvatarUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly avatarStorage: AvatarStorage,
  ) {}

  async execute(userId: string, file: UploadAvatarFile): Promise<{ avatarUrl: string }> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404, undefined, "USER_NOT_FOUND")
    }

    const avatarUrl = this.avatarStorage.save(userId, file, user.avatarUrl)

    await this.usersRepository.updateAvatar({
      userId,
      avatarUrl,
      updatedAt: new Date().toISOString(),
    })

    return { avatarUrl }
  }
}
