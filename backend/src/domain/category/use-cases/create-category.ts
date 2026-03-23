import { randomUUID } from "node:crypto"
import { Category } from "../entities/category.ts"
import { CategoriesRepository } from "../repositories/categories-repository.ts"

interface CreateCategoryRequest {
  userId: string
  name: string
  description?: string
  color?: string
}

export class CreateCategoryUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute(data: CreateCategoryRequest): Promise<Category> {
    const now = new Date().toISOString()

    return this.categoriesRepository.create({
      id: randomUUID(),
      userId: data.userId,
      name: data.name.trim(),
      description: data.description?.trim() || null,
      color: data.color?.trim() || null,
      createdAt: now,
      updatedAt: now,
    })
  }
}
