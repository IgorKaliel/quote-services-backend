import { afterEach, describe, expect, it } from "vitest"
import { createTestApp } from "../helpers/test-app.ts"

describe("auth routes", () => {
  let app: Awaited<ReturnType<typeof createTestApp>> | null = null

  afterEach(async () => {
    if (app) {
      await app.close()
      app = null
    }
  })

  it("registers and authenticates a user", async () => {
    app = await createTestApp()

    const registerResponse = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        name: "Usuário Teste",
        email: `auth-${Date.now()}@example.com`,
        password: "123456",
        phone: "11999999999",
      },
    })

    expect(registerResponse.statusCode).toBe(201)
    expect(registerResponse.json()).toHaveProperty("token")
    expect(registerResponse.json()).toHaveProperty("refreshToken")
    expect(registerResponse.json()).toHaveProperty("user.email")
  })

  it("refreshes a session and invalidates the previous refresh token", async () => {
    app = await createTestApp()

    const registerResponse = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        name: "Usuário Teste",
        email: `refresh-${Date.now()}@example.com`,
        password: "123456",
      },
    })

    expect(registerResponse.statusCode).toBe(201)

    const initialSession = registerResponse.json() as { refreshToken: string; token: string }

    const refreshResponse = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      payload: {
        refreshToken: initialSession.refreshToken,
      },
    })

    expect(refreshResponse.statusCode).toBe(200)
    expect(refreshResponse.json()).toHaveProperty("token")
    expect(refreshResponse.json()).toHaveProperty("refreshToken")
    expect(refreshResponse.json().refreshToken).not.toBe(initialSession.refreshToken)

    const staleRefreshResponse = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      payload: {
        refreshToken: initialSession.refreshToken,
      },
    })

    expect(staleRefreshResponse.statusCode).toBe(401)
  })

  it("logs out and revokes the current refresh token", async () => {
    app = await createTestApp()

    const registerResponse = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        name: "Usuário Logout",
        email: `logout-${Date.now()}@example.com`,
        password: "123456",
      },
    })

    const session = registerResponse.json() as { refreshToken: string }

    const logoutResponse = await app.inject({
      method: "POST",
      url: "/auth/logout",
      payload: {
        refreshToken: session.refreshToken,
      },
    })

    expect(logoutResponse.statusCode).toBe(204)

    const refreshAfterLogoutResponse = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      payload: {
        refreshToken: session.refreshToken,
      },
    })

    expect(refreshAfterLogoutResponse.statusCode).toBe(401)
  })
})
