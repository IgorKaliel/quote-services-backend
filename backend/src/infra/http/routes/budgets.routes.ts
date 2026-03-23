import { FastifyInstance } from "fastify"
import { CreateBudgetUseCase } from "../../../domain/budget/use-cases/create-budget.ts"
import { GenerateBudgetShareUseCase } from "../../../domain/budget/use-cases/generate-budget-share.ts"
import { GetBudgetUseCase } from "../../../domain/budget/use-cases/get-budget.ts"
import { GetPublicBudgetUseCase } from "../../../domain/budget/use-cases/get-public-budget.ts"
import { ListBudgetsUseCase } from "../../../domain/budget/use-cases/list-budgets.ts"
import { UpdateBudgetStatusUseCase } from "../../../domain/budget/use-cases/update-budget-status.ts"
import { UpdateBudgetUseCase } from "../../../domain/budget/use-cases/update-budget.ts"
import { DrizzleCategoriesRepository } from "../../database/drizzle/repositories/drizzle-categories-repository.ts"
import { DrizzleBudgetsRepository } from "../../database/drizzle/repositories/drizzle-budgets-repository.ts"
import { DrizzleClientsRepository } from "../../database/drizzle/repositories/drizzle-clients-repository.ts"
import { CreateBudgetController } from "../controllers/budget/create-budget.controller.ts"
import { GenerateBudgetShareController } from "../controllers/budget/generate-budget-share.controller.ts"
import { GetBudgetController } from "../controllers/budget/get-budget.controller.ts"
import { GetPublicBudgetController } from "../controllers/budget/get-public-budget.controller.ts"
import { ListBudgetsController } from "../controllers/budget/list-budgets.controller.ts"
import { UpdateBudgetController } from "../controllers/budget/update-budget.controller.ts"
import { UpdateBudgetStatusController } from "../controllers/budget/update-budget-status.controller.ts"
import { CheckAuthtenticationMiddleware } from "../middleware/check-authentication.ts"
import { createBudgetSchema } from "./schemas/budgets/create-budget.schema.ts"
import { generateBudgetShareSchema } from "./schemas/budgets/generate-budget-share.schema.ts"
import { getBudgetSchema } from "./schemas/budgets/get-budget.schema.ts"
import { getPublicBudgetSchema } from "./schemas/budgets/get-public-budget.schema.ts"
import { listBudgetsSchema } from "./schemas/budgets/list-budgets.schema.ts"
import { updateBudgetSchema } from "./schemas/budgets/update-budget.schema.ts"
import { updateBudgetStatusSchema } from "./schemas/budgets/update-budget-status.schema.ts"

export const configure = (fastify: FastifyInstance) => {
  const budgetsRepository = new DrizzleBudgetsRepository()
  const clientsRepository = new DrizzleClientsRepository()
  const categoriesRepository = new DrizzleCategoriesRepository()
  const checkAuthentication = new CheckAuthtenticationMiddleware()

  const createBudgetController = new CreateBudgetController(
    new CreateBudgetUseCase(budgetsRepository, clientsRepository, categoriesRepository),
  )
  const listBudgetsController = new ListBudgetsController(new ListBudgetsUseCase(budgetsRepository))
  const getBudgetController = new GetBudgetController(new GetBudgetUseCase(budgetsRepository))
  const updateBudgetController = new UpdateBudgetController(
    new UpdateBudgetUseCase(budgetsRepository, clientsRepository, categoriesRepository),
  )
  const updateBudgetStatusController = new UpdateBudgetStatusController(
    new UpdateBudgetStatusUseCase(budgetsRepository),
  )
  const generateBudgetShareController = new GenerateBudgetShareController(
    new GenerateBudgetShareUseCase(budgetsRepository),
  )
  const getPublicBudgetController = new GetPublicBudgetController(new GetPublicBudgetUseCase(budgetsRepository))

  fastify.get("/budgets", { preHandler: [checkAuthentication.execute], schema: listBudgetsSchema }, listBudgetsController.execute)
  fastify.post("/budgets", { preHandler: [checkAuthentication.execute], schema: createBudgetSchema }, createBudgetController.execute)
  fastify.get(
    "/budgets/:budgetId",
    { preHandler: [checkAuthentication.execute], schema: getBudgetSchema },
    getBudgetController.execute,
  )
  fastify.put(
    "/budgets/:budgetId",
    { preHandler: [checkAuthentication.execute], schema: updateBudgetSchema },
    updateBudgetController.execute,
  )
  fastify.patch(
    "/budgets/:budgetId/status",
    { preHandler: [checkAuthentication.execute], schema: updateBudgetStatusSchema },
    updateBudgetStatusController.execute,
  )
  fastify.post(
    "/budgets/:budgetId/share",
    { preHandler: [checkAuthentication.execute], schema: generateBudgetShareSchema },
    generateBudgetShareController.execute,
  )
  fastify.get("/public/budgets/:publicToken", { schema: getPublicBudgetSchema }, getPublicBudgetController.execute)
}
