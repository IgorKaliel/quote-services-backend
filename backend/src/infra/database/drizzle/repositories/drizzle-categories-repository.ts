import { and, asc, eq } from "../../../../../../packages/drizzle/node_modules/drizzle-orm/index.js"
import { categoriesTable } from "../../../../../../packages/drizzle/dist/index.js"
import { Category } from "../../../../domain/category/entities/category.ts"
import {
  CategoriesRepository,
  CreateCategoryInput,
} from "../../../../domain/category/repositories/categories-repository.ts"
import { getDb } from "../client.ts"

const mapCategory = (row: typeof categoriesTable.$inferSelect): Category => ({
  id: row.id,
  userId: row.userId,
  name: row.name,
  description: row.description,
  color: row.color,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
})

export class DrizzleCategoriesRepository implements CategoriesRepository {
  async create(data: CreateCategoryInput): Promise<Category> {
    const db = getDb()
    await db.insert(categoriesTable).values({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    })

    return (await this.findByIdAndUserId(data.id, data.userId))!
  }

  async findManyByUserId(userId: string): Promise<Category[]> {
    const db = getDb()
    const rows = await db.query.categoriesTable.findMany({
      where: eq(categoriesTable.userId, userId),
      orderBy: [asc(categoriesTable.name)],
    })

    return rows.map(mapCategory)
  }

  async findByIdAndUserId(categoryId: string, userId: string): Promise<Category | null> {
    const db = getDb()
    const row = await db.query.categoriesTable.findFirst({
      where: and(eq(categoriesTable.id, categoryId), eq(categoriesTable.userId, userId)),
    })

    return row ? mapCategory(row) : null
  }
}
