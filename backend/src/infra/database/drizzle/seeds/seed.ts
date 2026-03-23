import { CreateBudgetUseCase } from "../../../../domain/budget/use-cases/create-budget.ts"
import { BudgetStatus } from "../../../../domain/budget/entities/budget.ts"
import { CreateCategoryUseCase } from "../../../../domain/category/use-cases/create-category.ts"
import { CreateClientUseCase } from "../../../../domain/client/use-cases/create-client.ts"
import { RegisterUserUseCase } from "../../../../domain/user/use-cases/register-user.ts"
import { JWTService } from "../../../../shared/services/jwt.service.ts"
import {
  budgetItemsTable,
  budgetsTable,
  categoriesTable,
  clientsTable,
  userSessionsTable,
  usersTable,
} from "../../../../../../packages/drizzle/dist/index.js"
import { closeDatabase, getDb } from "../client.ts"
import { DrizzleBudgetsRepository } from "../repositories/drizzle-budgets-repository.ts"
import { DrizzleCategoriesRepository } from "../repositories/drizzle-categories-repository.ts"
import { DrizzleClientsRepository } from "../repositories/drizzle-clients-repository.ts"
import { DrizzleUserSessionsRepository } from "../repositories/drizzle-user-sessions-repository.ts"
import { DrizzleUsersRepository } from "../repositories/drizzle-users-repository.ts"

const categoriesSeed = [
  { name: "Aplicativos", color: "#2563EB", description: "Projetos de apps e plataformas digitais." },
  { name: "Marketing", color: "#EA580C", description: "Campanhas, anuncios e estrategia digital." },
  { name: "Conteudo", color: "#16A34A", description: "Producao editorial, roteiros e copy." },
  { name: "Design", color: "#DB2777", description: "Identidade visual, UI e pecas criativas." },
  { name: "Consultoria", color: "#7C3AED", description: "Analise, planejamento e acompanhamento." },
] as const

const clientCompanies = [
  "Atlas Digital",
  "Nexa Studio",
  "Pulse Media",
  "Prime Solar",
  "Vertex Engenharia",
  "Lumen Saude",
  "Orbit Educacao",
  "Cubo Varejo",
  "Aurora Eventos",
  "Base Logistica",
] as const

const budgetTemplates = [
  {
    title: "Website institucional com area administrativa",
    description: "Projeto completo com layout responsivo, painel de gestao e publicacao.",
    items: [
      { title: "Discovery e arquitetura", description: "Mapeamento de requisitos e fluxos", unitPrice: 1800, quantity: 1 },
      { title: "UI e desenvolvimento front-end", description: "Implementacao das telas principais", unitPrice: 4200, quantity: 1 },
      { title: "Back-end e integracoes", description: "API, autenticacao e regras de negocio", unitPrice: 5100, quantity: 1 },
    ],
  },
  {
    title: "Landing page para campanha de captacao",
    description: "Pagina de alta conversao com formulario, analytics e automacoes.",
    items: [
      { title: "Copywriting", unitPrice: 950, quantity: 1 },
      { title: "Design da landing page", unitPrice: 1650, quantity: 1 },
      { title: "Implementacao e integrações", unitPrice: 2100, quantity: 1 },
    ],
  },
  {
    title: "Plano mensal de marketing digital",
    description: "Gestao de campanhas, calendario de conteudo e acompanhamento de metricas.",
    items: [
      { title: "Planejamento estrategico", unitPrice: 2200, quantity: 1 },
      { title: "Gestao de trafego", unitPrice: 2600, quantity: 1 },
      { title: "Relatorio de performance", unitPrice: 900, quantity: 1 },
    ],
  },
  {
    title: "Pacote de identidade visual",
    description: "Criacao de marca, manual basico e desdobramentos para redes sociais.",
    items: [
      { title: "Moodboard e direcao visual", unitPrice: 1200, quantity: 1 },
      { title: "Logo e variacoes", unitPrice: 2800, quantity: 1 },
      { title: "Kit de social media", unitPrice: 1600, quantity: 1 },
    ],
  },
  {
    title: "Consultoria de SEO e performance",
    description: "Auditoria tecnica, melhorias on-page e plano de crescimento organico.",
    items: [
      { title: "Auditoria SEO", unitPrice: 1700, quantity: 1 },
      { title: "Otimizacao on-page", unitPrice: 2300, quantity: 1 },
      { title: "Plano de conteudo", unitPrice: 1400, quantity: 1 },
    ],
  },
  {
    title: "Producao de conteudo recorrente",
    description: "Entrega mensal de artigos, copies e materiais para inbound marketing.",
    items: [
      { title: "Artigos para blog", unitPrice: 450, quantity: 6 },
      { title: "Copies para email", unitPrice: 180, quantity: 8 },
      { title: "Calendario editorial", unitPrice: 700, quantity: 1 },
    ],
  },
] as const

