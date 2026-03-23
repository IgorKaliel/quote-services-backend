import fastify from "fastify"
import fastifyMultipart from "@fastify/multipart"
import fastifyStatic from "@fastify/static"
import * as Cors from "./infra/http/config/cors.ts"
import * as ErrorHandler from "./infra/http/config/error-handler.ts"
import * as Swagger from "./infra/http/config/swagger.ts"
import * as Routes from "./infra/http/routes/index.ts"
import { closeDatabase } from "./infra/database/drizzle/client.ts"
import { ensureStorageStructure, storageRootPath } from "./infra/storage/local-avatar-storage.ts"

export const buildApp = async () => {
  ensureStorageStructure()

  const app = fastify({
    logger: false,
  })

  ErrorHandler.configure(app)
  await Swagger.configure(app)
  await Cors.register(app)

  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  })

  await app.register(fastifyStatic, {
    root: storageRootPath,
    prefix: "/storage/",
  })

  app.addHook("onClose", async () => {
    await closeDatabase()
  })

  await Routes.register(app)

  return app
}
