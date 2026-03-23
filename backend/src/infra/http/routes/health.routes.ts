import { FastifyInstance } from "fastify"

export const configure = (fastify: FastifyInstance) => {
  fastify.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        summary: "Verifica se a API está online",
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string", example: "ok" },
              timestamp: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    async () => ({
      status: "ok",
      timestamp: new Date().toISOString(),
    }),
  )
}
