import { and, asc, count, desc, eq, ilike, sql } from "../../../../../../packages/drizzle/node_modules/drizzle-orm/index.js"
import { budgetItemsTable, budgetsTable, categoriesTable, clientsTable } from "../../../../../../packages/drizzle/dist/index.js"
import { Paginated } from "../../../../interfaces/paginated.ts"
import { OrderDirection } from "../../../../interfaces/order-direction.ts"
import { Budget, BudgetDetails, BudgetItem, BudgetSummary } from "../../../../domain/budget/entities/budget.ts"
import {
  BudgetsRepository,
  CreateBudgetInput,
  ListBudgetsFilters,
  UpdateBudgetInput,
  UpdateBudgetStatusInput,
} from "../../../../domain/budget/repositories/budgets-repository.ts"
import { getDb } from "../client.ts"

type BudgetWithRelations = typeof budgetsTable.$inferSelect & {
  client: typeof clientsTable.$inferSelect
  category: typeof categoriesTable.$inferSelect | null
  items: Array<typeof budgetItemsTable.$inferSelect>
}

const mapBudget = (row: typeof budgetsTable.$inferSelect): Budget => ({
  id: row.id,
  userId: row.userId,
  clientId: row.clientId,
  categoryId: row.categoryId,
  title: row.title,
  description: row.description,
  status: row.status,
  discountType: row.discountType,
  discountValue: row.discountValue,
  subtotal: row.subtotal,
  total: row.total,
  publicToken: row.publicToken,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
})

const mapBudgetItem = (row: typeof budgetItemsTable.$inferSelect): BudgetItem => ({
  id: row.id,
  budgetId: row.budgetId,
  title: row.title,
  description: row.description,
  unitPrice: row.unitPrice,
  quantity: row.quantity,
  total: row.total,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
})

const mapBudgetDetails = (row: BudgetWithRelations): BudgetDetails => ({
  id: row.id,
  clientId: row.clientId,
  clientName: row.client.name,
  categoryId: row.categoryId,
  categoryName: row.category?.name ?? null,
  title: row.title,
  status: row.status,
  itemCount: row.items.length,
  subtotal: row.subtotal,
  total: row.total,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
  description: row.description,
  discountType: row.discountType,
  discountValue: row.discountValue,
  publicToken: row.publicToken,
  items: row.items.map(mapBudgetItem),
})

export class DrizzleBudgetsRepository implements BudgetsRepository {
  async create(data: CreateBudgetInput): Promise<BudgetDetails> {
    const db = getDb()
    await db.transaction(async (tx) => {
      await tx.insert(budgetsTable).values({
        id: data.id,
        userId: data.userId,
        clientId: data.clientId,
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        status: data.status,
        discountType: data.discountType,
        discountValue: data.discountValue,
        subtotal: data.subtotal,
        total: data.total,
        publicToken: data.publicToken,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      })

      await tx.insert(budgetItemsTable).values(
        data.items.map((item) => ({
          id: item.id,
          budgetId: data.id,
          title: item.title,
          description: item.description,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          total: item.total,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })),
      )
    })

    return (await this.findByIdAndUserId(data.id, data.userId))!
  }

  async findMany(filters: ListBudgetsFilters): Promise<Paginated<BudgetSummary>> {
    const db = getDb()
    const offset = (filters.page - 1) * filters.perPage
    const where = this.buildWhereClause(filters)
    const orderColumn = mapSortBy(filters.sortBy)
    const orderDirection = normalizeSortDirection(filters.sortDirection)

    const totalRowsResult = await db
      .select({ total: count() })
      .from(budgetsTable)
      .innerJoin(clientsTable, eq(clientsTable.id, budgetsTable.clientId))
      .where(where)

    const rows = await db
      .select({
        id: budgetsTable.id,
        clientId: budgetsTable.clientId,
        clientName: clientsTable.name,
        categoryId: budgetsTable.categoryId,
        categoryName: categoriesTable.name,
        title: budgetsTable.title,
        status: budgetsTable.status,
        itemCount: count(budgetItemsTable.id),
        subtotal: budgetsTable.subtotal,
        total: budgetsTable.total,
        createdAt: budgetsTable.createdAt,
        updatedAt: budgetsTable.updatedAt,
      })
      .from(budgetsTable)
      .innerJoin(clientsTable, eq(clientsTable.id, budgetsTable.clientId))
      .leftJoin(categoriesTable, eq(categoriesTable.id, budgetsTable.categoryId))
      .leftJoin(budgetItemsTable, eq(budgetItemsTable.budgetId, budgetsTable.id))
      .where(where)
      .groupBy(
        budgetsTable.id,
        budgetsTable.clientId,
        clientsTable.name,
        budgetsTable.categoryId,
        categoriesTable.name,
        budgetsTable.title,
        budgetsTable.status,
        budgetsTable.subtotal,
        budgetsTable.total,
        budgetsTable.createdAt,
        budgetsTable.updatedAt,
      )
      .orderBy(orderDirection === "asc" ? asc(orderColumn) : desc(orderColumn))
      .limit(filters.perPage)
      .offset(offset)

    const data: BudgetSummary[] = rows.map((row) => ({
      id: row.id,
      clientId: row.clientId,
      clientName: row.clientName,
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      title: row.title,
      status: row.status,
      itemCount: Number(row.itemCount),
      subtotal: row.subtotal,
      total: row.total,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }))

    const totalRows = Number(totalRowsResult[0]?.total ?? 0)

    return {
      data,
      totalRows,
      totalPages: Math.max(Math.ceil(totalRows / filters.perPage), 1),
      page: filters.page,
      perPage: filters.perPage,
    }
  }

