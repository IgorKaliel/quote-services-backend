import { AppError } from "../../../shared/errors/app.error.ts"
import { BudgetDetails, BudgetStatus } from "../entities/budget.ts"
import { BudgetsRepository } from "../repositories/budgets-repository.ts"

export class UpdateBudgetStatusUseCase {
  constructor(private readonly budgetsRepository: BudgetsRepository) {}

  async execute(budgetId: string, userId: string, status: BudgetStatus): Promise<BudgetDetails> {
    const existingBudget = await this.budgetsRepository.findRawByIdAndUserId(budgetId, userId)

    if (!existingBudget) {
      throw new AppError("Orçamento não encontrado.", 404, undefined, "BUDGET_NOT_FOUND")
    }

    return (await this.budgetsRepository.updateStatus({
      budgetId,
      userId,
      status,
      updatedAt: new Date().toISOString(),
    }))!
  }
}
