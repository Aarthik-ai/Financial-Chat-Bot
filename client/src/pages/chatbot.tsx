import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Bot, User, Send } from "lucide-react";
import { motion } from "framer-motion";
import type { ChatSession, ChatMessage } from "@shared/schema";

export default function Chatbot() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat sessions
  const { data: sessions = [] } = useQuery({
    queryKey: ["/api/chat/sessions"],
  });

  // Fetch messages for current session
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/chat/sessions", currentSessionId, "messages"],
    enabled: currentSessionId !== null,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { content: string; sessionId?: string }) => {
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
      queryClient.invalidateQueries({ 
        queryKey: ["/api/chat/sessions", data.session?.id || variables.sessionId, "messages"] 
      });
      
      setCurrentMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    sendMessageMutation.mutate({
      content: currentMessage,
      sessionId: currentSessionId || undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    setCurrentSessionId(null);
    setCurrentMessage("");
  };

  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          {/* Chat Sessions Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Chat History</h2>
                <Button
                  onClick={startNewChat}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  New Chat
                </Button>
              </div>
            </div>
            
            <div className="p-2 space-y-2 overflow-y-auto h-[calc(100%-5rem)]">
              {sessions.map((session: ChatSession) => (
                <button
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentSessionId === session.id
                      ? "bg-blue-50 border-blue-200 border"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {session.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
              
              {sessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No chat sessions yet.</p>
                  <p className="text-sm mt-2">Start a new conversation!</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow border flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center">
                <Bot className="h-8 w-8 mr-3" />
                <div>
                  <h1 className="text-xl font-bold">Arthik.ai Assistant</h1>
                  <p className="text-blue-100 text-sm">Your AI financial trading companion</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!currentSessionId && messages.length === 0 && (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Welcome to Arthik.ai!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Ask me anything about trading, market analysis, or investment strategies.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentMessage("What are the best trading strategies for beginners?")}
                      className="text-left h-auto p-4"
                    >
                      <div>
                        <div className="font-medium">Trading Strategies</div>
                        <div className="text-sm text-gray-500">Learn beginner-friendly approaches</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentMessage("How do I analyze stock market trends?")}
                      className="text-left h-auto p-4"
                    >
                      <div>
                        <div className="font-medium">Market Analysis</div>
                        <div className="text-sm text-gray-500">Understand market patterns</div>
                      </div>
                    </Button>
                  </div>
                </div>
              )}

              {messagesLoading && (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              )}

              {messages.map((message: ChatMessage) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === "assistant" && (
                        <Bot className="h-5 w-5 mt-0.5 text-blue-600" />
                      )}
                      {message.role === "user" && (
                        <User className="h-5 w-5 mt-0.5 text-white" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                        <div className={`text-xs mt-1 ${
                          message.role === "user" ? "text-blue-100" : "text-gray-500"
                        }`}>
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {sendMessageMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-blue-600" />
                      <LoadingSpinner size="sm" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex space-x-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about trading, markets, or investments..."
                  className="flex-1"
                  disabled={sendMessageMutation.isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || sendMessageMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {sendMessageMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}