  async findByIdAndUserId(budgetId: string, userId: string): Promise<BudgetDetails | null> {
    const db = getDb()
    const row = await db.query.budgetsTable.findFirst({
      where: and(eq(budgetsTable.id, budgetId), eq(budgetsTable.userId, userId)),
      with: {
        client: true,
        category: true,
        items: {
          orderBy: [asc(budgetItemsTable.createdAt)],
        },
      },
    })

    return row ? mapBudgetDetails(row as BudgetWithRelations) : null
  }

  async findRawByIdAndUserId(budgetId: string, userId: string): Promise<Budget | null> {
    const db = getDb()
    const row = await db.query.budgetsTable.findFirst({
      where: and(eq(budgetsTable.id, budgetId), eq(budgetsTable.userId, userId)),
    })

    return row ? mapBudget(row) : null
  }

  async updateStatus(data: UpdateBudgetStatusInput): Promise<BudgetDetails | null> {
    const db = getDb()
    await db
      .update(budgetsTable)
      .set({
        status: data.status,
        updatedAt: new Date(data.updatedAt),
      })
      .where(and(eq(budgetsTable.id, data.budgetId), eq(budgetsTable.userId, data.userId)))

    return this.findByIdAndUserId(data.budgetId, data.userId)
  }

  async update(data: UpdateBudgetInput): Promise<BudgetDetails | null> {
    const db = getDb()
    await db.transaction(async (tx) => {
      await tx
        .update(budgetsTable)
        .set({
          clientId: data.clientId,
          categoryId: data.categoryId,
          title: data.title,
          description: data.description,
          status: data.status,
          discountType: data.discountType,
          discountValue: data.discountValue,
          subtotal: data.subtotal,
          total: data.total,
          updatedAt: new Date(data.updatedAt),
        })
        .where(and(eq(budgetsTable.id, data.budgetId), eq(budgetsTable.userId, data.userId)))

      await tx.delete(budgetItemsTable).where(eq(budgetItemsTable.budgetId, data.budgetId))

      await tx.insert(budgetItemsTable).values(
        data.items.map((item) => ({
          id: item.id,
          budgetId: data.budgetId,
          title: item.title,
          description: item.description,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          total: item.total,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })),
      )
    })

    return this.findByIdAndUserId(data.budgetId, data.userId)
  }

  async ensurePublicToken(
    budgetId: string,
    userId: string,
    publicToken: string,
    updatedAt: string,
  ): Promise<BudgetDetails | null> {
    const db = getDb()
    await db
      .update(budgetsTable)
      .set({
        publicToken,
        updatedAt: new Date(updatedAt),
      })
      .where(and(eq(budgetsTable.id, budgetId), eq(budgetsTable.userId, userId)))

    return this.findByIdAndUserId(budgetId, userId)
  }

  async findByPublicToken(publicToken: string): Promise<BudgetDetails | null> {
    const db = getDb()
    const row = await db.query.budgetsTable.findFirst({
      where: eq(budgetsTable.publicToken, publicToken),
      with: {
        client: true,
        category: true,
        items: {
          orderBy: [asc(budgetItemsTable.createdAt)],
        },
      },
    })

    return row ? mapBudgetDetails(row as BudgetWithRelations) : null
  }

  private buildWhereClause(filters: ListBudgetsFilters) {
    const clauses = [eq(budgetsTable.userId, filters.userId)]

    if (filters.status) {
      clauses.push(eq(budgetsTable.status, filters.status))
    }

    if (filters.search) {
      const searchTerm = `%${filters.search}%`
      clauses.push(sql`(${ilike(budgetsTable.title, searchTerm)} or ${ilike(clientsTable.name, searchTerm)})`)
    }

    return and(...clauses)
  }
}

const mapSortBy = (sortBy: ListBudgetsFilters["sortBy"]) => {
  switch (sortBy) {
    case "title":
      return budgetsTable.title
    case "total":
      return budgetsTable.total
    case "updatedAt":
      return budgetsTable.updatedAt
    default:
      return budgetsTable.createdAt
  }
}

const normalizeSortDirection = (direction: OrderDirection) => (direction.toLowerCase() === "asc" ? "asc" : "desc")
