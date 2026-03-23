import { FastifyRequest } from "fastify"
import { UnauthenticatedError } from "../../../shared/errors/unauthenticated.error.ts"
import { JWTService } from "../../../shared/services/jwt.service.ts"

export class CheckAuthtenticationMiddleware {
  private jwtService: JWTService

  constructor() {
    this.jwtService = new JWTService()
  }

  execute = async (request: FastifyRequest) => {
    const authorizationHeader = request.headers.authorization

    if (!authorizationHeader) {
      throw new UnauthenticatedError("Token de autorização não fornecido.")
    }

    const [scheme, token] = authorizationHeader.split(" ")

    if (scheme !== "Bearer" || !token) {
      throw new UnauthenticatedError("Use o formato Bearer <token>.")
    }

    const payload = this.jwtService.verifyAccessToken(token)

    request.authUser = {
      id: payload.id,
      email: payload.email,
    }
  }
}
