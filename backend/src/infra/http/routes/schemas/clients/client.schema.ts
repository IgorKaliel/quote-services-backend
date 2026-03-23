export const clientSchema = {
  $id: "Client",
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    email: { type: ["string", "null"], format: "email" },
    phone: { type: ["string", "null"] },
    company: { type: ["string", "null"] },
    notes: { type: ["string", "null"] },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const
