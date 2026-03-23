export const logoutSchema = {
  tags: ["Auth"],
  summary: "Invalida a sessao atual",
  body: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string", minLength: 20 },
    },
  },
  response: {
    204: { type: "null" },
    401: { $ref: "ErrorResponse#" },
  },
} as const
