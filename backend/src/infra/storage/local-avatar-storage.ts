import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs"
import path from "node:path"
import { AppError } from "../../shared/errors/app.error.ts"
import { AvatarStorage, UploadAvatarFile } from "../../domain/user/use-cases/upload-user-avatar.ts"

export const storageRootPath = path.resolve(process.cwd(), "src", "infra", "storage")
export const avatarsStoragePath = path.join(storageRootPath, "avatars")
export const dataStoragePath = path.join(storageRootPath, "data")

export class LocalAvatarStorage implements AvatarStorage {
  save(userId: string, file: UploadAvatarFile, currentAvatarUrl: string | null): string {
    const allowedMimeTypes = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"])

    if (!allowedMimeTypes.has(file.mimeType)) {
      throw new AppError("Formato de imagem inválido.", 400, undefined, "INVALID_AVATAR_TYPE")
    }

    mkdirSync(avatarsStoragePath, { recursive: true })

    const extension = mimeTypeToExtension(file.mimeType)
    const fileName = `${userId}-${Date.now()}.${extension}`
    const filePath = path.join(avatarsStoragePath, fileName)

    writeFileSync(filePath, file.buffer)

    if (currentAvatarUrl) {
      const currentFilePath = path.join(storageRootPath, currentAvatarUrl.replace(/^\/storage\//, ""))

      if (existsSync(currentFilePath)) {
        unlinkSync(currentFilePath)
      }
    }

    return `/storage/avatars/${fileName}`
  }
}

export const ensureStorageStructure = () => {
  mkdirSync(avatarsStoragePath, { recursive: true })
  mkdirSync(dataStoragePath, { recursive: true })
}

const mimeTypeToExtension = (mimeType: string) => {
  switch (mimeType) {
    case "image/png":
      return "png"
    case "image/webp":
      return "webp"
    default:
      return "jpg"
  }
}
