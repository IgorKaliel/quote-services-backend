import { Paginated } from "../../../interfaces/paginated.ts"
import { OrderDirection } from "../../../interfaces/order-direction.ts"
import { BudgetStatus, BudgetSummary } from "../entities/budget.ts"
import { BudgetsRepository } from "../repositories/budgets-repository.ts"

interface ListBudgetsRequest {
  userId: string
  page?: number
  perPage?: number
  search?: string
  status?: BudgetStatus
  sortBy?: "createdAt" | "updatedAt" | "total" | "title"
  sortDirection?: OrderDirection
}

export class ListBudgetsUseCase {
  constructor(private readonly budgetsRepository: BudgetsRepository) {}

  async execute(data: ListBudgetsRequest): Promise<Paginated<BudgetSummary>> {
    return this.budgetsRepository.findMany({
      userId: data.userId,
      page: Math.max(data.page ?? 1, 1),
      perPage: Math.min(Math.max(data.perPage ?? 10, 1), 100),
      search: data.search?.trim() || undefined,
      status: data.status,
      sortBy: data.sortBy ?? "createdAt",
      sortDirection: data.sortDirection ?? "desc",
    })
  }
}
