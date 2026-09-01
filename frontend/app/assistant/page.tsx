"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, FileText } from "lucide-react";

import {
  askAssistant,
  AssistantSource,
} from "../../services/assistantService";

export default function AssistantPage() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<AssistantSource[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);

    try {
      const result = await askAssistant(
        question.trim()
      );

      // -------------------------------------------------------
      // DEBUG: Log sources yang diterima dari service
      // -------------------------------------------------------

      console.log("[page.tsx] result lengkap:", result);
      console.log("[page.tsx] result.sources:", result.sources);

      const receivedSources = result.sources || [];

      receivedSources.forEach((src, i) => {
        console.log(
          `[page.tsx] Source[${i}]`,
          "name:", src.name,
          "url:", src.url ?? "null",
          "href akan dirender:", src.url ? src.url.slice(0, 80) + "..." : "TIDAK ADA LINK"
        );
      });

      setAnswer(result.answer);
      setSources(receivedSources);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get answer from KelanaAI."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-4xl px-6 py-12">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-8">

          <p className="mb-2 text-sm font-medium text-cyan-400">
            TRAVEL ASSISTANT
          </p>

          <h1 className="text-4xl font-bold">
            Ask KelanaAI
          </h1>

          <p className="mt-3 text-slate-400">
            Powered by your trusted travel documents
          </p>

        </div>


        {/* =================================================
            QUESTION FORM
        ================================================= */}

        <form
          onSubmit={handleAsk}
          className="rounded-2xl border border-slate-700 bg-[#111827] p-5"
        >

          <label
            htmlFor="question"
            className="mb-3 block text-sm font-medium text-slate-300"
          >
            Your Question
          </label>

          <div className="flex gap-3">

            <input
              id="question"
              name="question"
              type="text"
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              placeholder="Can I bring medication into Japan?"
              autoComplete="off"
              className="flex-1 rounded-xl border border-slate-600 bg-[#0b1220] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Asking..."
                : "Ask →"}
            </button>

          </div>

        </form>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="mt-8 rounded-2xl border border-slate-700 bg-[#111827] p-6">

            <div className="flex items-center gap-3">

              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />

              <p className="text-sm text-slate-400">
                Searching the travel knowledge base...
              </p>

            </div>

          </div>
        )}


        {/* =================================================
            ANSWER
        ================================================= */}

        {answer && !loading && (
          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-700 bg-[#111827]">

            {/* ---------------------------------------------
                ANSWER HEADER
            --------------------------------------------- */}

            <div className="border-b border-slate-700 px-6 py-4">

              <p className="text-sm font-semibold text-cyan-400">
                ✦ AI ANSWER
              </p>

            </div>


            {/* ---------------------------------------------
                ANSWER CONTENT
            --------------------------------------------- */}

            <div className="px-6 py-6">

              <p className="whitespace-pre-line leading-7 text-slate-200">
                {answer}
              </p>

            </div>


            {/* ---------------------------------------------
                SOURCES
            --------------------------------------------- */}

            {sources.length > 0 && (
              <div className="border-t border-slate-700 bg-[#0b1220] px-6 py-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  SOURCES
                </p>

                <div className="mt-3 space-y-2">

                  {sources.map(
                    (source, index) => {

                      const sourceName =
                        source.name ||
                        "Travel knowledge document";

                      // DEBUG: log saat render
                      console.log(
                        `[page.tsx] render Source[${index}]`,
                        "name:", sourceName,
                        "url:", source.url ?? "null"
                      );

                      /*
                       * Kalau backend memberikan URL,
                       * source menjadi clickable link.
                       */
                      if (source.url) {
                        return (
                          <a
                            key={`${sourceName}-${index}`}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-3 transition hover:border-cyan-400/50 hover:bg-slate-800/80"
                          >

                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                              <FileText
                                size={16}
                              />
                            </span>

                            <span className="min-w-0 flex-1">

                              <span className="block truncate text-sm font-medium text-slate-300 transition group-hover:text-white">
                                {sourceName}
                              </span>

                              <span className="mt-0.5 block text-xs text-slate-500">
                                Open source document
                              </span>

                            </span>

                            <ExternalLink
                              size={15}
                              className="shrink-0 text-slate-500 transition group-hover:text-cyan-400"
                            />

                          </a>
                        );
                      }

                      /*
                       * Kalau URL tidak tersedia,
                       * source tetap ditampilkan tetapi
                       * tidak menjadi link.
                       */
                      return (
                        <div
                          key={`${sourceName}-${index}`}
                          className="flex items-center gap-3 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-3"
                        >

                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                            <FileText
                              size={16}
                            />
                          </span>

                          <span className="text-sm text-slate-300">
                            {sourceName}
                          </span>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>
            )}


            {/* ---------------------------------------------
                FALLBACK SOURCE
            --------------------------------------------- */}

            {sources.length === 0 && (
              <div className="border-t border-slate-700 bg-[#0b1220] px-6 py-4">

                <p className="text-xs uppercase tracking-wider text-slate-500">
                  SOURCE
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  Trusted travel knowledge base
                </p>

              </div>
            )}

          </section>
        )}


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!answer &&
          !loading &&
          !error && (
            <div className="mt-10 text-center">

              <p className="text-sm text-slate-500">
                Answers are grounded in your uploaded travel documents.
              </p>

            </div>
          )}

      </section>

    </main>
  );
}