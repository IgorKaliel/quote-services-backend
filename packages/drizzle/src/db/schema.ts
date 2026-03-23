import { relations } from "drizzle-orm"
import { doublePrecision, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"

export const budgetStatusEnum = pgEnum("budget_status", ["draft", "sent", "approved", "rejected"])
export const budgetDiscountTypeEnum = pgEnum("budget_discount_type", ["percentage", "fixed"])

export const usersTable = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    passwordHash: text("password_hash").notNull(),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
)

export const userSessionsTable = pgTable(
  "user_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    refreshTokenHash: text("refresh_token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("user_sessions_refresh_token_hash_idx").on(table.refreshTokenHash),
  ],
)

export const clientsTable = pgTable(
  "clients",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [uniqueIndex("clients_user_id_name_idx").on(table.userId, table.name, table.createdAt)],
)

export const categoriesTable = pgTable("categories", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
})

export const budgetsTable = pgTable(
  "budgets",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    clientId: text("client_id")
      .notNull()
      .references(() => clientsTable.id, { onDelete: "cascade" }),
    categoryId: text("category_id").references(() => categoriesTable.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    status: budgetStatusEnum("status").notNull(),
    discountType: budgetDiscountTypeEnum("discount_type"),
    discountValue: doublePrecision("discount_value").notNull().default(0),
    subtotal: doublePrecision("subtotal").notNull().default(0),
    total: doublePrecision("total").notNull().default(0),
    publicToken: text("public_token"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [uniqueIndex("budgets_public_token_idx").on(table.publicToken)],
)

export const budgetItemsTable = pgTable("budget_items", {
  id: text("id").primaryKey(),
  budgetId: text("budget_id")
    .notNull()
    .references(() => budgetsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  unitPrice: doublePrecision("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  total: doublePrecision("total").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
})

export const usersRelations = relations(usersTable, ({ many }) => ({
  sessions: many(userSessionsTable),
  clients: many(clientsTable),
  categories: many(categoriesTable),
  budgets: many(budgetsTable),
}))

export const userSessionsRelations = relations(userSessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userSessionsTable.userId],
    references: [usersTable.id],
  }),
}))

export const clientsRelations = relations(clientsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [clientsTable.userId],
    references: [usersTable.id],
  }),
  budgets: many(budgetsTable),
}))

export const categoriesRelations = relations(categoriesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [categoriesTable.userId],
    references: [usersTable.id],
  }),
  budgets: many(budgetsTable),
}))

export const budgetsRelations = relations(budgetsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [budgetsTable.userId],
    references: [usersTable.id],
  }),
  client: one(clientsTable, {
    fields: [budgetsTable.clientId],
    references: [clientsTable.id],
  }),
  category: one(categoriesTable, {
    fields: [budgetsTable.categoryId],
    references: [categoriesTable.id],
  }),
  items: many(budgetItemsTable),
}))

export const budgetItemsRelations = relations(budgetItemsTable, ({ one }) => ({
  budget: one(budgetsTable, {
    fields: [budgetItemsTable.budgetId],
    references: [budgetsTable.id],
  }),
}))

export const schema = {
  usersTable,
  userSessionsTable,
  clientsTable,
  categoriesTable,
  budgetsTable,
  budgetItemsTable,
  usersRelations,
  userSessionsRelations,
  clientsRelations,
  categoriesRelations,
  budgetsRelations,
  budgetItemsRelations,
}
