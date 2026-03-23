export const getPublicBudgetSchema = {
  tags: ["Budgets"],
  summary: "Busca um orçamento público por token",
  params: {
    type: "object",
    required: ["publicToken"],
    properties: {
      publicToken: { type: "string" },
    },
  },
  response: {
    200: { $ref: "BudgetDetails#" },
    404: { $ref: "ErrorResponse#" },
  },
} as const
