import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Plus, ChevronLeft, ArrowUp, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat, Message } from "@/hooks/useChat";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import MicPulse from "@/components/MicPulse";
import { useSpeechToTextUI } from "@/hooks/useSpeechToTextUI";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import GoogleLoginPopup from "@/components/ui/google-login-popup";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase";
import { useLocation, useParams } from "wouter";
import { v4 as uuidv4} from "uuid"

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const sanitizedMarkdown = DOMPurify.sanitize(message.text);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-3 my-4 ${
        message.sender === "user" ? "justify-end" : ""
      }`}
    >
      <div
        className={`p-4 ${
          message.sender === "user"
            ? "flex items-center justify-center bg-gray-100 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl border border-gray-200 max-w-xl shadow-sm transition-all duration-300 px-5 py-2"
            : "max-w-4xl transition-all duration-300"
        }`}
      >
        {message.sender === "user" ? (
          <p className="text-base leading-relaxed">{message.text}</p>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="text-base leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="text-base leading-relaxed list-disc pl-5 mb-4">
                  {children}
                </ul>
              ),
              li: ({ children }) => <li className="mb-2">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-bold">{children}</strong>
              ),
            }}
          >
            {sanitizedMarkdown}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-center space-x-2"
  >
    <div className="flex items-center space-x-1.5 border bg-neutral-50 px-4 py-3 rounded-2xl">
      <motion.span
        className="h-1 w-1 bg-[#769DFD] rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 1.2, delay: -0.4 }}
      />
      <motion.span
        className="h-1 w-1 bg-[#769DFD] rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 1.2, delay: -0.2 }}
      />
      <motion.span
        className="h-1 w-1 bg-[#769DFD] rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />
    </div>
  </motion.div>
);

const Chatbot: React.FC = () => {
  const { messages, isLoading, isTyping, historyChats, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState<string>("");
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { transcript, isListening, startListening, stopListening, statusLine } =
    useSpeechToTextUI();
  // Firebase Auth
  const { user, loading } = useFirebaseAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [location, setLocation] = useLocation();


  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
        let isThisNewChat;
        if (id && Array.isArray(historyChats)) {
          isThisNewChat = historyChats.find((data) => data.chat_uid === id);
        }
      let userData;
      if(user){
        userData = {
          uid : user.uid,
          name : user.displayName ?? "Anonymous",
          email : user.email ?? "no-email@example.com",
          chat_uid : id,
          isThisNewChat,
        }
      }
      sendMessage(input,userData);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 280)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        let isThisNewChat = true;
        if (id && Array.isArray(historyChats)) {
          isThisNewChat = !historyChats.some((data) => data.chat_uid?.trim() === id.trim());
        }

        let userData;
        if(user){
          userData = {
            uid : user.uid,
            name : user.displayName ?? "Anonymous",
            email : user.email ?? "no-email@example.com",
            chat_uid : id,
            isThisNewChat,
          }
        }
        sendMessage(input,userData);
        setInput("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    }
  };

  const handleNewChat = () => {
    clearChat();
    setLocation(`/chatbot/${uuidv4()}`)
  };

  const handleSelectChat = (chat: string) => {
    setInput(chat);
  };


  const handleLogout = async () => {
    await signOut(auth);
    setShowProfileDropdown(false);
  };

  // UI: Top right login/profile button with dropdown
  const renderLoginButton = () => (
    <div className="absolute top-6 right-8 z-50">
      {!loading && !user ? (
        <Button
          className="bg-gradient-to-r from-[#74CAFC] to-[#7978FF] text-white font-bold px-6 py-2 rounded-full shadow-md"
          onClick={() => setShowLogin(true)}
        >
          Login
        </Button>
      ) : (
        user && (
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-100 transition-all"
              onClick={() => setShowProfileDropdown((prev) => !prev)}
              style={{
                alignItems: "center",
                verticalAlign: "middle",
              }} /* Added for extra control */
            >
              <Avatar className="flex items-center justify-center">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName ?? "User"}
                    className="rounded-full w-8 h-8 object-cover"
                  />
                ) : (
                  <AvatarFallback className="w-8 h-8 flex items-center justify-center text-white bg-orange-500 rounded-full">
                    {user.displayName?.[0] ?? "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="font-semibold leading-none">
                {user.displayName}
              </span>
            </div> 
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gradient-to-r hover:from-[#74CAFC] hover:to-[#7978FF] hover:text-white transition-colors rounded-lg"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )
      )}
      {showLogin && <GoogleLoginPopup onClose={() => setShowLogin(false)} />}
    </div>
  );

  return (
    <div className="flex h-screen bg-white font-sans relative">
      {renderLoginButton()}
      <motion.aside
        initial={{ width: "15%" }}
        animate={{ width: isSidebarOpen ? "15%" : "64px" }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-800/80 border-r dark:border-neutral-700/30 flex flex-col shadow-lg"
      >
        <div className="p-4 flex  justify-between">
          {isSidebarOpen && (
            <div className="flex flex-col justify-center items-center w-full ">
              <img
                src="/AarthikFlogo.svg"
                alt="Aarthik Logo"
                className="h-6 mt-2"
              />
              <Button
                onClick={handleNewChat}
                className="justify-start gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-300 px-4 py-2 text-sm mt-8"
              >
                <Plus size={16} /> New Chat
              </Button>
              {historyChats.map((data,index)=>{
                return <Button onClick={()=> setLocation(`/chatbot/${data.chat_uid}`)} key={index} className="truncate w-full my-3 p-2 bg-gray-400 rounded-lg">{data.title}</Button>
              })}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-neutral-600 "
          >
            {isSidebarOpen ? (
              <ChevronLeft size={24} />
            ) : (
              <img src="/aarthikLogo.svg" alt="Aarthik Logo" className="h-6" />
            )}
          </Button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col min-h-0 bg-white max-w-5xl mx-auto">
        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 p-6 mt-12 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent justify-center items-center"
        >
          <AnimatePresence>
            {messages.length === 0 && !isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full mt-64 text-center"
              >
                <div className="flex justify-center items-center mb-4">
                  <h2 className="text-4xl font-bold text-black">Welcome to </h2>
                  <img
                    src="/Aarthik.svg"
                    alt="Aarthik Logo"
                    className="w-36 h-auto ml-2"
                  />
                </div>
                <p className="text-neutral-500 font-semibold">
                  Ask Anything About Finance. Get AI-Powered Answers Instantly.
                </p>
              </motion.div>
            )}
            {messages.map((message: Message,index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
        </ScrollArea>

        <footer className="bg-white mb-5">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-3 max-w-5xl mx-auto border rounded-2xl px-6 py-6"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask any finance-related question..."
              className="flex-1 px-2 focus:outline-none resize-none min-h-[2rem] max-h-[15rem] overflow-y-auto border-none"
              disabled={isLoading}
              rows={1}
            />
            <Button
              type="button"
              className="relative rounded-full bg-gradient-to-r from-[#74CAFC] to-[#7978FF] text-white w-12 h-12 flex-shrink-0 shadow-md transition-all duration-300 font-bold"
              onClick={
                isListening
                  ? () => {
                      stopListening();
                      setInput((prev) => prev + " " + transcript);
                    }
                  : startListening
              }
            >
              <Mic />
              {isListening && (
                <div className="absolute">
                  <MicPulse />
                </div>
              )}
            </Button>

            <Button
              type="submit"
              className="rounded-full bg-gradient-to-r from-[#74CAFC] to-[#7978FF] text-white w-12 h-12 flex-shrink-0 shadow-md transition-all duration-300 font-bold"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <ArrowUp />
              )}
            </Button>
          </form>
        </footer>
      </main>
    </div>
  );
};

export default Chatbot;
