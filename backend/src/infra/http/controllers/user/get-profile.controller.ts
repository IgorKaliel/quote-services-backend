import { FastifyReply, FastifyRequest } from "fastify"
import { GetUserProfileUseCase } from "../../../../domain/user/use-cases/get-user-profile.ts"

export class GetProfileController {
  constructor(private readonly getUserProfileUseCase: GetUserProfileUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.getUserProfileUseCase.execute(request.authUser!.id)
    return reply.send(result)
  }
}
