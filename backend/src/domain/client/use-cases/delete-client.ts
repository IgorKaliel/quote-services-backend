import { AppError } from "../../../shared/errors/app.error.ts"
import { ClientsRepository } from "../repositories/clients-repository.ts"

export class DeleteClientUseCase {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async execute(clientId: string, userId: string): Promise<void> {
    const existingClient = await this.clientsRepository.findByIdAndUserId(clientId, userId)

    if (!existingClient) {
      throw new AppError("Cliente não encontrado.", 404, undefined, "CLIENT_NOT_FOUND")
    }

    await this.clientsRepository.delete(clientId, userId)
  }
}
