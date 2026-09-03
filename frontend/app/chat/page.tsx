"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Compass,
  MessageCircle,
  Pencil,
  Plus,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

import {
  createConversation,
  getConversations,
  getMessages,
  renameConversation,
  sendMessage,
  type Conversation,
  type ConversationMessage,
} from "../../services/conversationService";


// =========================================================
// TYPES
// =========================================================

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  // Timestamp shown below each bubble
  timestamp: string;
};


// =========================================================
// SUGGESTION CHIPS
// =========================================================

const SUGGESTIONS = [
  "Plan a 7-day trip to Japan",
  "Best places to visit in Bali",
  "Create a budget travel itinerary",
  "What to pack for Southeast Asia?",
];


// =========================================================
// HELPERS
// =========================================================

function conversationLabel(conv: Conversation): string {
  return conv.title ?? `Conversation #${conv.id}`;
}

/** Format ISO timestamp → "HH:MM" in local time */
function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function toMessage(m: ConversationMessage, idx: number): Message {
  return {
    id: m.id ?? idx,
    role: m.role,
    content: m.content,
    timestamp: m.created_at ? formatTime(m.created_at) : "",
  };
}


// =========================================================
// PAGE
// =========================================================

export default function ChatPage() {

  const router = useRouter();

  // -------------------------------------------------------
  // STATE
  // -------------------------------------------------------

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [activeId, setActiveId] =
    useState<number | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [input, setInput] =
    useState("");

  const [initLoading, setInitLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [msgLoading, setMsgLoading] =
    useState(false);

  const [initError, setInitError] =
    useState("");

  const [sendError, setSendError] =
    useState("");

  // -------------------------------------------------------
  // RENAME STATE
  // -------------------------------------------------------

  // ID of the conversation currently being renamed
  const [renamingId, setRenamingId] =
    useState<number | null>(null);

  // Draft value in the rename input
  const [renameValue, setRenameValue] =
    useState("");

  // Whether the PATCH request is in flight
  const [renameSaving, setRenameSaving] =
    useState(false);

  // Error message from a failed rename
  const [renameError, setRenameError] =
    useState("");

  // Ref so we can auto-focus the rename input
  const renameInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------
  // REFS
  // -------------------------------------------------------

  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const uiIdCounter = useRef(-1);
  function nextUiId() {
    uiIdCounter.current -= 1;
    return uiIdCounter.current;
  }


  // =========================================================
  // INIT
  // =========================================================

  useEffect(() => {

    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function init() {
      try {
        const convList = await getConversations();

        if (convList.length > 0) {
          setConversations(convList);
          await selectConversation(convList[0].id, convList);
        } else {
          const created = await createConversation();
          const newConv: Conversation = {
            id: created.conversation_id,
            title: null,
            created_at: new Date().toISOString(),
          };
          setConversations([newConv]);
          setActiveId(created.conversation_id);
          setMessages([]);
        }
      } catch (err) {
        setInitError(
          err instanceof Error ? err.message : "Failed to initialize chat."
        );
      } finally {
        setInitLoading(false);
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);


  // =========================================================
  // AUTO SCROLL
  // Smooth scroll when a new message is added (send flow).
  // Instant scroll when a conversation is loaded (select flow)
  // — handled inside selectConversation after setMessages.
  // =========================================================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);


  // =========================================================
  // SELECT CONVERSATION
  // =========================================================

  async function selectConversation(
    id: number,
    convList?: Conversation[]
  ) {
    if (id === activeId && convList === undefined) return;

    setActiveId(id);
    setMessages([]);
    setSendError("");
    setMsgLoading(true);

    try {
      const loaded = await getMessages(id);
      setMessages(loaded.map(toMessage));
      // Instant jump to bottom so user sees latest message first
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 0);
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : "Failed to load messages."
      );
    } finally {
      setMsgLoading(false);
      inputRef.current?.focus();
    }

    if (convList !== undefined) {
      setConversations(convList);
    }
  }


  // =========================================================
  // NEW CONVERSATION
  // =========================================================

  async function handleNewConversation() {
    try {
      const created = await createConversation();
      const newConv: Conversation = {
        id: created.conversation_id,
        title: null,
        created_at: new Date().toISOString(),
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(created.conversation_id);
      setMessages([]);
      setSendError("");
      inputRef.current?.focus();
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : "Failed to create conversation."
      );
    }
  }


  // =========================================================
  // RENAME CONVERSATION
  // =========================================================

  function startRename(conv: Conversation, e: React.MouseEvent) {
    // Prevent the click from also selecting the conversation
    e.stopPropagation();
    setRenamingId(conv.id);
    setRenameValue(conv.title ?? "");
    setRenameError("");
    // Focus the input after React renders it
    setTimeout(() => renameInputRef.current?.focus(), 0);
  }

  function cancelRename() {
    setRenamingId(null);
    setRenameValue("");
    setRenameError("");
  }

  async function commitRename() {
    const title = renameValue.trim();

    if (!title) {
      setRenameError("Title cannot be empty.");
      renameInputRef.current?.focus();
      return;
    }

    if (renamingId === null) return;

    setRenameSaving(true);
    setRenameError("");

    try {
      const result = await renameConversation(renamingId, title);

      // Update the conversation list in-place
      setConversations((prev) =>
        prev.map((c) =>
          c.id === result.id ? { ...c, title: result.title } : c
        )
      );

      setRenamingId(null);
      setRenameValue("");
    } catch (err) {
      setRenameError(
        err instanceof Error ? err.message : "Failed to rename."
      );
      renameInputRef.current?.focus();
    } finally {
      setRenameSaving(false);
    }
  }

  function handleRenameKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitRename();
    } else if (e.key === "Escape") {
      cancelRename();
    }
  }


  // =========================================================
  // SEND MESSAGE
  // =========================================================

  async function handleSend(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    await doSend(input.trim());
  }

  async function doSend(text: string) {
    if (!text || sending || activeId === null) return;

    setSendError("");

    const userMsg: Message = {
      id: nextUiId(),
      role: "user",
      content: text,
      timestamp: formatTime(new Date().toISOString()),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const result = await sendMessage(activeId, text);
      const assistantMsg: Message = {
        id: result.message_id,
        role: "assistant",
        content: result.content,
        timestamp: formatTime(new Date().toISOString()),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : "Failed to get response."
      );
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }


  // =========================================================
  // RENDER — INIT LOADING
  // =========================================================

  if (initLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-[#050816]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/25">
            <Compass size={22} className="text-white" />
          </div>
          <div className="flex items-center gap-2.5 text-slate-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
            <span className="text-sm">Loading your conversations...</span>
          </div>
        </div>
      </div>
    );
  }


  // =========================================================
  // RENDER — INIT ERROR
  // =========================================================

  if (initError) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-[#050816] px-6">
        <div className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-red-500/8 p-6 text-center">
          <p className="font-semibold text-red-300">Failed to load chat</p>
          <p className="mt-1.5 text-sm text-red-400/70">{initError}</p>
        </div>
      </div>
    );
  }


  // =========================================================
  // RENDER — MAIN
  // =========================================================

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#050816] text-white">

      {/* =======================================================
          SIDEBAR
      ======================================================= */}

      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-800/50 bg-[#07101f]">

        {/* ---------------------------------------------------
            SIDEBAR HEADER
        --------------------------------------------------- */}

        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Conversations
          </span>

          <button
            onClick={handleNewConversation}
            aria-label="New Conversation"
            title="New Conversation"
            className="
              group flex h-6 w-6 items-center justify-center
              rounded-md border border-slate-700/80
              text-slate-500 transition
              hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-400
              active:scale-95
            "
          >
            <Plus size={13} strokeWidth={2.5} />
          </button>
        </div>


        {/* ---------------------------------------------------
            CONVERSATION LIST
        --------------------------------------------------- */}

        <nav className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">

          {conversations.length === 0 ? (

            <p className="px-3 py-2 text-xs text-slate-600">
              No conversations yet.
            </p>

          ) : (

            <ul className="space-y-0.5">
              {conversations.map((conv) => {

                const isActive    = conv.id === activeId;
                const isRenaming  = conv.id === renamingId;

                return (
                  <li key={conv.id}>

                    {/* -----------------------------------------
                        RENAME MODE — inline input
                    ----------------------------------------- */}

                    {isRenaming ? (
                      <div className="px-1 py-1">

                        <input
                          ref={renameInputRef}
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={handleRenameKeyDown}
                          disabled={renameSaving}
                          maxLength={256}
                          placeholder="Conversation name..."
                          className="
                            w-full rounded-md border border-cyan-500/50
                            bg-[#111c2e] px-2.5 py-1.5
                            text-xs text-white outline-none
                            placeholder:text-slate-600
                            focus:ring-1 focus:ring-cyan-500/30
                            disabled:opacity-50
                          "
                        />

                        {/* Error */}
                        {renameError && (
                          <p className="mt-1 px-1 text-[10px] text-red-400">
                            {renameError}
                          </p>
                        )}

                        {/* Save / Cancel buttons */}
                        <div className="mt-1.5 flex items-center justify-end gap-1">
                          <button
                            onClick={cancelRename}
                            disabled={renameSaving}
                            aria-label="Cancel rename"
                            className="
                              flex h-6 w-6 items-center justify-center
                              rounded-md text-slate-500
                              transition hover:bg-slate-700/60 hover:text-slate-300
                              disabled:opacity-40
                            "
                          >
                            <X size={12} strokeWidth={2.5} />
                          </button>

                          <button
                            onClick={commitRename}
                            disabled={renameSaving || !renameValue.trim()}
                            aria-label="Save rename"
                            className="
                              flex h-6 w-6 items-center justify-center
                              rounded-md text-slate-500
                              transition hover:bg-cyan-500/20 hover:text-cyan-400
                              disabled:opacity-40
                            "
                          >
                            {renameSaving ? (
                              <div className="h-3 w-3 animate-spin rounded-full border border-slate-600 border-t-cyan-400" />
                            ) : (
                              <Check size={12} strokeWidth={2.5} />
                            )}
                          </button>
                        </div>

                      </div>

                    ) : (

                    /* -----------------------------------------
                        NORMAL MODE — conversation button
                    ----------------------------------------- */

                      <button
                        onClick={() => selectConversation(conv.id)}
                        className={`
                          group relative flex w-full items-center gap-2.5
                          rounded-lg px-3 py-2.5 text-left text-sm
                          transition-all duration-150
                          ${isActive
                            ? "bg-cyan-500/[0.12] text-white"
                            : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"
                          }
                        `}
                      >
                        {/* Active indicator bar */}
                        {isActive && (
                          <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-cyan-400" />
                        )}

                        <MessageCircle
                          size={13}
                          className={`shrink-0 transition-colors ${
                            isActive
                              ? "text-cyan-400"
                              : "text-slate-600 group-hover:text-slate-500"
                          }`}
                        />

                        <span className="flex-1 truncate text-xs font-medium leading-snug">
                          {conversationLabel(conv)}
                        </span>

                        {/* Edit button — visible on hover (active) or hover (inactive) */}
                        {isActive && (
                          <span
                            role="button"
                            aria-label="Rename conversation"
                            onClick={(e) => startRename(conv, e)}
                            className="
                              ml-auto flex h-5 w-5 shrink-0 items-center justify-center
                              rounded opacity-0 text-slate-500
                              transition group-hover:opacity-100
                              hover:bg-slate-700/80 hover:text-cyan-400
                            "
                          >
                            <Pencil size={11} strokeWidth={2.2} />
                          </span>
                        )}

                      </button>

                    )}

                  </li>
                );
              })}
            </ul>

          )}

        </nav>

      </aside>


      {/* =======================================================
          CHAT AREA
      ======================================================= */}

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* ---------------------------------------------------
            CHAT HEADER
        --------------------------------------------------- */}

        <div className="flex items-center gap-3 border-b border-slate-800/50 bg-[#050816]/80 px-5 py-3 backdrop-blur-sm">

          {/* AI avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-md shadow-cyan-500/20">
            <Compass size={15} className="text-white" strokeWidth={2.3} />
          </div>

          <div className="min-w-0 flex-1">
            {/* Conversation title — primary label */}
            <h1 className="truncate text-sm font-semibold text-white">
              {activeId !== null
                ? conversationLabel(
                    conversations.find((c) => c.id === activeId) ?? {
                      id: activeId,
                      title: null,
                      created_at: "",
                    }
                  )
                : "KelanaAI Chat"}
            </h1>

            <p className="text-[11px] text-slate-500">
              Memory powered by Amazon Bedrock
            </p>
          </div>

          {/* Status dot */}
          <div className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full shadow-sm ${
                sending
                  ? "animate-pulse bg-amber-400 shadow-amber-400/50"
                  : "bg-emerald-400 shadow-emerald-400/50"
              }`}
            />
            <span className="text-xs text-slate-600">
              {sending ? "Typing..." : "Online"}
            </span>
          </div>

        </div>


        {/* ---------------------------------------------------
            MESSAGE LIST
        --------------------------------------------------- */}

        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto custom-scrollbar">

          <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">

            {/* ---------------------------------------------
                LOADING MESSAGES
            --------------------------------------------- */}

            {msgLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
                <p className="mt-3 text-xs">Loading messages...</p>
              </div>
            )}


            {/* ---------------------------------------------
                EMPTY STATE
            --------------------------------------------- */}

            {!msgLoading && messages.length === 0 && (
              <div className="flex flex-col items-center py-16 text-center">

                {/* Icon */}
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 ring-1 ring-cyan-500/20">
                  <Compass size={28} className="text-cyan-400" strokeWidth={1.8} />
                </div>

                <h2 className="text-lg font-semibold text-white">
                  How can I help plan your trip?
                </h2>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Ask me anything about destinations, itineraries, budgets, or travel ideas.
                  I remember our full conversation.
                </p>

                {/* Suggestion chips */}
                <div className="mt-7 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => doSend(suggestion)}
                      disabled={sending}
                      className="
                        flex items-center gap-1.5
                        rounded-full border border-slate-700/80
                        bg-slate-800/50 px-3.5 py-1.5
                        text-xs font-medium text-slate-400
                        transition
                        hover:border-cyan-500/50 hover:bg-cyan-500/8 hover:text-cyan-300
                        disabled:opacity-40
                      "
                    >
                      <Sparkles size={11} className="text-cyan-500" />
                      {suggestion}
                    </button>
                  ))}
                </div>

              </div>
            )}


            {/* ---------------------------------------------
                MESSAGES
            --------------------------------------------- */}

            {!msgLoading && (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >

                    {/* Avatar */}
                    {msg.role === "assistant" ? (
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow shadow-cyan-500/20">
                        <Compass size={13} className="text-white" strokeWidth={2.3} />
                      </div>
                    ) : (
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-[10px] font-bold text-slate-300">
                        You
                      </div>
                    )}

                    {/* Bubble + timestamp */}
                    <div
                      className={`flex max-w-[78%] flex-col gap-1 ${
                        msg.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`
                          rounded-2xl px-4 py-3
                          ${msg.role === "user"
                            ? "rounded-tr-sm bg-gradient-to-br from-cyan-500 to-cyan-600 text-slate-950 shadow-md shadow-cyan-900/30"
                            : "rounded-tl-sm border border-slate-700/60 bg-[#0d1a2d] text-slate-200 shadow-sm"
                          }
                        `}
                      >
                        {msg.role === "assistant" ? (
                          <div className="markdown-content prose-sm">
                            <ReactMarkdown>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed">
                            {msg.content}
                          </p>
                        )}
                      </div>

                      {/* Timestamp */}
                      {msg.timestamp && (
                        <span className="px-1 text-[10px] text-slate-600">
                          {msg.timestamp}
                        </span>
                      )}
                    </div>

                  </div>
                ))}


                {/* -------------------------------------------
                    TYPING INDICATOR
                ------------------------------------------- */}

                {sending && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow shadow-cyan-500/20">
                      <Compass size={13} className="text-white" strokeWidth={2.3} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="rounded-2xl rounded-tl-sm border border-slate-700/60 bg-[#0d1a2d] px-4 py-3.5 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:0ms]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:160ms]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:320ms]" />
                          </div>
                          <span className="text-xs text-slate-500">
                            KelanaAI is typing...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {/* -------------------------------------------
                    SEND ERROR
                ------------------------------------------- */}

                {sendError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3 text-center text-sm text-red-400">
                    {sendError}
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={bottomRef} />

              </div>
            )}

          </div>
        </div>


        {/* ---------------------------------------------------
            COMPOSER
        --------------------------------------------------- */}

        <div className="border-t border-slate-800/50 bg-[#07101f]/80 px-4 py-3.5 backdrop-blur-sm sm:px-6">
          <form
            onSubmit={handleSend}
            className="mx-auto flex max-w-3xl items-end gap-3"
          >

            {/* Input container */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your travel plans..."
                autoComplete="off"
                disabled={sending || msgLoading}
                className="
                  w-full rounded-2xl border border-slate-700/60
                  bg-[#111c2e] py-3 pl-4 pr-12
                  text-sm text-white shadow-inner
                  outline-none placeholder:text-slate-600
                  transition
                  focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10
                  disabled:opacity-50
                "
              />
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={sending || msgLoading || !input.trim()}
              aria-label="Send message"
              className="
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl bg-cyan-500 text-slate-950
                shadow-md shadow-cyan-500/25
                transition
                hover:bg-cyan-400 hover:shadow-cyan-400/30
                active:scale-95
                disabled:cursor-not-allowed disabled:opacity-35
                disabled:shadow-none
              "
            >
              <Send size={16} strokeWidth={2.3} />
            </button>

          </form>

          {/* Hint */}
          <p className="mx-auto mt-1.5 max-w-3xl text-center text-[11px] text-slate-700">
            KelanaAI remembers your full conversation history
          </p>

        </div>

      </div>

    </div>
  );
}
