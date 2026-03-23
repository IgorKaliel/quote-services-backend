export const createClientSchema = {
  tags: ["Clients"],
  summary: "Cadastra um novo cliente",
  security: [{ bearerAuth: [] }],
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
    201: { $ref: "Client#" },
  },
} as const
