import { FastifyReply, FastifyRequest } from "fastify"
import { refreshSessionSchema } from "../../../../../../packages/zod/dist/index.js"
import { RefreshSessionUseCase } from "../../../../domain/user/use-cases/refresh-session.ts"

export class RefreshSessionController {
  constructor(private readonly refreshSessionUseCase: RefreshSessionUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = refreshSessionSchema.parse(request.body)
    const result = await this.refreshSessionUseCase.execute(payload)
    return reply.send(result)
  }
}
