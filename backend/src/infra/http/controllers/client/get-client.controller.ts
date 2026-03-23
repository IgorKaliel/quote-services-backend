import { FastifyReply, FastifyRequest } from "fastify"
import { GetClientUseCase } from "../../../../domain/client/use-cases/get-client.ts"

export class GetClientController {
  constructor(private readonly getClientUseCase: GetClientUseCase) {}

  execute = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const params = request.params as { clientId: string }
    const result = await this.getClientUseCase.execute(params.clientId, request.authUser!.id)
    return reply.send(result)
  }
}
