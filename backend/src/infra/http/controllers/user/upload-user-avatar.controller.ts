import { FastifyReply, FastifyRequest } from "fastify"
import { AppError } from "../../../../shared/errors/app.error.ts"
import { UploadUserAvatarUseCase } from "../../../../domain/user/use-cases/upload-user-avatar.ts"

export class UploadUserAvatarController {
  constructor(private readonly uploadUserAvatarUseCase: UploadUserAvatarUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const file = await request.file()

    if (!file) {
      throw new AppError("Envie um arquivo no campo avatar.", 400, undefined, "AVATAR_FILE_REQUIRED")
    }

    const chunks = []
    for await (const chunk of file.file) {
      chunks.push(chunk)
    }

    const result = await this.uploadUserAvatarUseCase.execute(request.authUser!.id, {
      buffer: Buffer.concat(chunks),
      mimeType: file.mimetype,
    })

    return reply.send(result)
  }
}
