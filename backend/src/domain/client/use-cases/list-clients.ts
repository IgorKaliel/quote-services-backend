import { Paginated } from "../../../interfaces/paginated.ts"
import { OrderDirection } from "../../../interfaces/order-direction.ts"
import { Client } from "../entities/client.ts"
import { ClientsRepository } from "../repositories/clients-repository.ts"

interface ListClientsRequest {
  userId: string
  page?: number
  perPage?: number
  sortBy?: "createdAt" | "updatedAt" | "name" | "company"
  sortDirection?: OrderDirection
}

export class ListClientsUseCase {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async execute(data: ListClientsRequest): Promise<Paginated<Client>> {
    return this.clientsRepository.findManyByUserId({
      userId: data.userId,
      page: Math.max(data.page ?? 1, 1),
      perPage: Math.min(Math.max(data.perPage ?? 10, 1), 100),
      sortBy: data.sortBy ?? "createdAt",
      sortDirection: data.sortDirection ?? "desc",
    })
  }
}
