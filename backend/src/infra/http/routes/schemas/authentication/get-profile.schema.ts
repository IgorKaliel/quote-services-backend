export const getProfileSchema = {
  tags: ["Auth"],
  summary: "Retorna o usuário autenticado",
  security: [{ bearerAuth: [] }],
  response: {
    200: { $ref: "PublicUser#" },
    401: { $ref: "ErrorResponse#" },
    404: { $ref: "ErrorResponse#" },
  },
} as const
