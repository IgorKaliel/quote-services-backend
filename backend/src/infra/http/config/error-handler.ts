import { FastifyError, FastifyInstance } from "fastify"
import { ZodError } from "../../../../../packages/zod/dist/index.js"
import { AppError } from "../../../shared/errors/app.error.ts"

export const configure = (fastify: FastifyInstance) => {
  fastify.setErrorHandler((error: FastifyError, request, reply) => {
    if ((error instanceof AppError && error.getShouldPrintInConsole()) || !(error instanceof AppError)) {
      console.error("", error)
    }

    if (error.validation) {
      const messages = error.validation.map((e) => e.message)

      return reply.status(422).send({
        code: "VALIDATION_ERROR",
        message: "Validation error",
        errors: messages,
      })
    }

    if (error instanceof ZodError) {
      return reply.status(422).send({
        code: "VALIDATION_ERROR",
        message: "Validation error",
        errors: error.issues.map((issue) => issue.message),
      })
    }

    if (error instanceof AppError) {
      return reply.status(error.getStatusCode()).send({
        code: error.getCode(),
        message: error.message,
      })
    }

    if (error.statusCode === 429) {
      return reply.status(429).send({
        code: "RATE_LIMIT_ERROR",
        message: error.message,
      })
    }

    return reply.status(500).send({
      code: "INTERNAL_SERVER_ERROR",
      message: "Server error.",
    })
  })
}
