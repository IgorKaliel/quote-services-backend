export const getClientSchema = {
  tags: ["Clients"],
  summary: "Busca um cliente por ID",
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    required: ["clientId"],
    properties: {
      clientId: { type: "string" },
    },
  },
  response: {
    200: { $ref: "Client#" },
    404: { $ref: "ErrorResponse#" },
  },
} as const
