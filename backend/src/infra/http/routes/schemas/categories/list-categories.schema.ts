export const listCategoriesSchema = {
  tags: ["Categories"],
  summary: "Lista categorias",
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      type: "array",
      items: { $ref: "Category#" },
    },
  },
} as const
