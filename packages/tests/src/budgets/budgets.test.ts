import { afterEach, describe, expect, it } from "vitest"
import { registerAndAuthenticate } from "../helpers/auth.ts"
import { createTestApp } from "../helpers/test-app.ts"

describe("budgets routes", () => {
  let app: Awaited<ReturnType<typeof createTestApp>> | null = null

  afterEach(async () => {
    if (app) {
      await app.close()
      app = null
    }
  })

  it("creates and lists budgets", async () => {
    app = await createTestApp()
    const { token } = await registerAndAuthenticate(app)

    const clientResponse = await app.inject({
      method: "POST",
      url: "/clients",
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        name: "Cliente do Orçamento",
      },
    })

    const client = clientResponse.json() as { id: string }

    for (const payload of [
      {
        clientId: client.id,
        title: "Orçamento inicial",
        items: [
          {
            title: "Design de interfaces",
            unitPrice: 3847.5,
            quantity: 1,
          },
        ],
      },
      {
        clientId: client.id,
        title: "Acompanhamento mensal",
        items: [
          {
            title: "Gestão recorrente",
            unitPrice: 1200,
            quantity: 1,
          },
        ],
      },
    ]) {
      const createBudgetResponse = await app.inject({
        method: "POST",
        url: "/budgets",
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload,
      })

      expect(createBudgetResponse.statusCode).toBe(201)
    }

    const listResponse = await app.inject({
      method: "GET",
      url: "/budgets?page=1&perPage=1&sortBy=title&sortDirection=desc",
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
    expect(listResponse.json().data[0].title).toBe("Orçamento inicial")
  })
})
