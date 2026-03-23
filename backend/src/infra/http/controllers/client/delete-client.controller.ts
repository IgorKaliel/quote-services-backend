import { FastifyReply, FastifyRequest } from "fastify"
import { DeleteClientUseCase } from "../../../../domain/client/use-cases/delete-client.ts"

export class DeleteClientController {
  constructor(private readonly deleteClientUseCase: DeleteClientUseCase) {}

  execute = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const params = request.params as { clientId: string }
    await this.deleteClientUseCase.execute(params.clientId, request.authUser!.id)
    return reply.status(204).send()
  }
}
