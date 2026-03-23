import { randomUUID } from "node:crypto"
import { Client } from "../entities/client.ts"
import { ClientsRepository } from "../repositories/clients-repository.ts"

interface CreateClientRequest {
  userId: string
  name: string
  email?: string
  phone?: string
  company?: string
  notes?: string
}

export class CreateClientUseCase {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async execute(data: CreateClientRequest): Promise<Client> {
    const now = new Date().toISOString()

    return this.clientsRepository.create({
      id: randomUUID(),
      userId: data.userId,
      name: data.name.trim(),
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      company: data.company?.trim() || null,
      notes: data.notes?.trim() || null,
      createdAt: now,
      updatedAt: now,
    })
  }
}
