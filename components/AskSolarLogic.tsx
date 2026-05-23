"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type PageContext = "home" | "estimator" | "quote" | "ev" | "research";

const PAGE_CHIPS: Record<PageContext, string[]> = {
  home: [
    "Should I get solar?",
    "Check my solar payback",
    "Review my quote",
    "Do I need a battery?",
    "Help with EV charging",
  ],
  estimator: [
    "Is solar worth it in my state?",
    "How long is payback usually?",
    "Do I need a battery too?",
    "What system size might I need?",
    "Why is my bill so high?",
  ],
  quote: [
    "Is this quote overpriced?",
    "What is a dealer fee?",
    "Should I compare more bids?",
    "Why is financed price so high?",
    "Does this battery make sense?",
  ],
  ev: [
    "Do I need a panel upgrade?",
    "Is 32A enough?",
    "Hardwired or plug-in?",
    "What is load management?",
    "Is this charger quote fair?",
  ],
  research: [
    "What is NEM 3.0?",
    "Explain dealer fees",
    "Battery ROI under NEM 3.0",
    "Best inverters 2026?",
    "What does offset mean?",
  ],
};

const PAGE_CONTEXT_MAP: Record<PageContext, string> = {
  home: "User is on the SolarLogic homepage — a solar and EV decision intelligence platform. They may be exploring any topic.",
  estimator: "User is on the Solar Payback Estimator page. They are evaluating whether solar makes financial sense for their home.",
  quote: "User is on the Solar Quote Sanity Check page. They likely have a solar quote they want evaluated for fairness, hidden fees, or inflated pricing.",
  ev: "User is on the EV Command Center page. They are deciding on EV charger installation, panel upgrades, load management, or hardware selection.",
  research: "User is on the Research / Intelligence page. They are reading deep dives, market analysis, or glossary entries about solar, batteries, and EV topics.",
};

const STORAGE_KEY = "solarlogic-chat";

