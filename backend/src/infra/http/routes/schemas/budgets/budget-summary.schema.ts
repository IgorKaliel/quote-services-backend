export const budgetSummarySchema = {
  $id: "BudgetSummary",
  type: "object",
  properties: {
    id: { type: "string" },
    clientId: { type: "string" },
    clientName: { type: "string" },
    categoryId: { type: ["string", "null"] },
    categoryName: { type: ["string", "null"] },
    title: { type: "string" },
    status: { type: "string", enum: ["draft", "sent", "approved", "rejected"] },
    itemCount: { type: "integer" },
    subtotal: { type: "number" },
    total: { type: "number" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const
