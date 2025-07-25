import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateFinAdvisorResponse } from "./openai";
import { insertChatSessionSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat routes (no authentication needed)
  app.get("/api/chat/sessions", async (req, res) => {
    try {
      const sessions = await storage.getChatSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      res.status(500).json({ message: "Failed to fetch chat sessions" });
    }
  });

  app.post("/api/chat/sessions", async (req, res) => {
    try {
      const { title } = insertChatSessionSchema.parse(req.body);
      
      const session = await storage.createChatSession({ title });
      res.json(session);
    } catch (error) {
      console.error("Error creating chat session:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create chat session" });
      }
    }
  });

  app.get("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat/message", async (req, res) => {
    try {
      const { sessionId, content } = req.body;
      
      if (!sessionId || !content?.trim()) {
        return res.status(400).json({ message: "Session ID and content are required" });
      }

      // Add user message
      const userMessage = await storage.addChatMessage({
        sessionId,
        role: "user",
        content: content.trim(),
      });

      // Generate AI response (with built-in fallback handling)
      const aiResponse = await generateFinAdvisorResponse(content);
      
      // Add AI message
      const aiMessage = await storage.addChatMessage({
        sessionId,
        role: "assistant",
        content: aiResponse,
      });

      res.json({
        userMessage,
        aiMessage,
      });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ 
        message: "Failed to process message",
        error: "There was an issue processing your request. Please try again or contact support if the problem persists."
      });
    }
  });

  // Auto-create chat session for first message (simplified version)
  app.post("/api/chat/quick-message", async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content?.trim()) {
        return res.status(400).json({ message: "Content is required" });
      }

      // Generate title from first message (with fallback)
      let title;
      // Fallback: use first 50 characters of content as title
      title = content.length > 50 ? content.substring(0, 50) + "..." : content;
      
      // Create new session
      const session = await storage.createChatSession({ title });

      // Add user message
      const userMessage = await storage.addChatMessage({
        sessionId: session.id,
        role: "user",
        content: content.trim(),
      });

      // Generate AI response (with built-in fallback handling)
      const aiResponse = await generateFinAdvisorResponse(content);
      
      // Add AI message
      const aiMessage = await storage.addChatMessage({
        sessionId: session.id,
        role: "assistant",
        content: aiResponse,
      });

      res.json({
        session,
        userMessage,
        aiMessage,
      });
    } catch (error) {
      console.error("Error processing quick message:", error);
      res.status(500).json({ 
        message: "Failed to process message",
        error: "There was an issue processing your request. Please try again or contact support if the problem persists."
      });
    }
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: "1.0.0" 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}