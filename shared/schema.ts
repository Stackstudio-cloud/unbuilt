import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  name: text("name"),
  plan: text("plan").default("free").notNull(),
  searchCount: integer("search_count").default(0).notNull(),
  lastResetDate: timestamp("last_reset_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  preferences: jsonb("preferences").default({}),
  isActive: boolean("is_active").default(true).notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const searches = pgTable("searches", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  resultsCount: integer("results_count").notNull().default(0),
  userId: integer("user_id").references(() => users.id),
});

export const searchResults = pgTable("search_results", {
  id: serial("id").primaryKey(),
  searchId: integer("search_id").references(() => searches.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  feasibility: text("feasibility").notNull(), // "high", "medium", "low"
  marketPotential: text("market_potential").notNull(), // "high", "medium", "low"
  innovationScore: integer("innovation_score").notNull(), // 1-10
  marketSize: text("market_size").notNull(),
  gapReason: text("gap_reason").notNull(),
  isSaved: boolean("is_saved").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  id: true,
  userId: true,
  expiresAt: true,
});

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
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
  name: z.string().min(2).max(100),
}).refine((data) => data.password === data.confirmPassword, {
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

export type User = typeof users.$inferSelect;
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
