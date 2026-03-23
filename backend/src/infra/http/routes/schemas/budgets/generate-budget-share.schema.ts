export const generateBudgetShareSchema = {
  tags: ["Budgets"],
  summary: "Gera um token público para compartilhar orçamento",
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
