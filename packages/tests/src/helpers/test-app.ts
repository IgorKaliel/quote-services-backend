import { buildApp } from "../../../../backend/src/app.ts"

export const createTestApp = async () => {
  const app = await buildApp()
  await app.ready()
  return app
}
