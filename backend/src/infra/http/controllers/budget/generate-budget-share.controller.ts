import { FastifyReply, FastifyRequest } from "fastify"
import { GenerateBudgetShareUseCase } from "../../../../domain/budget/use-cases/generate-budget-share.ts"

export class GenerateBudgetShareController {
  constructor(private readonly generateBudgetShareUseCase: GenerateBudgetShareUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { budgetId: string }
    const result = await this.generateBudgetShareUseCase.execute(params.budgetId, request.authUser!.id)
    return reply.send(result)
  }
}
