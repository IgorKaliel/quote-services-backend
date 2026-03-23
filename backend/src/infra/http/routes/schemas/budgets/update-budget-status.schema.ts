export const updateBudgetStatusSchema = {
  tags: ["Budgets"],
  summary: "Atualiza o status de um orçamento",
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    required: ["budgetId"],
    properties: {
      budgetId: { type: "string" },
    },
  },
  body: {
    type: "object",
    required: ["status"],
    properties: {
      status: { type: "string", enum: ["draft", "sent", "approved", "rejected"] },
    },
  },
  response: {
    200: { $ref: "BudgetDetails#" },
    404: { $ref: "ErrorResponse#" },
  },
} as const
