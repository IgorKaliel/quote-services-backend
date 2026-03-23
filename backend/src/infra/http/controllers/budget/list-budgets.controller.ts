import { FastifyReply, FastifyRequest } from "fastify"
import { ListBudgetsUseCase } from "../../../../domain/budget/use-cases/list-budgets.ts"

export class ListBudgetsController {
  constructor(private readonly listBudgetsUseCase: ListBudgetsUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as {
      page?: number
      perPage?: number
      search?: string
      status?: "draft" | "sent" | "approved" | "rejected"
      sortBy?: "createdAt" | "updatedAt" | "total" | "title"
      sortDirection?: "ASC" | "asc" | "DESC" | "desc"
    }

    const result = await this.listBudgetsUseCase.execute({
      userId: request.authUser!.id,
      ...query,
    })

    return reply.send(result)
  }
}
