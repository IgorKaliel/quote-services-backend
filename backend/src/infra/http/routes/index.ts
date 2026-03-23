import { FastifyInstance } from "fastify"
import { configure as configureAuthRoutes } from "./auth.routes.ts"
import { configure as configureBudgetsRoutes } from "./budgets.routes.ts"
import { configure as configureCategoriesRoutes } from "./categories.routes.ts"
import { configure as configureClientRoutes } from "./clients.routes.ts"
import { configure as configureHealthRoutes } from "./health.routes.ts"

export const register = async (fastify: FastifyInstance) => {
  configureHealthRoutes(fastify)
  configureAuthRoutes(fastify)
  configureClientRoutes(fastify)
  configureCategoriesRoutes(fastify)
  configureBudgetsRoutes(fastify)
}
