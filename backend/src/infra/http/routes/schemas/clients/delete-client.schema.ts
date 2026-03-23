export const deleteClientSchema = {
  tags: ["Clients"],
  summary: "Remove um cliente",
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    required: ["clientId"],
    properties: {
      clientId: { type: "string" },
    },
  },
  response: {
    204: {
      type: "null",
    },
    404: { $ref: "ErrorResponse#" },
  },
} as const
