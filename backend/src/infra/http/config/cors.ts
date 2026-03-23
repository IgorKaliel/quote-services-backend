import { FastifyInstance } from "fastify"
import fastiCors from "@fastify/cors"
import fastifyCookie from "@fastify/cookie"
import { env } from "./env.ts"

const allowedDevelopmentHosts = new Set([
  "localhost",
  "127.0.0.1",
  env.LOCAL_NETWORK_IP,
].filter(Boolean))

const isDevelopmentOriginAllowed = (origin: string) => {
  try {
    const { hostname } = new URL(origin)
    return allowedDevelopmentHosts.has(hostname)
  } catch {
    return false
  }
}

export const register = async (fastify: FastifyInstance) => {
  await fastify.register(fastiCors, {
    credentials: true,
    origin(origin, callback) {
      // React Native/Expo requests often arrive without an Origin header.
      if (!origin) {
        callback(null, true)
        return
      }

      const isDevelopment = process.env.NODE_ENV === "development"

      if (isDevelopment && isDevelopmentOriginAllowed(origin)) {
        callback(null, true)
        return
      }

      if (env.FRONTEND_URL && origin === env.FRONTEND_URL) {
        callback(null, true)
        return
      }

      callback(new Error(`Origin ${origin} nao permitida pelo CORS.`), false)
    },
  })
  await fastify.register(fastifyCookie)
}
