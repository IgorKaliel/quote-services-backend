import { FastifyReply, FastifyRequest } from "fastify"
import { ListClientsUseCase } from "../../../../domain/client/use-cases/list-clients.ts"

export class ListClientsController {
  constructor(private readonly listClientsUseCase: ListClientsUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as {
      page?: number
      perPage?: number
      sortBy?: "createdAt" | "updatedAt" | "name" | "company"
      sortDirection?: "ASC" | "asc" | "DESC" | "desc"
    }

    const result = await this.listClientsUseCase.execute({
      userId: request.authUser!.id,
      ...query,
    })

    return reply.send(result)
  }
}
