export const registerSchema = {
  tags: ["Auth"],
  summary: "Cria uma nova conta",
  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string", minLength: 2, maxLength: 120 },
      email: { type: "string", format: "email" },
      phone: { type: "string", minLength: 8, maxLength: 20 },
      password: { type: "string", minLength: 6, maxLength: 100 },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        token: { type: "string" },
        refreshToken: { type: "string" },
        user: { $ref: "PublicUser#" },
      },
    },
    409: { $ref: "ErrorResponse#" },
  },
} as const
