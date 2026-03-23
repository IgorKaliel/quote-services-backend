export const uploadUserAvatarSchema = {
  tags: ["Auth"],
  summary: "Faz upload da foto de perfil",
  security: [{ bearerAuth: [] }],
  consumes: ["multipart/form-data"],
  body: {
    type: "object",
    required: ["avatar"],
    properties: {
      avatar: {
        type: "string",
        format: "binary",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        avatarUrl: { type: "string" },
      },
    },
    400: { $ref: "ErrorResponse#" },
    401: { $ref: "ErrorResponse#" },
    404: { $ref: "ErrorResponse#" },
  },
} as const
