export const loginSchema = {
  tags: ["Auth"],
  summary: "Autentica o usuário",
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6, maxLength: 100 },
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
