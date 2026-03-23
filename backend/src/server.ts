import "dotenv/config"
import { buildApp } from "./app.ts"
import { env } from "./infra/http/config/env.ts"

async function start() {
  try {
    const app = await buildApp()

    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    })

    console.log(`API rodando na porta ${env.PORT}`)
    if (env.LOCAL_NETWORK_IP) {
      console.log(`URL LAN: http://${env.LOCAL_NETWORK_IP}:${env.PORT}`)
      console.log(`Swagger LAN: http://${env.LOCAL_NETWORK_IP}:${env.PORT}/docs`)
    }
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

start()
