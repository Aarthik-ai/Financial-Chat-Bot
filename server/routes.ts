import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateFinancialResponse, generateChatTitle } from "./openai";
import { insertChatSessionSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Chat routes
  app.get("/api/chat/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getChatSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      res.status(500).json({ message: "Failed to fetch chat sessions" });
    }
  });

  app.post("/api/chat/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { title } = insertChatSessionSchema.parse({ ...req.body, userId });
      
      const session = await storage.createChatSession({ title, userId });
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

  app.get("/api/chat/sessions/:sessionId/messages", isAuthenticated, async (req: any, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      if (isNaN(sessionId)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }

      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat/message", isAuthenticated, async (req: any, res) => {
    try {
      const { sessionId, content } = req.body;
      
      if (!sessionId || !content?.trim()) {
        return res.status(400).json({ message: "Session ID and content are required" });
      }

      // Add user message
      const userMessage = await storage.addChatMessage({
        sessionId: parseInt(sessionId),
        role: "user",
        content: content.trim(),
      });

      // Generate AI response
      const aiResponse = await generateFinancialResponse(content);
      
      // Add AI message
      const aiMessage = await storage.addChatMessage({
        sessionId: parseInt(sessionId),
        role: "assistant",
        content: aiResponse,
      });

      res.json({
        userMessage,
        aiMessage,
      });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Auto-create chat session for first message
  app.post("/api/chat/quick-message", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { content } = req.body;
      
      if (!content?.trim()) {
        return res.status(400).json({ message: "Content is required" });
      }

      // Generate title from first message
      const title = await generateChatTitle(content);
      
      // Create new session
      const session = await storage.createChatSession({ title, userId });

      // Add user message
      const userMessage = await storage.addChatMessage({
        sessionId: session.id,
        role: "user",
        content: content.trim(),
      });

      // Generate AI response
      const aiResponse = await generateFinancialResponse(content);
      
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
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Subscription routes
  app.post("/api/subscription/upgrade", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { plan } = req.body;
      
      if (!["pro", "enterprise"].includes(plan)) {
        return res.status(400).json({ message: "Invalid subscription plan" });
      }

      const user = await storage.updateUserSubscription(userId, plan);
      res.json(user);
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      res.status(500).json({ message: "Failed to upgrade subscription" });
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
