import { Paginated } from "../../../interfaces/paginated.ts"
import { OrderDirection } from "../../../interfaces/order-direction.ts"
import { Client } from "../entities/client.ts"

export interface CreateClientInput {
  id: string
  userId: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdateClientInput {
  clientId: string
  userId: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  notes: string | null
  updatedAt: string
}

export interface ListClientsFilters {
  userId: string
  page: number
  perPage: number
  sortBy: "createdAt" | "updatedAt" | "name" | "company"
  sortDirection: OrderDirection
}

export interface ClientsRepository {
  create(data: CreateClientInput): Promise<Client>
  findManyByUserId(filters: ListClientsFilters): Promise<Paginated<Client>>
  findByIdAndUserId(clientId: string, userId: string): Promise<Client | null>
  update(data: UpdateClientInput): Promise<Client | null>
  delete(clientId: string, userId: string): Promise<void>
}
