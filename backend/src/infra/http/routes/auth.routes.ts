import { FastifyInstance } from "fastify"
import { AuthenticateUserUseCase } from "../../../domain/user/use-cases/authenticate-user.ts"
import { GetUserProfileUseCase } from "../../../domain/user/use-cases/get-user-profile.ts"
import { LogoutSessionUseCase } from "../../../domain/user/use-cases/logout-session.ts"
import { RefreshSessionUseCase } from "../../../domain/user/use-cases/refresh-session.ts"
import { RegisterUserUseCase } from "../../../domain/user/use-cases/register-user.ts"
import { UploadUserAvatarUseCase } from "../../../domain/user/use-cases/upload-user-avatar.ts"
import { DrizzleUserSessionsRepository } from "../../database/drizzle/repositories/drizzle-user-sessions-repository.ts"
import { DrizzleUsersRepository } from "../../database/drizzle/repositories/drizzle-users-repository.ts"
import { LocalAvatarStorage } from "../../storage/local-avatar-storage.ts"
import { AuthenticateController } from "../controllers/user/authenticate.controller.ts"
import { GetProfileController } from "../controllers/user/get-profile.controller.ts"
import { LogoutSessionController } from "../controllers/user/logout-session.controller.ts"
import { RefreshSessionController } from "../controllers/user/refresh-session.controller.ts"
import { RegisterController } from "../controllers/user/register.controller.ts"
import { UploadUserAvatarController } from "../controllers/user/upload-user-avatar.controller.ts"
import { CheckAuthtenticationMiddleware } from "../middleware/check-authentication.ts"
import { JWTService } from "../../../shared/services/jwt.service.ts"
import { getProfileSchema } from "./schemas/authentication/get-profile.schema.ts"
import { loginSchema } from "./schemas/authentication/login.schema.ts"
import { logoutSchema } from "./schemas/authentication/logout.schema.ts"
import { refreshSchema } from "./schemas/authentication/refresh.schema.ts"
import { registerSchema } from "./schemas/authentication/register.schema.ts"
import { uploadUserAvatarSchema } from "./schemas/authentication/upload-user-avatar.schema.ts"

export const configure = (fastify: FastifyInstance) => {
  const usersRepository = new DrizzleUsersRepository()
  const userSessionsRepository = new DrizzleUserSessionsRepository()
  const jwtService = new JWTService()
  const avatarStorage = new LocalAvatarStorage()
  const checkAuthentication = new CheckAuthtenticationMiddleware()

  const registerController = new RegisterController(new RegisterUserUseCase(usersRepository, jwtService, userSessionsRepository))
  const authenticateController = new AuthenticateController(
    new AuthenticateUserUseCase(usersRepository, jwtService, userSessionsRepository),
  )
  const refreshSessionController = new RefreshSessionController(
    new RefreshSessionUseCase(usersRepository, userSessionsRepository, jwtService),
  )
  const logoutSessionController = new LogoutSessionController(
    new LogoutSessionUseCase(userSessionsRepository, jwtService),
  )
  const getProfileController = new GetProfileController(new GetUserProfileUseCase(usersRepository))
  const uploadUserAvatarController = new UploadUserAvatarController(
    new UploadUserAvatarUseCase(usersRepository, avatarStorage),
  )

  fastify.post("/auth/register", { schema: registerSchema }, registerController.execute)
  fastify.post("/auth/login", { schema: loginSchema }, authenticateController.execute)
  fastify.post("/auth/refresh", { schema: refreshSchema }, refreshSessionController.execute)
  fastify.post("/auth/logout", { schema: logoutSchema }, logoutSessionController.execute)
  fastify.get("/me", { preHandler: [checkAuthentication.execute], schema: getProfileSchema }, getProfileController.execute)
  fastify.patch(
    "/me/avatar",
    { preHandler: [checkAuthentication.execute], schema: uploadUserAvatarSchema },
    uploadUserAvatarController.execute,
  )
}
