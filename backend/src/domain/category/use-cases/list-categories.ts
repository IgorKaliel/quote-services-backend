import { Category } from "../entities/category.ts"
import { CategoriesRepository } from "../repositories/categories-repository.ts"

export class ListCategoriesUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute(userId: string): Promise<Category[]> {
    return this.categoriesRepository.findManyByUserId(userId)
  }
}
