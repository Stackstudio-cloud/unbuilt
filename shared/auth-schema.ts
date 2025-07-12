import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  name: text("name"),
  plan: text("plan").default("free").notNull(), // free, pro, enterprise
  searchCount: integer("search_count").default(0).notNull(),
  lastResetDate: timestamp("last_reset_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionStatus: text("subscription_status").default("inactive"), // active, inactive, cancelled
  subscriptionId: text("subscription_id"),
  preferences: jsonb("preferences").default({}),
  isActive: boolean("is_active").default(true).notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).max(100),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

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