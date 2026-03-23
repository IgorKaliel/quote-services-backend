import { FastifyReply, FastifyRequest } from "fastify"
import { GetPublicBudgetUseCase } from "../../../../domain/budget/use-cases/get-public-budget.ts"

export class GetPublicBudgetController {
  constructor(private readonly getPublicBudgetUseCase: GetPublicBudgetUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { publicToken: string }
    return reply.send(await this.getPublicBudgetUseCase.execute(params.publicToken))
  }
}
