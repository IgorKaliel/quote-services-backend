import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex")
  const hashedPassword = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hashedPassword}`
}

export const verifyPassword = (password: string, storedHash: string) => {
  const [salt, originalHash] = storedHash.split(":")

  if (!salt || !originalHash) {
    return false
  }

  const currentHash = scryptSync(password, salt, 64)
  const originalBuffer = Buffer.from(originalHash, "hex")

  return originalBuffer.length === currentHash.length && timingSafeEqual(originalBuffer, currentHash)
}