function loadMessages(): Message[] {
  try {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveMessages(msgs: Message[]) {
  try {
    if (typeof window === "undefined") return;
    if (msgs.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    }
  } catch {
    // localStorage full or unavailable — ignore
  }
}

export default function AskSolarLogic({
  pageContext = "home",
}: {
  pageContext?: PageContext;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chips = PAGE_CHIPS[pageContext] ?? PAGE_CHIPS.home;
  const contextInfo = PAGE_CONTEXT_MAP[pageContext] ?? PAGE_CONTEXT_MAP.home;

  // ── Hydrate from localStorage on mount ──
  useEffect(() => {
    const saved = loadMessages();
    if (saved.length > 0) {
      setMessages(saved);
      setHasInteracted(true);
    }
    setIsHydrated(true);
  }, []);

  // ── Save to localStorage on change ──
  useEffect(() => {
    if (!isHydrated) return;
    saveMessages(messages);
  }, [messages, isHydrated]);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // ── Focus input on open ──
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // ── Close on Escape ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // ── Exit intent: auto-open once when cursor leaves top ──
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (e.clientY < 50 && !hasInteracted && !isOpen) {
        setIsOpen(true);
        setHasInteracted(true);
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [hasInteracted, isOpen]);

  const sendMessage = useCallback(
    async (overrideInput?: string) => {
      const text = (overrideInput ?? input).trim();
      if (!text || isStreaming) return;

      setHasInteracted(true);

      const userMessage: Message = { role: "user", content: text };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setIsStreaming(true);
      setStreamingContent("");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            context: contextInfo,
          }),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `\u26A0\uFE0F ${errorData.error || "Something went wrong. Please try again."}`,
            },
          ]);
          setIsStreaming(false);
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No stream available");

        let fullContent = "";
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setStreamingContent(fullContent);
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fullContent },
        ]);
        setStreamingContent("");
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "\u26A0\uFE0F Connection error. Please check your internet and try again.",
          },
        ]);
        setStreamingContent("");
      } finally {
        setIsStreaming(false);
      }
    },
    [input, isStreaming, messages, contextInfo]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setStreamingContent("");
    setHasInteracted(false);
    saveMessages([]);
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFD700] text-black shadow-[0_0_30px_rgba(255,215,0,0.25)] transition-all hover:scale-110 hover:shadow-[0_0_50px_rgba(255,215,0,0.35)] md:bottom-6"
            aria-label="Ask SolarLogic"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Label nudge ── */}
      <AnimatePresence>
        {!isOpen && !hasInteracted && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3, delay: 1.5 }}
            className="fixed bottom-28 right-24 z-50 hidden md:block"
          >
            <div className="rounded-full border border-white/10 bg-black/80 px-4 py-2 text-xs font-semibold text-[#FFD700] backdrop-blur-xl whitespace-nowrap">
              Ask SolarLogic
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-[60] flex flex-col overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#0a0a0a]/95 shadow-2xl backdrop-blur-xl
              w-[calc(100vw-3rem)] h-[75vh]
              sm:w-[400px] sm:h-[580px]
              md:w-[420px] md:h-[600px]"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.03] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD700] text-black">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Ask SolarLogic
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Solar &amp; EV decision assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearConversation}
                    className="rounded-full p-2 text-slate-500 transition hover:bg-white/10 hover:text-white"
                    aria-label="Clear conversation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* Empty state */}
              {messages.length === 0 && !isStreaming && (
                <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20">
                    <Bot className="h-7 w-7 text-[#FFD700]" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">
                    Ask SolarLogic
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[260px]">
                    I can help you estimate solar payback, check a quote, or
                    figure out EV charging decisions.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 justify-center">
                    {chips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => sendMessage(chip)}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-slate-300 transition hover:border-[#FFD700]/30 hover:bg-[#FFD700]/8 hover:text-white"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversation messages */}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFD700]/15 text-[#FFD700] mt-0.5">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#FFD700]/15 text-[#FFD700]"
                        : "bg-white/[0.06] text-slate-200"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-white">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-slate-300">{children}</em>
                          ),
                          ul: ({ children }) => (
                            <ul className="ml-4 mb-2 list-disc space-y-1 last:mb-0">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="ml-4 mb-2 list-decimal space-y-1 last:mb-0">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-slate-300">{children}</li>
                          ),
                          code: ({ children }) => (
                            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-mono text-[#FFD700]">
                              {children}
                            </code>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              className="text-[#FFD700] underline underline-offset-2 hover:text-white transition"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-400 mt-0.5">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming content */}
              {isStreaming && streamingContent && (
                <div className="flex gap-3 justify-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFD700]/15 text-[#FFD700] mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-white/[0.06] text-slate-200">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-white">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-slate-300">{children}</em>
                        ),
                        ul: ({ children }) => (
                          <ul className="ml-4 mb-2 list-disc space-y-1 last:mb-0">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="ml-4 mb-2 list-decimal space-y-1 last:mb-0">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-slate-300">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-mono text-[#FFD700]">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {streamingContent}
                    </ReactMarkdown>
                    <span className="inline-block w-1.5 h-4 bg-[#FFD700] animate-pulse ml-0.5 align-text-bottom" />
                  </div>
                </div>
              )}

              {/* Loading dots */}
              {isStreaming && !streamingContent && (
                <div className="flex gap-3 justify-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFD700]/15 text-[#FFD700] mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="max-w-[82%] rounded-2xl px-4 py-3 bg-white/[0.06] text-slate-500 text-sm">
                    <div className="flex gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full bg-slate-500 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-slate-500 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-slate-500 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Post-answer quick chips */}
              {messages.length > 0 &&
                !isStreaming &&
                messages[messages.length - 1]?.role === "assistant" && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {chips.slice(0, 3).map((chip) => (
                      <button
                        key={`follow-${chip}`}
                        onClick={() => sendMessage(chip)}
                        className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] text-slate-400 transition hover:border-[#FFD700]/25 hover:bg-[#FFD700]/8 hover:text-white"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input ── */}
            <div className="border-t border-white/8 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about solar, EV, batteries..."
                  disabled={isStreaming}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#FFD700]/40 focus:ring-2 focus:ring-[#FFD700]/10 disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isStreaming}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    input.trim() && !isStreaming
                      ? "bg-[#FFD700] text-black hover:opacity-90"
                      : "bg-white/[0.04] text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-700">
                AI can make mistakes. Verify important decisions.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}