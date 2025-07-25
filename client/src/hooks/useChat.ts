import { useState } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

// Define User Meta Data for sendMessage
interface UserMetaData {
  uid: string;
  name: string;
  email: string;
}

// Call your backend API instead of simulating a response
const getBotResponse = async (message: string, userData: any): Promise<string> => {
  try {
    const response = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userData }),
    });
    if (!response.ok) {
      throw new Error('Failed to get response from server');
    }
    const data = await response.json();
    return data.response || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error calling backend:", error);
    return "I'm sorry, something went wrong. Please try again later.";
  }
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text: string, userData: any) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const botText = await getBotResponse(text,userData);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, something went wrong. Please try again later.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return { messages, isLoading, isTyping, sendMessage, clearChat };
};