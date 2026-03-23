import { Paginated } from "../../../interfaces/paginated.ts"
import { OrderDirection } from "../../../interfaces/order-direction.ts"
import { Budget, BudgetDetails, BudgetDiscountType, BudgetItem, BudgetStatus, BudgetSummary } from "../entities/budget.ts"

export interface CreateBudgetItemInput {
  id: string
  title: string
  description: string | null
  unitPrice: number
  quantity: number
  total: number
  createdAt: string
  updatedAt: string
}

export interface CreateBudgetInput {
  id: string
  userId: string
  clientId: string
  categoryId: string | null
  title: string
  description: string | null
  status: BudgetStatus
  discountType: BudgetDiscountType
  discountValue: number
  subtotal: number
  total: number
  publicToken: string | null
  createdAt: string
  updatedAt: string
  items: CreateBudgetItemInput[]
}

export interface ListBudgetsFilters {
  userId: string
  page: number
  perPage: number
  search?: string
  status?: BudgetStatus
  sortBy: "createdAt" | "updatedAt" | "total" | "title"
  sortDirection: OrderDirection
}

export interface UpdateBudgetStatusInput {
  budgetId: string
  userId: string
  status: BudgetStatus
  updatedAt: string
}

export interface UpdateBudgetInput {
  budgetId: string
  userId: string
  clientId: string
  categoryId: string | null
  title: string
  description: string | null
  status: BudgetStatus
  discountType: BudgetDiscountType
  discountValue: number
  subtotal: number
  total: number
  updatedAt: string
  items: CreateBudgetItemInput[]
}

export interface BudgetsRepository {
  create(data: CreateBudgetInput): Promise<BudgetDetails>
  findMany(filters: ListBudgetsFilters): Promise<Paginated<BudgetSummary>>
  findByIdAndUserId(budgetId: string, userId: string): Promise<BudgetDetails | null>
  findRawByIdAndUserId(budgetId: string, userId: string): Promise<Budget | null>
  updateStatus(data: UpdateBudgetStatusInput): Promise<BudgetDetails | null>
  update(data: UpdateBudgetInput): Promise<BudgetDetails | null>
  ensurePublicToken(budgetId: string, userId: string, publicToken: string, updatedAt: string): Promise<BudgetDetails | null>
  findByPublicToken(publicToken: string): Promise<BudgetDetails | null>
}
