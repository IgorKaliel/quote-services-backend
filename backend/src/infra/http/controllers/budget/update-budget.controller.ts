import { FastifyReply, FastifyRequest } from "fastify"
import { UpdateBudgetUseCase } from "../../../../domain/budget/use-cases/update-budget.ts"

export class UpdateBudgetController {
  constructor(private readonly updateBudgetUseCase: UpdateBudgetUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { budgetId: string }
    const result = await this.updateBudgetUseCase.execute({
      budgetId: params.budgetId,
      userId: request.authUser!.id,
      ...(request.body as {
        clientId: string
        categoryId?: string | null
        title: string
        description?: string
        status?: "draft" | "sent" | "approved" | "rejected"
        discountType?: "percentage" | "fixed" | null
        discountValue?: number
        items: Array<{
          title: string
          description?: string
          unitPrice: number
          quantity: number
        }>
      }),
    })

    return reply.send(result)
  }
}