const budgetStatuses: BudgetStatus[] = ["approved", "draft", "sent", "rejected"]
const password = "12345678"

const formatPhone = (userIndex: number, itemIndex: number) => {
  const suffix = String(userIndex * 100 + itemIndex).padStart(4, "0")
  return `1199${suffix}${suffix}`
}

const seed = async () => {
  const db = getDb()
  await db.delete(budgetItemsTable)
  await db.delete(budgetsTable)
  await db.delete(categoriesTable)
  await db.delete(clientsTable)
  await db.delete(userSessionsTable)
  await db.delete(usersTable)

  const usersRepository = new DrizzleUsersRepository()
  const userSessionsRepository = new DrizzleUserSessionsRepository()
  const clientsRepository = new DrizzleClientsRepository()
  const categoriesRepository = new DrizzleCategoriesRepository()
  const budgetsRepository = new DrizzleBudgetsRepository()
  const jwtService = new JWTService()

  const registerUser = new RegisterUserUseCase(usersRepository, jwtService, userSessionsRepository)
  const createClient = new CreateClientUseCase(clientsRepository)
  const createCategory = new CreateCategoryUseCase(categoriesRepository)
  const createBudget = new CreateBudgetUseCase(budgetsRepository, clientsRepository, categoriesRepository)

  const registeredUsers = []
  let totalClients = 0
  let totalCategories = 0
  let totalBudgets = 0

  for (let userIndex = 1; userIndex <= 10; userIndex++) {
    const registeredUser = await registerUser.execute({
      name: `Usuario Seed ${userIndex}`,
      email: `usuario${userIndex}@fluxor.app`,
      phone: formatPhone(userIndex, 0),
      password,
    })

    const userId = registeredUser.user.id
    registeredUsers.push(registeredUser.user.email)

    const clients = await Promise.all(
      clientCompanies.map((company, clientIndex) =>
        createClient.execute({
          userId,
          name: `Contato ${userIndex}-${clientIndex + 1}`,
          email: `cliente${userIndex}_${clientIndex + 1}@fluxor.app`,
          phone: formatPhone(userIndex, clientIndex + 1),
          company: `${company} ${userIndex}`,
          notes: clientIndex % 2 === 0 ? "Cliente com historico ativo de propostas." : undefined,
        }),
      ),
    )

    const categories = await Promise.all(
      categoriesSeed.map((category) =>
        createCategory.execute({
          userId,
          name: category.name,
          color: category.color,
          description: category.description,
        }),
      ),
    )

    totalClients += clients.length
    totalCategories += categories.length

    for (let budgetIndex = 0; budgetIndex < 12; budgetIndex++) {
      const template = budgetTemplates[budgetIndex % budgetTemplates.length]
      const status = budgetStatuses[budgetIndex % budgetStatuses.length]
      const client = clients[budgetIndex % clients.length]
      const category = categories[budgetIndex % categories.length]
      const discountType = budgetIndex % 3 === 0 ? "fixed" : budgetIndex % 4 === 0 ? "percentage" : null
      const discountValue = discountType === "fixed" ? 150 + budgetIndex * 25 : discountType === "percentage" ? 5 + (budgetIndex % 3) * 5 : 0

      await createBudget.execute({
        userId,
        clientId: client.id,
        categoryId: category.id,
        title: `${template.title} ${userIndex}-${budgetIndex + 1}`,
        description: template.description,
        status,
        discountType,
        discountValue,
        items: template.items.map((item, itemIndex) => ({
          ...item,
          unitPrice: Number((item.unitPrice + userIndex * 35 + budgetIndex * 20 + itemIndex * 15).toFixed(2)),
        })),
      })

      totalBudgets += 1
    }
  }

  console.log("Seed concluido com sucesso.")
  console.log("Usuarios:", registeredUsers.length)
  console.log("Senha padrao:", password)
  console.log("Primeiro usuario:", registeredUsers[0])
  console.log("Clientes:", totalClients)
  console.log("Categorias:", totalCategories)
  console.log("Orcamentos:", totalBudgets)
}

seed()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await closeDatabase()
  })
