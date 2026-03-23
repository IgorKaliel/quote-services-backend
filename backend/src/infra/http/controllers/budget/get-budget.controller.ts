import { FastifyReply, FastifyRequest } from "fastify"
import { GetBudgetUseCase } from "../../../../domain/budget/use-cases/get-budget.ts"

export class GetBudgetController {
  constructor(private readonly getBudgetUseCase: GetBudgetUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { budgetId: string }
    const result = await this.getBudgetUseCase.execute(params.budgetId, request.authUser!.id)
    return reply.send(result)
  }
}
