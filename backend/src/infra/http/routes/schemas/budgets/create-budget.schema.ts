export const createBudgetSchema = {
  tags: ["Budgets"],
  summary: "Cria um novo orçamento",
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["clientId", "title", "items"],
    properties: {
      clientId: { type: "string" },
      categoryId: { type: ["string", "null"] },
      title: { type: "string", minLength: 2, maxLength: 150 },
      description: { type: "string", maxLength: 1000 },
      status: { type: "string", enum: ["draft", "sent", "approved", "rejected"] },
      discountType: { type: ["string", "null"], enum: ["percentage", "fixed", null] },
      discountValue: { type: "number", minimum: 0 },
      items: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["title", "unitPrice", "quantity"],
          properties: {
            title: { type: "string", minLength: 2, maxLength: 150 },
            description: { type: "string", maxLength: 500 },
            unitPrice: { type: "number", minimum: 0 },
            quantity: { type: "integer", minimum: 1 },
          },
        },
      },
    },
  },
  response: {
    201: { $ref: "BudgetDetails#" },
    404: { $ref: "ErrorResponse#" },
  },
} as const
