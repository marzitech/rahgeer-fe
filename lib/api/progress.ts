/**
 * What the loading screen knows about a trip being planned, folded from the
 * SSE events in lib/api/stream.ts.
 *
 * Every event is applied idempotently (days are keyed by day number), so a
 * reconnect that replays the run's history lands on the same state.
 */

import type { ProgressEvent } from "./stream";

export type Stage =
  "starting" | "researching" | "routing" | "days" | "finalising";

export interface PlannedDay {
  day_number: number;
  title?: string;
  highlights?: string[];
  /** Block titles once the day has been written in full. */
  blocks?: string[];
  ready: boolean;
}

export interface PlanProgress {
  stage: Stage;
  step: string;
  title?: string;
  summary?: string;
  days: PlannedDay[];
  hotels: string[];
  dossierReady: boolean;
}

/** Days are known from the intake before the route exists, so the list can
 *  show its rows from the first second. */
export function initialProgress(expectedDays: number): PlanProgress {
  return {
    stage: "starting",
    step: "",
    days: Array.from({ length: Math.max(1, expectedDays) }, (_, i) => ({
      day_number: i + 1,
      ready: false,
    })),
    hotels: [],
    dossierReady: false,
  };
}

type DaySeed = { day_number: number; title?: string; highlights?: string[] };

/** Merge planned days in, keeping what later events already learned. The
 *  route decides the final count, so it may shrink or grow the list. */
function mergeDays(
  current: PlannedDay[],
  seeds: DaySeed[],
  authoritative: boolean,
): PlannedDay[] {
  const byNumber = new Map(current.map((d) => [d.day_number, d]));
  for (const seed of seeds) {
    const existing = byNumber.get(seed.day_number);
    byNumber.set(seed.day_number, {
      ready: false,
      ...existing,
      day_number: seed.day_number,
      title: seed.title ?? existing?.title,
      highlights: seed.highlights ?? existing?.highlights,
    });
  }
  let days = [...byNumber.values()].sort((a, b) => a.day_number - b.day_number);
  if (authoritative) {
    const planned = new Set(seeds.map((s) => s.day_number));
    days = days.filter((d) => planned.has(d.day_number));
  }
  return days;
}

const STAGE_OF: Partial<Record<ProgressEvent["event"], Stage>> = {
  started: "researching",
  retrieved: "researching",
  facts: "researching",
  outlining: "routing",
  route_progress: "routing",
  outline: "days",
  day_ready: "days",
  dossier_ready: "days",
  finalising: "finalising",
};

const ORDER: Stage[] = [
  "starting",
  "researching",
  "routing",
  "days",
  "finalising",
];

export function applyProgress(
  state: PlanProgress,
  event: ProgressEvent,
): PlanProgress {
  const next: PlanProgress = { ...state };
  const stage = STAGE_OF[event.event];
  // Replayed history can arrive after live events; never move backwards.
  if (stage && ORDER.indexOf(stage) > ORDER.indexOf(state.stage))
    next.stage = stage;
  if (typeof event.step === "string") next.step = event.step;

  switch (event.event) {
    case "started":
      // A server-side retry starts the story over.
      if (state.stage !== "starting")
        return { ...initialProgress(state.days.length), stage: "researching" };
      return next;
    case "route_progress": {
      if (typeof event.title === "string") next.title = event.title;
      if (typeof event.summary === "string") next.summary = event.summary;
      if (Array.isArray(event.days))
        next.days = mergeDays(state.days, event.days as DaySeed[], false);
      return next;
    }
    case "outline": {
      const outline = event.outline as
        | { title: string; summary: string; days: DaySeed[]; hotels?: string[] }
        | undefined;
      if (!outline) return next;
      next.title = outline.title;
      next.summary = outline.summary;
      next.days = mergeDays(state.days, outline.days, true);
      next.hotels = outline.hotels ?? [];
      return next;
    }
    case "day_ready": {
      const dayNumber = Number(event.day);
      next.days = mergeDays(
        state.days,
        [{ day_number: dayNumber, title: event.title as string }],
        false,
      ).map((d) =>
        d.day_number === dayNumber
          ? { ...d, ready: true, blocks: event.blocks as string[] }
          : d,
      );
      return next;
    }
    case "dossier_ready":
      next.dossierReady = true;
      return next;
    default:
      return next;
  }
}

export type ProgressAction =
  ProgressEvent | { event: "reset"; expectedDays: number };

/** useReducer-shaped: a new generation resets, every SSE event applies. */
export function progressReducer(
  state: PlanProgress,
  action: ProgressAction,
): PlanProgress {
  return action.event === "reset"
    ? initialProgress(action.expectedDays)
    : applyProgress(state, action);
}

/** 0-100, from what has actually happened — never a timer pretending. */
export function percentDone(state: PlanProgress): number {
  const total = state.days.length || 1;
  switch (state.stage) {
    case "starting":
      return 3;
    case "researching":
      return 10;
    case "routing":
      return (
        14 + Math.round((26 * state.days.filter((d) => d.title).length) / total)
      );
    case "days": {
      const parts = total + 1; // every day, plus the budget & packing dossier
      const done =
        state.days.filter((d) => d.ready).length + (state.dossierReady ? 1 : 0);
      return 42 + Math.round((52 * done) / parts);
    }
    case "finalising":
      return 97;
  }
}
