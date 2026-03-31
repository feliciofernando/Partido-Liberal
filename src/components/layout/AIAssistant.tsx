"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import {
  Send,
  X,
  Minimize2,
  Bot,
  Sparkles,
  User,
  Loader2,
  Vote,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show button after scrolling down
  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          sessionId,
        }),
      });
      const data = await res.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || t.assistant.fallback,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: t.assistant.error,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        >
          {/* Chat Window */}
          <AnimatePresence>
            {isOpen && !isMinimized && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                }}
                className="w-[calc(100vw-3rem)] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
                style={{ maxHeight: "70vh" }}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-party-blue to-party-blue-dark text-white p-4 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{t.assistant.title}</h3>
                      <p className="text-xs text-white/70 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400" />
                        Online
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      aria-label={t.assistant.minimize}
                    >
                      <Minimize2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={closeChat}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      aria-label={t.assistant.close}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                {messages.length === 0 ? (
                  <div className="flex-1 p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-party-blue/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-party-blue" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {t.assistant.welcome}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-6">
                      {t.assistant.welcomeDesc}
                    </p>
                    <div className="space-y-2">
                      {t.assistant.questions.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="w-full text-left px-3 py-2.5 text-sm bg-muted/50 hover:bg-party-blue/10 hover:text-party-blue rounded-lg transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[350px] sm:h-[400px] p-4">
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex gap-3 ${
                              msg.role === "user" ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                msg.role === "user"
                                  ? "bg-party-blue text-white"
                                  : "bg-party-yellow/30 text-party-blue-dark"
                              }`}
                            >
                              {msg.role === "user" ? (
                                <User className="h-4 w-4" />
                              ) : (
                                <Vote className="h-4 w-4" />
                              )}
                            </div>
                            <div
                              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                msg.role === "user"
                                  ? "bg-party-blue text-white rounded-tr-none"
                                  : "bg-gray-100 text-foreground rounded-tl-none"
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-party-yellow/30 flex items-center justify-center flex-shrink-0">
                              <Vote className="h-4 w-4 text-party-blue-dark" />
                            </div>
                            <div className="px-4 py-2.5 rounded-2xl bg-gray-100 rounded-tl-none">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">{t.assistant.thinking}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {/* Quick Questions (show when chat has messages) */}
                {messages.length > 0 && !isLoading && (
                  <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
                    {t.assistant.questions.slice(0, 2).map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="whitespace-nowrap text-xs px-3 py-1.5 bg-muted/50 hover:bg-party-blue/10 hover:text-party-blue rounded-full transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-3 border-t flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={t.assistant.placeholder}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isLoading || !input.trim()}
                      className="bg-party-blue hover:bg-party-blue-dark text-white shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Button */}
          {!isOpen && (
            <motion.button
              onClick={toggleChat}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-party-blue hover:bg-party-blue-dark transition-colors relative"
              aria-label={t.assistant.openAssistant}
            >
              <Bot className="h-7 w-7 text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-party-yellow rounded-full border-2 border-white animate-pulse" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
