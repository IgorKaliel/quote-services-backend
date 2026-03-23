import { FastifyReply, FastifyRequest } from "fastify"
import { logoutSessionSchema } from "../../../../../../packages/zod/dist/index.js"
import { LogoutSessionUseCase } from "../../../../domain/user/use-cases/logout-session.ts"

export class LogoutSessionController {
  constructor(private readonly logoutSessionUseCase: LogoutSessionUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = logoutSessionSchema.parse(request.body)
    await this.logoutSessionUseCase.execute(payload)
    return reply.status(204).send()
  }
}
