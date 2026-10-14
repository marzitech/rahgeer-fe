import { describe, expect, it } from "vitest";
import {
  applyProgress,
  initialProgress,
  percentDone,
  type PlanProgress,
} from "./progress";
import type { ProgressEvent } from "./stream";

const run = (events: ProgressEvent[], expectedDays = 3): PlanProgress =>
  events.reduce(applyProgress, initialProgress(expectedDays));

const OUTLINE: ProgressEvent = {
  event: "outline",
  step: "Planning each day",
  outline: {
    title: "Kerala at an easy pace",
    summary: "Backwaters and beach.",
    days: [
      { day_number: 1, title: "Arrive in Kochi", highlights: ["Fort Kochi"] },
      { day_number: 2, title: "Backwaters", highlights: ["Vembanad Lake"] },
    ],
    hotels: ["Brunton Boatyard"],
  },
};

describe("applyProgress", () => {
  it("shows the expected days before anything is known", () => {
    const state = initialProgress(4);
    expect(state.days.map((d) => d.day_number)).toEqual([1, 2, 3, 4]);
    expect(state.days.every((d) => !d.title && !d.ready)).toBe(true);
  });

  it("fills titles while the route streams in", () => {
    const state = run([
      { event: "outlining", step: "Sketching your route" },
      { event: "route_progress", title: "Kerala at an easy pace" },
      {
        event: "route_progress",
        title: "Kerala at an easy pace",
        days: [{ day_number: 1, title: "Arrive in Kochi" }],
      },
    ]);
    expect(state.stage).toBe("routing");
    expect(state.title).toBe("Kerala at an easy pace");
    expect(state.days[0].title).toBe("Arrive in Kochi");
    expect(state.days[1].title).toBeUndefined();
  });

  it("lets the route decide the number of days", () => {
    const state = run([OUTLINE], 3);
    expect(state.days.map((d) => d.day_number)).toEqual([1, 2]);
    expect(state.hotels).toEqual(["Brunton Boatyard"]);
    expect(state.stage).toBe("days");
  });

  it("ticks days off in whatever order they finish, idempotently", () => {
    const ready: ProgressEvent = {
      event: "day_ready",
      day: 2,
      title: "Backwaters",
      blocks: ["Cruise"],
    };
    const state = run([OUTLINE, ready, ready]);
    expect(state.days.map((d) => d.ready)).toEqual([false, true]);
    expect(state.days[1].blocks).toEqual(["Cruise"]);
  });

  it("never moves backwards when replayed history arrives late", () => {
    const state = run([
      OUTLINE,
      { event: "finalising" },
      { event: "facts", step: "Checking weather" },
    ]);
    expect(state.stage).toBe("finalising");
  });

  it("starts over when the server retries the run", () => {
    const state = run([OUTLINE, { event: "started" }]);
    expect(state.title).toBeUndefined();
    expect(state.stage).toBe("researching");
  });
});

describe("percentDone", () => {
  it("only ever grows as the plan is built", () => {
    const steps: ProgressEvent[] = [
      { event: "started" },
      { event: "outlining" },
      { event: "route_progress", days: [{ day_number: 1, title: "A" }] },
      OUTLINE,
      { event: "day_ready", day: 1, title: "A" },
      { event: "dossier_ready" },
      { event: "day_ready", day: 2, title: "B" },
      { event: "finalising" },
    ];
    let state = initialProgress(2);
    let last = percentDone(state);
    for (const event of steps) {
      state = applyProgress(state, event);
      const now = percentDone(state);
      expect(now).toBeGreaterThanOrEqual(last);
      last = now;
    }
    expect(last).toBeLessThan(100);
  });
});
