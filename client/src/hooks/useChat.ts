import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  FieldValue,
  getDoc,
  serverTimestamp,
  orderBy,
  query,
  onSnapshot,
  Timestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFirebaseAuth } from "./use-firebase-auth";
import { useParams } from "wouter";
import { string } from "zod";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
  createdAt: string | FieldValue | Timestamp;
}

// Call your backend API instead of simulating a response
const getBotResponse = async (message: string): Promise<string> => {
  try {
    const response = await fetch("http://localhost:3000/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error("Failed to get response from server");
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
  const { id } = useParams<{ id: string }>();
  const [historyChats, setHistoryChats] = useState([]);
  const { user } = useFirebaseAuth();
  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const userRef = doc(db, "users", user?.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const historyChats = userSnap.data().historyChats || [];
        const sortedChats = historyChats.sort(
          (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
        );
        setHistoryChats(sortedChats);
      } else {
        console.log("No such user!");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const messagesRef = collection(
          db,
          "chat_history",
          user?.uid,
          "user_chat_histories",
          id,
          "messages"
        );
        const q = query(messagesRef, orderBy("createdAt", "asc"));
        onSnapshot(q, (snapshot) => {
          const mess = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Message),
          }));
          setMessages(mess);
        });
      } catch (err) {
        console.error("Error fetching Messages:", err);
      }
    };
    let isThisNewChat = true;
    if (id && Array.isArray(historyChats)) {
      isThisNewChat = !historyChats.some(
        (data) => data.chat_uid?.trim() === id.trim()
      );
    }
    if (!isThisNewChat) {
      fetchMessage();
    }
  }, [user, historyChats]);

  const sendMessage = async (text: string, userData: any) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id : userData?.uid | "123456",
      text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: serverTimestamp(),
    };
    if (userData) {
      const messagesRef = collection(
        db,
        "chat_history",
        userData.uid,
        "user_chat_histories",
        userData.chat_uid,
        "messages"
      );
      await addDoc(messagesRef, userMessage);
      if (userData.isThisNewChat) {
        const userRef = doc(db, "users", userData.uid);
        const createdAt = Timestamp.now();
        const newChat = {
          chat_uid: userData.chat_uid,
          title: text,
          createdAt,
        };
        await updateDoc(userRef, {
          historyChats: arrayUnion(newChat),
        });
        fetchUser();
      }
    }

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const botText = await getBotResponse(text);
      const botMessage: Message = {
        id: "123456789",
        text: botText,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: serverTimestamp(),
      };

      if (userData) {
        const messagesRef = collection(
          db,
          "chat_history",
          userData.uid,
          "user_chat_histories",
          userData.chat_uid,
          "messages"
        );
        await addDoc(messagesRef, botMessage);
      }
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, something went wrong. Please try again later.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: serverTimestamp(),
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

  return {
    messages,
    isLoading,
    isTyping,
    historyChats,
    setHistoryChats,
    sendMessage,
    clearChat,
  };
};
