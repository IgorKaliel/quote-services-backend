import { FastifyInstance } from "fastify"
import { CreateClientUseCase } from "../../../domain/client/use-cases/create-client.ts"
import { DeleteClientUseCase } from "../../../domain/client/use-cases/delete-client.ts"
import { GetClientUseCase } from "../../../domain/client/use-cases/get-client.ts"
import { ListClientsUseCase } from "../../../domain/client/use-cases/list-clients.ts"
import { UpdateClientUseCase } from "../../../domain/client/use-cases/update-client.ts"
import { DrizzleClientsRepository } from "../../database/drizzle/repositories/drizzle-clients-repository.ts"
import { CreateClientController } from "../controllers/client/create-client.controller.ts"
import { DeleteClientController } from "../controllers/client/delete-client.controller.ts"
import { GetClientController } from "../controllers/client/get-client.controller.ts"
import { ListClientsController } from "../controllers/client/list-clients.controller.ts"
import { UpdateClientController } from "../controllers/client/update-client.controller.ts"
import { CheckAuthtenticationMiddleware } from "../middleware/check-authentication.ts"
import { createClientSchema } from "./schemas/clients/create-client.schema.ts"
import { deleteClientSchema } from "./schemas/clients/delete-client.schema.ts"
import { getClientSchema } from "./schemas/clients/get-client.schema.ts"
import { listClientsSchema } from "./schemas/clients/list-clients.schema.ts"
import { updateClientSchema } from "./schemas/clients/update-client.schema.ts"

export const configure = (fastify: FastifyInstance) => {
  const clientsRepository = new DrizzleClientsRepository()
  const checkAuthentication = new CheckAuthtenticationMiddleware()

  const createClientController = new CreateClientController(new CreateClientUseCase(clientsRepository))
  const listClientsController = new ListClientsController(new ListClientsUseCase(clientsRepository))
  const getClientController = new GetClientController(new GetClientUseCase(clientsRepository))
  const updateClientController = new UpdateClientController(new UpdateClientUseCase(clientsRepository))
  const deleteClientController = new DeleteClientController(new DeleteClientUseCase(clientsRepository))

  fastify.get("/clients", { preHandler: [checkAuthentication.execute], schema: listClientsSchema }, listClientsController.execute)
  fastify.post(
    "/clients",
    { preHandler: [checkAuthentication.execute], schema: createClientSchema },
    createClientController.execute,
  )
  fastify.get(
    "/clients/:clientId",
    { preHandler: [checkAuthentication.execute], schema: getClientSchema },
    getClientController.execute,
  )
  fastify.put(
    "/clients/:clientId",
    { preHandler: [checkAuthentication.execute], schema: updateClientSchema },
    updateClientController.execute,
  )
  fastify.delete(
    "/clients/:clientId",
    { preHandler: [checkAuthentication.execute], schema: deleteClientSchema },
    deleteClientController.execute,
  )
}
