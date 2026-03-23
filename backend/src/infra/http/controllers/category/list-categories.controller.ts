import { FastifyReply, FastifyRequest } from "fastify"
import { ListCategoriesUseCase } from "../../../../domain/category/use-cases/list-categories.ts"

export class ListCategoriesController {
  constructor(private readonly listCategoriesUseCase: ListCategoriesUseCase) {}

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send(await this.listCategoriesUseCase.execute(request.authUser!.id))
  }
}
