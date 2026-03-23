import { FastifyInstance } from "fastify"
import { CreateCategoryUseCase } from "../../../domain/category/use-cases/create-category.ts"
import { ListCategoriesUseCase } from "../../../domain/category/use-cases/list-categories.ts"
import { DrizzleCategoriesRepository } from "../../database/drizzle/repositories/drizzle-categories-repository.ts"
import { CreateCategoryController } from "../controllers/category/create-category.controller.ts"
import { ListCategoriesController } from "../controllers/category/list-categories.controller.ts"
import { CheckAuthtenticationMiddleware } from "../middleware/check-authentication.ts"
import { createCategorySchema } from "./schemas/categories/create-category.schema.ts"
import { listCategoriesSchema } from "./schemas/categories/list-categories.schema.ts"

export const configure = (fastify: FastifyInstance) => {
  const categoriesRepository = new DrizzleCategoriesRepository()
  const checkAuthentication = new CheckAuthtenticationMiddleware()

  const createCategoryController = new CreateCategoryController(new CreateCategoryUseCase(categoriesRepository))
  const listCategoriesController = new ListCategoriesController(new ListCategoriesUseCase(categoriesRepository))

  fastify.get("/categories", { preHandler: [checkAuthentication.execute], schema: listCategoriesSchema }, listCategoriesController.execute)
  fastify.post("/categories", { preHandler: [checkAuthentication.execute], schema: createCategorySchema }, createCategoryController.execute)
}
