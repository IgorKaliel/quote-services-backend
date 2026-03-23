import { createHash, randomBytes } from "node:crypto"
import jwt from "jsonwebtoken"
import type { SignOptions } from "jsonwebtoken"
import { JWTError, JWTErrorType } from "../errors/jwt.error.ts"

interface JWTPayload {
  id: string
  email: string
}

interface TokenPair {
  accessToken: string
  refreshToken: string
}

export class JWTService {
  private readonly accessTokenSecret: Buffer
  private readonly refreshTokenSecret: Buffer
  private readonly accessTokenExpiry: string
  private readonly refreshTokenExpiry: string

  constructor() {
    this.accessTokenSecret = decodeBase64Secret(process.env.JWT_SECRET, "default-secret")
    this.refreshTokenSecret = decodeBase64Secret(process.env.JWT_REFRESH_SECRET, "default-refresh-secret")
    this.accessTokenExpiry = process.env.JWT_EXPIRY || "15m"
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || "7d"
  }

  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry as SignOptions["expiresIn"],
    })
  }

  generateRefreshToken(): string {
    return randomBytes(64).toString("hex")
  }

  hashRefreshToken(refreshToken: string): string {
    return createHash("sha256").update(refreshToken).digest("hex")
  }

  generateTokenPair(payload: JWTPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(),
    }
  }

  verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.accessTokenSecret) as JWTPayload
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new JWTError("Token expirado.", JWTErrorType.TOKEN_EXPIRED)
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new JWTError("Token invalido.", JWTErrorType.TOKEN_INVALID)
      }

      throw new JWTError("Falha ao validar token.", JWTErrorType.TOKEN_MALFORMED)
    }
  }

  getRefreshTokenExpiryDate(): Date {
    const now = new Date()
    const expiryDays = parseInt(this.refreshTokenExpiry.replace("d", "")) || 7
    return new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000)
  }

  isRefreshTokenValid(expiresAt: Date): boolean {
    return new Date() < expiresAt
  }
}

const decodeBase64Secret = (secret: string | undefined, fallback: string) => {
  if (!secret) {
    return Buffer.from(fallback)
  }

  try {
    const decodedSecret = Buffer.from(secret, "base64")
    return decodedSecret.length > 0 ? decodedSecret : Buffer.from(secret)
  } catch {
    return Buffer.from(secret)
  }
}
