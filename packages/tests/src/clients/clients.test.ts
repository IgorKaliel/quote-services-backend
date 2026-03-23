import { afterEach, describe, expect, it } from "vitest"
import { registerAndAuthenticate } from "../helpers/auth.ts"
import { createTestApp } from "../helpers/test-app.ts"

describe("clients routes", () => {
  let app: Awaited<ReturnType<typeof createTestApp>> | null = null

  afterEach(async () => {
    if (app) {
      await app.close()
      app = null
    }
  })

  it("creates and lists clients", async () => {
    app = await createTestApp()
    const { token } = await registerAndAuthenticate(app)

    for (const payload of [
      {
        name: "Cliente Teste",
        email: "cliente@example.com",
        company: "Fluxor",
      },
      {
        name: "Alpha Cliente",
        email: "alpha@example.com",
        company: "Alpha",
      },
    ]) {
      const createResponse = await app.inject({
        method: "POST",
        url: "/clients",
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload,
      })

      expect(createResponse.statusCode).toBe(201)
    }

    const listResponse = await app.inject({
      method: "GET",
      url: "/clients?page=1&perPage=1&sortBy=name&sortDirection=asc",
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(listResponse.statusCode).toBe(200)
    expect(listResponse.json()).toHaveProperty("data")
    expect(listResponse.json().data).toHaveLength(1)
    expect(listResponse.json().page).toBe(1)
    expect(listResponse.json().perPage).toBe(1)
    expect(listResponse.json().totalRows).toBe(2)
    expect(listResponse.json().totalPages).toBe(2)
    expect(listResponse.json().data[0].name).toBe("Alpha Cliente")
  })
})
