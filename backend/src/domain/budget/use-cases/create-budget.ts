import { randomUUID } from "node:crypto"
import { AppError } from "../../../shared/errors/app.error.ts"
import { BudgetDetails, BudgetDiscountType, BudgetStatus } from "../entities/budget.ts"
import { BudgetsRepository } from "../repositories/budgets-repository.ts"
import { CategoriesRepository } from "../../category/repositories/categories-repository.ts"
import { ClientsRepository } from "../../client/repositories/clients-repository.ts"

interface CreateBudgetItemRequest {
  title: string
  description?: string
  unitPrice: number
  quantity: number
}

interface CreateBudgetRequest {
  userId: string
  clientId: string
  categoryId?: string | null
  title: string
  description?: string
  status?: BudgetStatus
  discountType?: BudgetDiscountType
  discountValue?: number
  items: CreateBudgetItemRequest[]
}

export class CreateBudgetUseCase {
  constructor(
    private readonly budgetsRepository: BudgetsRepository,
    private readonly clientsRepository: ClientsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute(data: CreateBudgetRequest): Promise<BudgetDetails> {
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
    const normalizedItems = data.items.map((item) => {
      const quantity = Number(item.quantity)
      const unitPrice = Number(item.unitPrice)
      const total = Number((quantity * unitPrice).toFixed(2))

      return {
        id: randomUUID(),
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

    return this.budgetsRepository.create({
      id: randomUUID(),
      userId: data.userId,
      clientId: data.clientId,
      categoryId: data.categoryId ?? null,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      status: data.status ?? "draft",
      discountType,
      discountValue,
      subtotal,
      total,
      publicToken: null,
      createdAt: now,
      updatedAt: now,
      items: normalizedItems,
    })
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
