import path from "node:path"
import dotenv from "dotenv"
import { z } from "zod"

const nodeEnv = process.env.NODE_ENV ?? "development"

const loadEnvFile = (fileName: string, override = false) => {
  const candidatePaths = [
    path.resolve(process.cwd(), fileName),
    path.resolve(process.cwd(), "..", fileName),
    path.resolve(process.cwd(), "..", "..", fileName),
  ]

  for (const candidatePath of candidatePaths) {
    dotenv.config({ path: candidatePath, override })
  }
}

loadEnvFile(".env")
loadEnvFile(`.env.${nodeEnv}`, true)

const envSchema = z.object({
  PORT: z.coerce.number().default(4001),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string().default("fluxor-refresh-secret"),
  JWT_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),
  LOCAL_NETWORK_IP: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
})

export const env = envSchema.parse(process.env)
