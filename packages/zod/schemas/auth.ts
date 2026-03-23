import { z } from "zod"

export const registerUserSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres.").max(120, "Nome deve ter no maximo 120 caracteres."),
  email: z.email("E-mail invalido.").trim(),
  phone: z.string().trim().min(8, "Telefone deve ter pelo menos 8 caracteres.").max(20, "Telefone deve ter no maximo 20 caracteres.").optional(),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres.").max(100, "Senha deve ter no maximo 100 caracteres."),
})

export const authenticateUserSchema = z.object({
  email: z.email("E-mail invalido.").trim(),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres.").max(100, "Senha deve ter no maximo 100 caracteres."),
})

export const refreshSessionSchema = z.object({
  refreshToken: z.string().trim().min(20, "Refresh token invalido."),
})

export const logoutSessionSchema = z.object({
  refreshToken: z.string().trim().min(20, "Refresh token invalido."),
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>
export type AuthenticateUserInput = z.infer<typeof authenticateUserSchema>
export type RefreshSessionInput = z.infer<typeof refreshSessionSchema>
export type LogoutSessionInput = z.infer<typeof logoutSessionSchema>
