import { FastifyInstance } from "fastify"

export const registerAndAuthenticate = async (app: FastifyInstance) => {
  const email = `user-${Date.now()}@example.com`
  const registerResponse = await app.inject({
    method: "POST",
    url: "/auth/register",
    payload: {
      name: "Usuário Teste",
      email,
      password: "123456",
      phone: "11999999999",
    },
  })

  const body = registerResponse.json()

  return {
    email,
    token: body.token as string,
    refreshToken: body.refreshToken as string,
    user: body.user as { id: string; email: string },
  }
}
