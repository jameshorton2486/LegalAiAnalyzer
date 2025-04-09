import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Cases
export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  caseNumber: text("caseNumber"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const insertCaseSchema = createInsertSchema(cases).pick({
  title: true,
  caseNumber: true,
  description: true,
});

export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = typeof cases.$inferSelect;

// Transcripts
export const transcripts = pgTable("transcripts", {
  id: serial("id").primaryKey(),
  caseId: integer("caseId").notNull(),
  title: text("title").notNull(),
  witnessName: text("witnessName").notNull(),
  witnessType: text("witnessType"),
  date: timestamp("date"),
  content: text("content").notNull(),
  pages: integer("pages"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const insertTranscriptSchema = createInsertSchema(transcripts).pick({
  caseId: true,
  title: true,
  witnessName: true,
  witnessType: true,
  date: true,
  content: true,
  pages: true,
});

export type InsertTranscript = z.infer<typeof insertTranscriptSchema>;
export type Transcript = typeof transcripts.$inferSelect;

// Analysis
export const analysis = pgTable("analysis", {
  id: serial("id").primaryKey(),
  transcriptId: integer("transcriptId").notNull(),
  type: text("type").notNull(), // "questions", "contradictions", "insights"
  content: text("content").notNull(), // JSON string
  createdAt: timestamp("createdAt").defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analysis).pick({
  transcriptId: true,
  type: true,
  content: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analysis.$inferSelect;

// Contradictions
export const contradictions = pgTable("contradictions", {
  id: serial("id").primaryKey(),
  caseId: integer("caseId").notNull(),
  transcript1Id: integer("transcript1Id").notNull(),
  transcript2Id: integer("transcript2Id").notNull(),
  description: text("description").notNull(),
  excerpt1: text("excerpt1").notNull(),
  excerpt2: text("excerpt2").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const insertContradictionSchema = createInsertSchema(contradictions).pick({
  caseId: true,
  transcript1Id: true,
  transcript2Id: true,
  description: true,
  excerpt1: true,
  excerpt2: true,
});

export type InsertContradiction = z.infer<typeof insertContradictionSchema>;
export type Contradiction = typeof contradictions.$inferSelect;
