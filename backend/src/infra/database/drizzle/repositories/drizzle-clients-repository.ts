import { and, asc, count, desc, eq } from "../../../../../../packages/drizzle/node_modules/drizzle-orm/index.js"
import { clientsTable } from "../../../../../../packages/drizzle/dist/index.js"
import { Paginated } from "../../../../interfaces/paginated.ts"
import { OrderDirection } from "../../../../interfaces/order-direction.ts"
import { Client } from "../../../../domain/client/entities/client.ts"
import {
  ClientsRepository,
  CreateClientInput,
  ListClientsFilters,
  UpdateClientInput,
} from "../../../../domain/client/repositories/clients-repository.ts"
import { getDb } from "../client.ts"

const mapClient = (row: typeof clientsTable.$inferSelect): Client => ({
  id: row.id,
  userId: row.userId,
  name: row.name,
  email: row.email,
  phone: row.phone,
  company: row.company,
  notes: row.notes,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
})

export class DrizzleClientsRepository implements ClientsRepository {
  async create(data: CreateClientInput): Promise<Client> {
    const db = getDb()
    await db.insert(clientsTable).values({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    })

    return (await this.findByIdAndUserId(data.id, data.userId))!
  }

  async findManyByUserId(filters: ListClientsFilters): Promise<Paginated<Client>> {
    const db = getDb()
    const offset = (filters.page - 1) * filters.perPage
    const orderColumn = mapSortBy(filters.sortBy)
    const orderDirection = normalizeSortDirection(filters.sortDirection)

    const totalRowsResult = await db
      .select({ total: count() })
      .from(clientsTable)
      .where(eq(clientsTable.userId, filters.userId))

    const rows = await db.query.clientsTable.findMany({
      where: eq(clientsTable.userId, filters.userId),
      orderBy: [orderDirection === "asc" ? asc(orderColumn) : desc(orderColumn)],
      limit: filters.perPage,
      offset,
    })

    const data = rows.map(mapClient)
    const totalRows = Number(totalRowsResult[0]?.total ?? 0)

    return {
      data,
      totalRows,
      totalPages: Math.max(Math.ceil(totalRows / filters.perPage), 1),
      page: filters.page,
      perPage: filters.perPage,
    }
  }

  async findByIdAndUserId(clientId: string, userId: string): Promise<Client | null> {
    const db = getDb()
    const row = await db.query.clientsTable.findFirst({
      where: and(eq(clientsTable.id, clientId), eq(clientsTable.userId, userId)),
    })

    return row ? mapClient(row) : null
  }

  async update(data: UpdateClientInput): Promise<Client | null> {
    const db = getDb()
    await db
      .update(clientsTable)
      .set({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        notes: data.notes,
        updatedAt: new Date(data.updatedAt),
      })
      .where(and(eq(clientsTable.id, data.clientId), eq(clientsTable.userId, data.userId)))

    return this.findByIdAndUserId(data.clientId, data.userId)
  }

  async delete(clientId: string, userId: string): Promise<void> {
    const db = getDb()
    await db.delete(clientsTable).where(and(eq(clientsTable.id, clientId), eq(clientsTable.userId, userId)))
  }
}

const mapSortBy = (sortBy: ListClientsFilters["sortBy"]) => {
  switch (sortBy) {
    case "name":
      return clientsTable.name
    case "company":
      return clientsTable.company
    case "updatedAt":
      return clientsTable.updatedAt
    default:
      return clientsTable.createdAt
  }
}

const normalizeSortDirection = (direction: OrderDirection) => (direction.toLowerCase() === "asc" ? "asc" : "desc")
