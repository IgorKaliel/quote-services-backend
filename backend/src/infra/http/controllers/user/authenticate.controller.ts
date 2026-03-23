import { FastifyReply, FastifyRequest } from "fastify"
import { AuthenticateUserUseCase } from "../../../../domain/user/use-cases/authenticate-user.ts"
import { authenticateUserSchema } from "../../../../../../packages/zod/dist/index.js"

export class AuthenticateController {
  constructor(private readonly authenticateUserUseCase: AuthenticateUserUseCase) {}

  execute = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const payload = authenticateUserSchema.parse(request.body)
    const result = await this.authenticateUserUseCase.execute(payload)
    return reply.send(result)
  }
}
