import { AppError } from "../../../shared/errors/app.error.ts"
import { BudgetDetails } from "../entities/budget.ts"
import { BudgetsRepository } from "../repositories/budgets-repository.ts"

export class GetPublicBudgetUseCase {
  constructor(private readonly budgetsRepository: BudgetsRepository) {}

  async execute(publicToken: string): Promise<BudgetDetails> {
    const budget = await this.budgetsRepository.findByPublicToken(publicToken)
    if (!budget) {
      throw new AppError("Orçamento público não encontrado.", 404, undefined, "PUBLIC_BUDGET_NOT_FOUND")
    }

    return budget
  }
}
