export const listClientsSchema = {
  tags: ["Clients"],
  summary: "Lista os clientes do usuário autenticado",
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      page: { type: "integer", minimum: 1 },
      perPage: { type: "integer", minimum: 1, maximum: 100 },
      sortBy: { type: "string", enum: ["createdAt", "updatedAt", "name", "company"] },
      sortDirection: { type: "string", enum: ["ASC", "asc", "DESC", "desc"] },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: { $ref: "Client#" },
        },
        totalRows: { type: "integer" },
        totalPages: { type: "integer" },
        page: { type: "integer" },
        perPage: { type: "integer" },
      },
    },
  },
} as const
