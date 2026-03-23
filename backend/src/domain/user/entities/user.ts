export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  passwordHash: string
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface PublicUser {
  id: string
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})
