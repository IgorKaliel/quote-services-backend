import { FastifyReply, FastifyRequest } from "fastify"
import { UpdateClientUseCase } from "../../../../domain/client/use-cases/update-client.ts"

export class UpdateClientController {
  constructor(private readonly updateClientUseCase: UpdateClientUseCase) {}

  execute = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const params = request.params as { clientId: string }
    const result = await this.updateClientUseCase.execute({
      clientId: params.clientId,
      userId: request.authUser!.id,
      ...(request.body as {
        name: string
        email?: string
        phone?: string
        company?: string
        notes?: string
      }),
    })

    return reply.send(result)
  }
}
