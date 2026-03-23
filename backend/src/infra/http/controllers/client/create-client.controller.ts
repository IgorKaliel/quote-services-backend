import { FastifyReply, FastifyRequest } from "fastify"
import { CreateClientUseCase } from "../../../../domain/client/use-cases/create-client.ts"

export class CreateClientController {
  constructor(private readonly createClientUseCase: CreateClientUseCase) {}

  execute = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const result = await this.createClientUseCase.execute({
      userId: request.authUser!.id,
      ...(request.body as {
        name: string
        email?: string
        phone?: string
        company?: string
        notes?: string
      }),
    })

    return reply.status(201).send(result)
  }
}
