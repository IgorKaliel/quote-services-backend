import { AppError } from "../../../shared/errors/app.error.ts"
import { CategoriesRepository } from "../../category/repositories/categories-repository.ts"
import { ClientsRepository } from "../../client/repositories/clients-repository.ts"
import { BudgetDetails, BudgetDiscountType, BudgetStatus } from "../entities/budget.ts"
import { BudgetsRepository } from "../repositories/budgets-repository.ts"

interface UpdateBudgetItemRequest {
  title: string
  description?: string
  unitPrice: number
  quantity: number
}

interface UpdateBudgetRequest {
  budgetId: string
  userId: string
  clientId: string
  categoryId?: string | null
  title: string
  description?: string
  status?: BudgetStatus
  discountType?: BudgetDiscountType
  discountValue?: number
  items: UpdateBudgetItemRequest[]
}

export class UpdateBudgetUseCase {
  constructor(
    private readonly budgetsRepository: BudgetsRepository,
    private readonly clientsRepository: ClientsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute(data: UpdateBudgetRequest): Promise<BudgetDetails> {
    const existingBudget = await this.budgetsRepository.findRawByIdAndUserId(data.budgetId, data.userId)
    if (!existingBudget) {
      throw new AppError("Orçamento não encontrado.", 404, undefined, "BUDGET_NOT_FOUND")
    }

    const client = await this.clientsRepository.findByIdAndUserId(data.clientId, data.userId)
    if (!client) {
      throw new AppError("Cliente não encontrado.", 404, undefined, "CLIENT_NOT_FOUND")
    }

    if (data.categoryId) {
      const category = await this.categoriesRepository.findByIdAndUserId(data.categoryId, data.userId)
      if (!category) {
        throw new AppError("Categoria não encontrada.", 404, undefined, "CATEGORY_NOT_FOUND")
      }
    }

    if (!data.items.length) {
      throw new AppError("O orçamento precisa ter ao menos um item.", 400, undefined, "BUDGET_ITEMS_REQUIRED")
    }

    const now = new Date().toISOString()
    const normalizedItems = data.items.map((item, index) => {
      const quantity = Number(item.quantity)
      const unitPrice = Number(item.unitPrice)
      const total = Number((quantity * unitPrice).toFixed(2))

      return {
        id: `${existingBudget.id}-item-${index + 1}-${Date.now()}`,
        title: item.title.trim(),
        description: item.description?.trim() || null,
        quantity,
        unitPrice,
        total,
        createdAt: now,
        updatedAt: now,
      }
    })

    const subtotal = Number(normalizedItems.reduce((sum, item) => sum + item.total, 0).toFixed(2))
    const discountType = data.discountType ?? null
    const discountValue = Number((data.discountValue ?? 0).toFixed(2))
    const total = calculateBudgetTotal(subtotal, discountType, discountValue)

    return (await this.budgetsRepository.update({
      budgetId: data.budgetId,
      userId: data.userId,
      clientId: data.clientId,
      categoryId: data.categoryId ?? null,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      status: data.status ?? existingBudget.status,
      discountType,
      discountValue,
      subtotal,
      total,
      updatedAt: now,
      items: normalizedItems,
    }))!
  }
}

const calculateBudgetTotal = (subtotal: number, discountType: BudgetDiscountType, discountValue: number) => {
  if (discountType === "percentage") {
    return Number((Math.max(subtotal - subtotal * (discountValue / 100), 0)).toFixed(2))
  }

  if (discountType === "fixed") {
    return Number((Math.max(subtotal - discountValue, 0)).toFixed(2))
  }

  return subtotal
}
