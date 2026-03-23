import { and, eq } from "../../../../../../packages/drizzle/node_modules/drizzle-orm/index.js"
import { usersTable } from "../../../../../../packages/drizzle/dist/index.js"
import { User } from "../../../../domain/user/entities/user.ts"
import {
  CreateUserInput,
  UpdateUserAvatarInput,
  UsersRepository,
} from "../../../../domain/user/repositories/users-repository.ts"
import { getDb } from "../client.ts"

const mapUser = (row: typeof usersTable.$inferSelect): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  passwordHash: row.passwordHash,
  avatarUrl: row.avatarUrl,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
})

export class DrizzleUsersRepository implements UsersRepository {
  async create(data: CreateUserInput): Promise<User> {
    const db = getDb()
    await db.insert(usersTable).values({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash: data.passwordHash,
      avatarUrl: data.avatarUrl,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    })

    return (await this.findById(data.id))!
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = getDb()
    const row = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    })

    return row ? mapUser(row) : null
  }

  async findById(id: string): Promise<User | null> {
    const db = getDb()
    const row = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    })

    return row ? mapUser(row) : null
  }

  async updateAvatar(data: UpdateUserAvatarInput): Promise<void> {
    const db = getDb()
    await db
      .update(usersTable)
      .set({
        avatarUrl: data.avatarUrl,
        updatedAt: new Date(data.updatedAt),
      })
      .where(and(eq(usersTable.id, data.userId)))
  }
}
