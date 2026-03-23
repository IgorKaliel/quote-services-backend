export const updateClientSchema = {
  tags: ["Clients"],
  summary: "Atualiza um cliente",
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    required: ["clientId"],
    properties: {
      clientId: { type: "string" },
    },
  },
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", minLength: 2, maxLength: 120 },
      email: { type: "string", format: "email" },
      phone: { type: "string", minLength: 8, maxLength: 20 },
      company: { type: "string", maxLength: 120 },
      notes: { type: "string", maxLength: 500 },
    },
  },
  response: {
    200: { $ref: "Client#" },
    404: { $ref: "ErrorResponse#" },
  },
} as const
