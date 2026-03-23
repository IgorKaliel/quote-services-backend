import { FastifyInstance } from "fastify"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import { categorySchema } from "../routes/schemas/categories/category.schema.ts"
import { budgetDetailsSchema } from "../routes/schemas/budgets/budget-details.schema.ts"
import { budgetItemSchema } from "../routes/schemas/budgets/budget-item.schema.ts"
import { budgetSummarySchema } from "../routes/schemas/budgets/budget-summary.schema.ts"
import { clientSchema } from "../routes/schemas/clients/client.schema.ts"

const errorSchema = {
  $id: "ErrorResponse",
  type: "object",
  properties: {
    code: { type: "string" },
    message: { type: "string" },
  },
} as const

const publicUserSchema = {
  $id: "PublicUser",
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    email: { type: "string", format: "email" },
    phone: { type: ["string", "null"] },
    avatarUrl: { type: ["string", "null"] },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const

export const configure = async (fastify: FastifyInstance) => {
  fastify.addSchema(errorSchema)
  fastify.addSchema(publicUserSchema)
  fastify.addSchema(clientSchema)
  fastify.addSchema(categorySchema)
  fastify.addSchema(budgetItemSchema)
  fastify.addSchema(budgetSummarySchema)
  fastify.addSchema(budgetDetailsSchema)

  await fastify.register(swagger as never, {
    openapi: {
      info: {
        title: "Fluxor API",
        description: "Backend inicial do app Fluxor com autenticação, clientes e upload de avatar.",
        version: "1.0.0",
      },
      tags: [
        { name: "Health", description: "Status da API" },
        { name: "Auth", description: "Autenticação e perfil do usuário" },
        { name: "Clients", description: "Cadastro e gestão de clientes" },
        { name: "Categories", description: "Categorias de orçamento e serviços" },
        { name: "Budgets", description: "Cadastro e gestão de orçamentos" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          ErrorResponse: errorSchema,
          PublicUser: publicUserSchema,
          Client: clientSchema,
          Category: categorySchema,
          BudgetItem: budgetItemSchema,
          BudgetSummary: budgetSummarySchema,
          BudgetDetails: budgetDetailsSchema,
        },
      },
    },
  })

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  })

  console.info("[SWAGGER] Ready")
}
