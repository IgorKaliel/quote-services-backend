import { FastifyReply, FastifyRequest } from "fastify"
import { UpdateBudgetStatusUseCase } from "../../../../domain/budget/use-cases/update-budget-status.ts"

export class UpdateBudgetStatusController {
  constructor(private readonly updateBudgetStatusUseCase: UpdateBudgetStatusUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { budgetId: string }
    const body = request.body as { status: "draft" | "sent" | "approved" | "rejected" }
    const result = await this.updateBudgetStatusUseCase.execute(params.budgetId, request.authUser!.id, body.status)
    return reply.send(result)
  }
}
