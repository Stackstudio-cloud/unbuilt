import { pgTable, text, serial, integer, boolean, timestamp, jsonb, index, unique, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const searches = pgTable("searches", {
  id: serial().primaryKey().notNull(),
  query: text().notNull(),
  timestamp: timestamp({ mode: 'string' }).defaultNow().notNull(),
  resultsCount: integer("results_count").default(0).notNull(),
  userId: integer("user_id"),
}, (table) => [
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "searches_user_id_users_id_fk"
  }),
]);

export const searchResults = pgTable("search_results", {
  id: serial().primaryKey().notNull(),
  searchId: integer("search_id").notNull(),
  title: text().notNull(),
  description: text().notNull(),
  category: text().notNull(),
  feasibility: text().notNull(),
  marketPotential: text("market_potential").notNull(),
  innovationScore: integer("innovation_score").notNull(),
  marketSize: text("market_size").notNull(),
  gapReason: text("gap_reason").notNull(),
  isSaved: boolean("is_saved").default(false).notNull(),
}, (table) => [
  foreignKey({
    columns: [table.searchId],
    foreignColumns: [searches.id],
    name: "search_results_search_id_searches_id_fk"
  }),
]);

export const users = pgTable("users", {
  id: serial().primaryKey().notNull(),
  email: text().notNull(),
  password: text(),
  name: text(),
  plan: text().default('free').notNull(),
  searchCount: integer("search_count").default(0).notNull(),
  lastResetDate: timestamp("last_reset_date", { mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default('inactive'),
  trialUsed: boolean("trial_used").default(false).notNull(),
  trialExpiration: timestamp("trial_expiration", { mode: 'string' }),
  preferences: jsonb().default({}),
  isActive: boolean("is_active").default(true).notNull(),
  avatar: text(),
  provider: text().default('local').notNull(),
  providerId: text("provider_id"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
}, (table) => [
  unique("users_email_unique").on(table.email),
]);

export const sessions = pgTable("session", {
  sid: text().primaryKey().notNull(),
  sess: jsonb().notNull(),
  expire: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
  index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export type UpsertUser = typeof users.$inferInsert;

export const insertSearchSchema = createInsertSchema(searches).pick({
  query: true,
  userId: true,
});

export const insertSearchResultSchema = createInsertSchema(searchResults).pick({
  searchId: true,
  title: true,
  description: true,
  category: true,
  feasibility: true,
  marketPotential: true,
  innovationScore: true,
  marketSize: true,
  gapReason: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  confirmPassword: z.string().min(6).optional(),
  name: z.string().min(2).max(100),
}).refine((data) => {
  // Only validate password match if password is provided (for local auth)
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Create the insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertSessionSchema = createInsertSchema(sessions);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type InsertSearch = z.infer<typeof insertSearchSchema>;
export type Search = typeof searches.$inferSelect;
export type InsertSearchResult = z.infer<typeof insertSearchResultSchema>;
export type SearchResult = typeof searchResults.$inferSelect;

export const PLAN_LIMITS = {
  free: { searches: 5, exports: 3 },
  pro: { searches: -1, exports: -1 }, // unlimited
  enterprise: { searches: -1, exports: -1 }, // unlimited
};

export const PLAN_PRICES = {
  free: 0,
  pro: 29,
  enterprise: 299,
};
