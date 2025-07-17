import {
  type ChatSession,
  type InsertChatSession,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { nanoid } from "nanoid";

// Interface for storage operations
export interface IStorage {
  // Chat operations
  getChatSessions(): Promise<ChatSession[]>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

// In-memory storage implementation (no database needed)
export class MemStorage implements IStorage {
  private sessions: ChatSession[] = [];
  private messages: ChatMessage[] = [];

  async getChatSessions(): Promise<ChatSession[]> {
    return [...this.sessions].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async createChatSession(sessionData: InsertChatSession): Promise<ChatSession> {
    const session: ChatSession = {
      id: nanoid(),
      title: sessionData.title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.sessions.push(session);
    return session;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return this.messages
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async addChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: nanoid(),
      sessionId: messageData.sessionId,
      role: messageData.role,
      content: messageData.content,
      createdAt: new Date(),
    };
    
    this.messages.push(message);
    
    // Update session's updatedAt timestamp
    const session = this.sessions.find(s => s.id === messageData.sessionId);
    if (session) {
      session.updatedAt = new Date();
    }
    
    return message;
  }
}

export const storage = new MemStorage();