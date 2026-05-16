"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Download, Plus, RotateCcw, Trash2, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface Card {
  id: string;
  front: string;
  back: string;
}

interface Deck {
  id: string;
  name: string;
  cards: Card[];
}

const STORAGE_KEY = "ua-flashcards-v1";

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function loadDecks(): Deck[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Deck[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FlashcardMaker() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [mode, setMode] = useState<"edit" | "study">("edit");
  const [newDeckName, setNewDeckName] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  // Study mode state.
  const [studyIndex, setStudyIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stillLearning, setStillLearning] = useState<string[]>([]);

  useEffect(() => {
    const loaded = loadDecks();
    setDecks(loaded);
    if (loaded.length > 0) setActiveDeckId(loaded[0].id);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  }, [decks]);

  const activeDeck = useMemo(
    () => decks.find((d) => d.id === activeDeckId) ?? null,
    [decks, activeDeckId]
  );

  const createDeck = () => {
    const name = newDeckName.trim();
    if (!name) return;
    const deck: Deck = { id: uid(), name, cards: [] };
    setDecks((prev) => [...prev, deck]);
    setActiveDeckId(deck.id);
    setNewDeckName("");
  };

  const deleteDeck = (id: string) => {
    if (!window.confirm("Delete this deck and all its cards?")) return;
    setDecks((prev) => {
      const next = prev.filter((d) => d.id !== id);
      if (activeDeckId === id) setActiveDeckId(next[0]?.id ?? null);
      return next;
    });
  };

  const addCard = () => {
    if (!activeDeck || !front.trim() || !back.trim()) return;
    setDecks((prev) =>
      prev.map((d) =>
        d.id === activeDeck.id
          ? { ...d, cards: [...d.cards, { id: uid(), front: front.trim(), back: back.trim() }] }
          : d
      )
    );
    setFront("");
    setBack("");
  };

  const removeCard = (cardId: string) => {
    if (!activeDeck) return;
    setDecks((prev) =>
      prev.map((d) => (d.id === activeDeck.id ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) } : d))
    );
  };

  const startStudy = () => {
    if (!activeDeck || activeDeck.cards.length === 0) return;
    setMode("study");
    setStudyIndex(0);
    setFlipped(false);
    setStillLearning([]);
  };

  const exportDeck = () => {
    if (!activeDeck) return;
    const blob = new Blob([JSON.stringify(activeDeck, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDeck.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDeck = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Deck;
        if (!parsed.name || !Array.isArray(parsed.cards)) throw new Error("bad");
        const deck: Deck = {
          id: uid(),
          name: parsed.name,
          cards: parsed.cards.map((c) => ({ id: uid(), front: String(c.front), back: String(c.back) })),
        };
        setDecks((prev) => [...prev, deck]);
        setActiveDeckId(deck.id);
      } catch {
        window.alert("That file isn't a valid flashcard deck export.");
      }
    };
    reader.readAsText(file);
  };

  // ─── Study mode ──────────────────────────────────────────────────────────
  if (mode === "study" && activeDeck && activeDeck.cards.length > 0) {
    const card = activeDeck.cards[studyIndex];
    const isLast = studyIndex === activeDeck.cards.length - 1;

    const next = () => {
      setFlipped(false);
      if (!isLast) setStudyIndex((i) => i + 1);
    };
    const prev = () => {
      setFlipped(false);
      if (studyIndex > 0) setStudyIndex((i) => i - 1);
    };
    const mark = (learning: boolean) => {
      setStillLearning((prev) =>
        learning ? [...new Set([...prev, card.id])] : prev.filter((id) => id !== card.id)
      );
      next();
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-surface-900 dark:text-white">{activeDeck.name}</p>
          <button
            type="button"
            onClick={() => setMode("edit")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-surface-500 hover:text-primary-700 dark:text-surface-400 dark:hover:text-primary-300"
          >
            <X className="h-3.5 w-3.5" />
            Exit study mode
          </button>
        </div>

        <p className="text-center text-xs text-surface-500 dark:text-surface-400">
          Card {studyIndex + 1} of {activeDeck.cards.length} · {stillLearning.length} still learning
        </p>

        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className={cn(
            "flex min-h-56 w-full items-center justify-center rounded-2xl border-2 p-8 text-center text-xl font-semibold shadow-lg transition",
            flipped
              ? "border-success-400 bg-success-50 text-surface-900 dark:border-success-500/60 dark:bg-success-500/10 dark:text-white"
              : "border-primary-400 bg-gradient-to-br from-primary-50 to-white text-surface-900 dark:border-primary-500/60 dark:from-primary-500/10 dark:to-surface-900 dark:text-white"
          )}
        >
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              {flipped ? "Answer" : "Question"} — click to flip
            </p>
            {flipped ? card.back : card.front}
          </div>
        </button>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={studyIndex === 0}
            className="inline-flex items-center gap-1 rounded-xl border border-surface-300 px-4 py-2 text-sm font-semibold text-surface-700 transition hover:border-primary-300 disabled:opacity-40 dark:border-surface-700 dark:text-surface-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Prev
          </button>
          <button
            type="button"
            onClick={() => mark(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-warning-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-warning-600"
          >
            Still learning
          </button>
          <button
            type="button"
            onClick={() => mark(false)}
            className="inline-flex items-center gap-2 rounded-xl bg-success-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-success-700"
          >
            <Check className="h-4 w-4" />
            Known
          </button>
          <button
            type="button"
            onClick={next}
            disabled={isLast}
            className="inline-flex items-center gap-1 rounded-xl border border-surface-300 px-4 py-2 text-sm font-semibold text-surface-700 transition hover:border-primary-300 disabled:opacity-40 dark:border-surface-700 dark:text-surface-200"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {isLast && (
          <button
            type="button"
            onClick={() => {
              setStudyIndex(0);
              setFlipped(false);
            }}
            className="mx-auto flex items-center gap-2 rounded-xl border border-surface-300 px-4 py-2 text-sm font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200"
          >
            <RotateCcw className="h-4 w-4" />
            Restart deck
          </button>
        )}
      </div>
    );
  }

  // ─── Edit mode ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Decks
        </p>
        <div className="flex flex-wrap gap-2">
          {decks.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveDeckId(d.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                activeDeckId === d.id
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-500/10 dark:text-primary-200"
                  : "border-surface-200 text-surface-700 hover:border-primary-300 dark:border-surface-700 dark:text-surface-200"
              )}
            >
              {d.name} ({d.cards.length})
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createDeck();
          }}
          className="mt-3 flex flex-col gap-2 sm:flex-row"
        >
          <input
            type="text"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            placeholder="New deck name"
            className="flex-1 rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            New deck
          </button>
          <label className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-surface-300 px-3 py-2 text-sm font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200">
            <Upload className="h-4 w-4" />
            Import
            <input
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importDeck(f);
                e.target.value = "";
              }}
            />
          </label>
        </form>
      </div>

      {activeDeck ? (
        <>
          <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-surface-900 dark:text-white">{activeDeck.name}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={exportDeck}
                  className="inline-flex items-center gap-1 rounded-lg border border-surface-300 px-2.5 py-1 text-xs font-semibold text-surface-700 hover:border-primary-300 dark:border-surface-700 dark:text-surface-200"
                >
                  <Download className="h-3 w-3" />
                  Export
                </button>
                <button
                  type="button"
                  onClick={() => deleteDeck(activeDeck.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-surface-300 px-2.5 py-1 text-xs font-semibold text-surface-500 hover:border-error-300 hover:text-error-600 dark:border-surface-700 dark:text-surface-400 dark:hover:text-error-400"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete deck
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <textarea
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Front (question)"
                rows={3}
                className="resize-y rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500"
              />
              <textarea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Back (answer)"
                rows={3}
                className="resize-y rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500"
              />
            </div>
            <button
              type="button"
              onClick={addCard}
              disabled={!front.trim() || !back.trim()}
              className="mt-3 inline-flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add card
            </button>

            {activeDeck.cards.length > 0 && (
              <ul className="mt-4 space-y-2">
                {activeDeck.cards.map((c, i) => (
                  <li
                    key={c.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-800"
                  >
                    <span className="text-surface-500 dark:text-surface-400">{i + 1}.</span>
                    <span className="flex-1 text-surface-900 dark:text-white">
                      <strong>{c.front}</strong>
                      <span className="text-surface-500 dark:text-surface-400"> → {c.back}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCard(c.id)}
                      className="text-surface-400 transition hover:text-error-600 dark:hover:text-error-400"
                      aria-label="Remove card"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border-2 border-primary-400 bg-gradient-to-br from-primary-50 to-white p-5 dark:border-primary-500/60 dark:from-primary-500/10 dark:to-surface-900">
            <button
              type="button"
              onClick={startStudy}
              disabled={activeDeck.cards.length === 0}
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:hover:scale-100"
            >
              Study {activeDeck.cards.length} card{activeDeck.cards.length === 1 ? "" : "s"}
            </button>
          </div>
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-surface-300 p-8 text-center text-sm text-surface-500 dark:border-surface-700 dark:text-surface-400">
          Create your first deck above to start adding flashcards.
        </p>
      )}
    </div>
  );
}
