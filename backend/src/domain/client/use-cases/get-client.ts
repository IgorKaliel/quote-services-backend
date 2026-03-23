import { AppError } from "../../../shared/errors/app.error.ts"
import { Client } from "../entities/client.ts"
import { ClientsRepository } from "../repositories/clients-repository.ts"

export class GetClientUseCase {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async execute(clientId: string, userId: string): Promise<Client> {
    const client = await this.clientsRepository.findByIdAndUserId(clientId, userId)

    if (!client) {
      throw new AppError("Cliente não encontrado.", 404, undefined, "CLIENT_NOT_FOUND")
    }

    return client
  }
}
