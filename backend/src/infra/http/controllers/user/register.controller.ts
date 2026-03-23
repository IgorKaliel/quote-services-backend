import { FastifyReply, FastifyRequest } from "fastify"
import { RegisterUserUseCase } from "../../../../domain/user/use-cases/register-user.ts"
import { registerUserSchema } from "../../../../../../packages/zod/dist/index.js"

export class RegisterController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  execute = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const payload = registerUserSchema.parse(request.body)
    const result = await this.registerUserUseCase.execute(payload)
    return reply.status(201).send(result)
  }
}
