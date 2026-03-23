export const createCategorySchema = {
  tags: ["Categories"],
  summary: "Cria uma categoria",
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", minLength: 2, maxLength: 120 },
      description: { type: "string", maxLength: 500 },
      color: { type: "string", maxLength: 20 },
    },
  },
  response: {
    201: { $ref: "Category#" },
  },
} as const
