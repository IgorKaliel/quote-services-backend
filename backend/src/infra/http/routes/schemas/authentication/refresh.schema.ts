export const refreshSchema = {
  tags: ["Auth"],
  summary: "Renova a sessao do usuario",
  body: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string", minLength: 20 },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        token: { type: "string" },
        refreshToken: { type: "string" },
        user: { $ref: "PublicUser#" },
      },
    },
    401: { $ref: "ErrorResponse#" },
  },
} as const
