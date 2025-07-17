import { z } from "zod";

// Simple types for in-memory storage (no database)
export type ChatMessage = {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

export type ChatSession = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertChatMessage = Omit<ChatMessage, "id" | "createdAt">;
export type InsertChatSession = Omit<ChatSession, "id" | "createdAt" | "updatedAt">;

// Zod schemas for validation
export const insertChatSessionSchema = z.object({
  title: z.string().min(1).max(200),
});

export const insertChatMessageSchema = z.object({
  sessionId: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});