export const getBudgetSchema = {
  tags: ["Budgets"],
  summary: "Busca um orçamento por ID",
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    required: ["budgetId"],
    properties: {
      budgetId: { type: "string" },
    },
  },
  response: {
    200: { $ref: "BudgetDetails#" },
    404: { $ref: "ErrorResponse#" },
  },
} as const
