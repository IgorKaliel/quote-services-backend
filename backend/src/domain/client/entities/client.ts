export interface Client {
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
