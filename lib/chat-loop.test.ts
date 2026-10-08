import { describe, expect, it } from "vitest";
import { CHAT_START, advanceChat, chatDelay, type ChatState } from "./chat-loop";

/** Walk the loop and record what it does, so the shape of the cycle is visible. */
function walk(total: number, steps: number): string[] {
  let state = CHAT_START;
  const seen: string[] = [];
  for (let i = 0; i < steps; i++) {
    seen.push(`${state.phase}:${state.shown}`);
    state = advanceChat(state, total);
  }
  return seen;
}

describe("advanceChat", () => {
  it("types a message before sending it", () => {
    const typing: ChatState = { shown: 0, phase: "typing" };
    expect(advanceChat(typing, 4)).toEqual({ shown: 1, phase: "sent" });
  });

  it("goes back to typing while messages are left", () => {
    expect(advanceChat({ shown: 1, phase: "sent" }, 4)).toEqual({ shown: 1, phase: "typing" });
  });

  it("holds the finished conversation on screen before looping", () => {
    // Without the hold the last reply would vanish the instant it
    // arrived, which is the one message the section exists to show.
    expect(advanceChat({ shown: 4, phase: "sent" }, 4)).toEqual({ shown: 4, phase: "hold" });
  });

  it("starts over from empty after the hold", () => {
    expect(advanceChat({ shown: 4, phase: "hold" }, 4)).toEqual(CHAT_START);
  });

  it("runs a full cycle and comes back to where it started", () => {
    const cycle = walk(2, 7);
    expect(cycle).toEqual([
      "typing:0",
      "sent:1",
      "typing:1",
      "sent:2",
      "hold:2",
      "typing:0",
      "sent:1",
    ]);
  });

  it("never shows more messages than exist", () => {
    let state = CHAT_START;
    for (let i = 0; i < 200; i++) {
      state = advanceChat(state, 3);
      expect(state.shown).toBeLessThanOrEqual(3);
      expect(state.shown).toBeGreaterThanOrEqual(0);
    }
  });

  it("does not spin when there is nothing to show", () => {
    // An empty script must not leave the loop typing a message that
    // never arrives.
    expect(advanceChat(CHAT_START, 0)).toEqual(CHAT_START);
  });
});

describe("chatDelay", () => {
  it("pauses longest on the finished conversation", () => {
    expect(chatDelay({ shown: 4, phase: "hold" })).toBeGreaterThan(
      chatDelay({ shown: 1, phase: "sent" }),
    );
  });

  it("shows the typing dots only briefly", () => {
    expect(chatDelay({ shown: 0, phase: "typing" })).toBeLessThan(
      chatDelay({ shown: 1, phase: "sent" }),
    );
  });

  it("gives every phase a real delay, so the loop cannot busy-run", () => {
    for (const phase of ["typing", "sent", "hold"] as const) {
      expect(chatDelay({ shown: 1, phase })).toBeGreaterThan(250);
    }
  });
});
