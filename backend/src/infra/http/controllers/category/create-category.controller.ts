import { FastifyReply, FastifyRequest } from "fastify"
import { CreateCategoryUseCase } from "../../../../domain/category/use-cases/create-category.ts"

export class CreateCategoryController {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.createCategoryUseCase.execute({
      userId: request.authUser!.id,
      ...(request.body as {
        name: string
        description?: string
        color?: string
      }),
    })

    return reply.status(201).send(result)
  }
}
