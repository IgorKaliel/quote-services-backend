import { FastifyReply, FastifyRequest } from "fastify"
import { CreateBudgetUseCase } from "../../../../domain/budget/use-cases/create-budget.ts"

export class CreateBudgetController {
  constructor(private readonly createBudgetUseCase: CreateBudgetUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.createBudgetUseCase.execute({
      userId: request.authUser!.id,
      ...(request.body as {
        clientId: string
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

    return reply.status(201).send(result)
  }
}
