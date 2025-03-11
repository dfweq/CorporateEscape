import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  company: text("company").notNull(),
  burnoutScore: integer("burnout_score").default(50),
  avatarInitials: text("avatar_initials").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Company schema
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  totalDepartures: integer("total_departures").default(0),
  avgTenure: integer("avg_tenure").default(0), // In months
  weeklyTrends: json("weekly_trends").$type<number[]>().default([]),
  exitReasons: json("exit_reasons").$type<Record<string, number>>().default({}),
  destinations: json("destinations").$type<Record<string, number>>().default({}),
});

// Notification schema
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // NEW_CONNECTION, ALERT, MENTION, RESOURCE
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  actionLabel: text("action_label"),
  actionUrl: text("action_url"),
});

// Activity schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  tags: json("tags").$type<string[]>().default([]),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  joinedAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Burnout symptoms type
export type BurnoutSymptoms = {
  mentalExhaustion: number;
  workCynicism: number;
  sundayAnxiety: number;
  productivity: number;
};
