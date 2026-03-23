import { AppError } from "../../../shared/errors/app.error.ts"
import { Client } from "../entities/client.ts"
import { ClientsRepository } from "../repositories/clients-repository.ts"

interface UpdateClientRequest {
  clientId: string
  userId: string
  name: string
  email?: string
  phone?: string
  company?: string
  notes?: string
}

export class UpdateClientUseCase {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async execute(data: UpdateClientRequest): Promise<Client> {
    const existingClient = await this.clientsRepository.findByIdAndUserId(data.clientId, data.userId)

    if (!existingClient) {
      throw new AppError("Cliente não encontrado.", 404, undefined, "CLIENT_NOT_FOUND")
    }

    return (await this.clientsRepository.update({
      clientId: data.clientId,
      userId: data.userId,
      name: data.name.trim(),
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      company: data.company?.trim() || null,
      notes: data.notes?.trim() || null,
      updatedAt: new Date().toISOString(),
    }))!
  }
}
