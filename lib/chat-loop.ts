/**
 * The state machine behind the looping Travel Mitr conversation.
 *
 * The exchange on the home page plays itself: a message is typed, sent,
 * then the next one, and once the conversation is finished it holds and
 * starts again. "Real-time assistance" is a claim; watching someone book
 * wheelchair help is the proof, and a still screenshot of two messages
 * does not read as a conversation at all.
 *
 * Kept out of the component because the timing is the whole behaviour,
 * and a loop that can run away or overrun its script is exactly the kind
 * of bug that only shows up on someone else's machine.
 */

export type ChatPhase =
  /** Dots showing, the next message is being written. */
  | "typing"
  /** The message has landed. */
  | "sent"
  /** The whole conversation is on screen, before it restarts. */
  | "hold";

export type ChatState = {
  /** How many messages of the script are on screen. */
  shown: number;
  phase: ChatPhase;
};

export const CHAT_START: ChatState = { shown: 0, phase: "typing" };

/** How long the current phase stays on screen, in milliseconds. */
export function chatDelay(state: ChatState): number {
  switch (state.phase) {
    case "typing":
      return 900;
    case "sent":
      return 1600;
    case "hold":
      // Long enough to read the last reply before it all resets.
      return 3800;
  }
}

/** The next step of the loop. */
export function advanceChat(state: ChatState, total: number): ChatState {
  // Nothing scripted: stay put rather than typing a message that will
  // never arrive.
  if (total <= 0) return CHAT_START;

  switch (state.phase) {
    case "typing":
      return { shown: Math.min(state.shown + 1, total), phase: "sent" };
    case "sent":
      return state.shown >= total
        ? { shown: total, phase: "hold" }
        : { shown: state.shown, phase: "typing" };
    case "hold":
      return CHAT_START;
  }
}
