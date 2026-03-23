import { randomBytes } from "node:crypto"
import { AppError } from "../../../shared/errors/app.error.ts"
import { BudgetDetails } from "../entities/budget.ts"
import { BudgetsRepository } from "../repositories/budgets-repository.ts"

export class GenerateBudgetShareUseCase {
  constructor(private readonly budgetsRepository: BudgetsRepository) {}

  async execute(budgetId: string, userId: string): Promise<BudgetDetails> {
    const budget = await this.budgetsRepository.findRawByIdAndUserId(budgetId, userId)
    if (!budget) {
      throw new AppError("Orçamento não encontrado.", 404, undefined, "BUDGET_NOT_FOUND")
    }

    const token = randomBytes(18).toString("hex")
    return (await this.budgetsRepository.ensurePublicToken(budgetId, userId, token, new Date().toISOString()))!
  }
}
