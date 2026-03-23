import { Category } from "../entities/category.ts"

export interface CreateCategoryInput {
  id: string
  userId: string
  name: string
  description: string | null
  color: string | null
  createdAt: string
  updatedAt: string
}

export interface CategoriesRepository {
  create(data: CreateCategoryInput): Promise<Category>
  findManyByUserId(userId: string): Promise<Category[]>
  findByIdAndUserId(categoryId: string, userId: string): Promise<Category | null>
}
