export const listBudgetsSchema = {
  tags: ["Budgets"],
  summary: "Lista os orçamentos do usuário",
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      page: { type: "integer", minimum: 1 },
      perPage: { type: "integer", minimum: 1, maximum: 100 },
      search: { type: "string" },
      status: { type: "string", enum: ["draft", "sent", "approved", "rejected"] },
      sortBy: { type: "string", enum: ["createdAt", "updatedAt", "total", "title"] },
      sortDirection: { type: "string", enum: ["ASC", "asc", "DESC", "desc"] },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: { $ref: "BudgetSummary#" },
        },
        totalRows: { type: "integer" },
        totalPages: { type: "integer" },
        page: { type: "integer" },
        perPage: { type: "integer" },
      },
    },
  },
} as const
