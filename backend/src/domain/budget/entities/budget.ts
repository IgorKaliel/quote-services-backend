export type BudgetStatus = "draft" | "sent" | "approved" | "rejected"

export type BudgetDiscountType = "percentage" | "fixed" | null

export interface BudgetItem {
  id: string
  budgetId: string
  title: string
  description: string | null
  unitPrice: number
  quantity: number
  total: number
  createdAt: string
  updatedAt: string
}

export interface Budget {
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
}

export interface BudgetSummary {
  id: string
  clientId: string
  clientName: string
  categoryId: string | null
  categoryName: string | null
  title: string
  status: BudgetStatus
  itemCount: number
  subtotal: number
  total: number
  createdAt: string
  updatedAt: string
}

export interface BudgetDetails extends BudgetSummary {
  description: string | null
  discountType: BudgetDiscountType
  discountValue: number
  publicToken: string | null
  items: BudgetItem[]
}
