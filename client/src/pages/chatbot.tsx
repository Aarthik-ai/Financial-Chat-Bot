import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Bot, User, Crown, Send } from "lucide-react";
import { motion } from "framer-motion";
import type { ChatSession, ChatMessage } from "@shared/schema";

export default function Chatbot() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the chatbot.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  // Fetch chat sessions
  const { data: sessions = [] } = useQuery({
    queryKey: ["/api/chat/sessions"],
    enabled: isAuthenticated,
  });

  // Fetch messages for current session
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/chat/sessions", currentSessionId, "messages"],
    enabled: isAuthenticated && currentSessionId !== null,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { content: string; sessionId?: number }) => {
      if (data.sessionId) {
        return await apiRequest("POST", "/api/chat/message", {
          sessionId: data.sessionId,
          content: data.content,
        });
      } else {
        return await apiRequest("POST", "/api/chat/quick-message", {
          content: data.content,
        });
      }
    },
    onSuccess: (response, variables) => {
      const data = response.json();
      
      if (!variables.sessionId && data.session) {
        // New session created
        setCurrentSessionId(data.session.id);
        queryClient.invalidateQueries({ queryKey: ["/api/chat/sessions"] });
      }
      
      // Refresh messages
      if (currentSessionId || data.session) {
        queryClient.invalidateQueries({ 
          queryKey: ["/api/chat/sessions", currentSessionId || data.session.id, "messages"] 
        });
      }
      
      setCurrentMessage("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    sendMessageMutation.mutate({
      content: currentMessage.trim(),
      sessionId: currentSessionId || undefined,
    });
  };

  const handleQuickMessage = (message: string) => {
    setCurrentMessage(message);
    sendMessageMutation.mutate({
      content: message,
      sessionId: currentSessionId || undefined,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden shadow-lg">
          {/* Chat Header */}
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <Bot size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Arthik AI Assistant</h2>
                  <p className="text-blue-100">Online • Ready to help with trading insights</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setLocation("/pricing")}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            </div>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="p-0">
            <div className="h-96 overflow-y-auto p-6 bg-gray-50">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <motion.div 
                  className="flex items-start mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm max-w-md">
                    <p className="text-neutral-800">
                      Hello! I'm your AI trading assistant. I can help you with market analysis, 
                      trading strategies, portfolio management, and financial insights. What would you like to know?
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Chat Messages */}
              {messages.map((message: ChatMessage, index: number) => (
                <motion.div
                  key={message.id}
                  className={`flex items-start mb-4 ${message.role === 'user' ? 'justify-end' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                  
                  <div className={`rounded-lg p-4 shadow-sm max-w-md ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-neutral-800'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-neutral-300 rounded-full flex items-center justify-center ml-3">
                      <User size={16} className="text-neutral-600" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading indicator */}
              {sendMessageMutation.isPending && (
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-white border-t">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask about stocks, trading strategies, market analysis..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={sendMessageMutation.isPending}
                  />
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || sendMessageMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {sendMessageMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Send size={16} />
                  )}
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleQuickMessage('Market overview for today')}
                  disabled={sendMessageMutation.isPending}
                >
                  Market Overview
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleQuickMessage('Analyze my portfolio')}
                  disabled={sendMessageMutation.isPending}
                >
                  Portfolio Analysis
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleQuickMessage('Best stocks to buy now')}
                  disabled={sendMessageMutation.isPending}
                >
                  Investment Ideas
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleQuickMessage('Risk management tips')}
                  disabled={sendMessageMutation.isPending}
                >
                  Risk Management
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
