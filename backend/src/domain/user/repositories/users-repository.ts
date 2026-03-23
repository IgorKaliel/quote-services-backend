import { User } from "../entities/user.ts"

export interface CreateUserInput {
  id: string
  name: string
  email: string
  phone: string | null
  passwordHash: string
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdateUserAvatarInput {
  userId: string
  avatarUrl: string
  updatedAt: string
}

export interface UsersRepository {
  create(data: CreateUserInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  updateAvatar(data: UpdateUserAvatarInput): Promise<void>
}
