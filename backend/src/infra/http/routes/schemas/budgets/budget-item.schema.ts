export const budgetItemSchema = {
  $id: "BudgetItem",
  type: "object",
  properties: {
    id: { type: "string" },
    budgetId: { type: "string" },
    title: { type: "string" },
    description: { type: ["string", "null"] },
    unitPrice: { type: "number" },
    quantity: { type: "integer" },
    total: { type: "number" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const
