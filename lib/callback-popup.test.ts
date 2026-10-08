import { describe, expect, it } from "vitest";
import {
  isCallbackEligible,
  markCallbackShown,
  wasCallbackShown,
} from "./callback-popup";

/** A stand-in for sessionStorage: a Map with the same two methods. */
function fakeStorage(seed: Record<string, string> = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
  };
}

describe("isCallbackEligible", () => {
  it("offers the callback on any page the visitor lands on", () => {
    for (const path of ["/", "/packages/kashmir", "/destinations/japan", "/plan/ai", "/travel-mitr"]) {
      expect(isCallbackEligible(path)).toBe(true);
    }
  });

  it("stays off the enquiry page, which is nothing but the lead form already", () => {
    expect(isCallbackEligible("/enquiry")).toBe(false);
    expect(isCallbackEligible("/enquiry/thanks")).toBe(false);
  });
});

describe("once per session", () => {
  it("has not been shown in a fresh session", () => {
    expect(wasCallbackShown(fakeStorage())).toBe(false);
  });

  it("is remembered the moment it is shown, whatever happens to it afterwards", () => {
    // Dismissing, submitting, or just navigating away must all count: the
    // visitor saw it once, and that is the promise.
    const storage = fakeStorage();
    markCallbackShown(storage);
    expect(wasCallbackShown(storage)).toBe(true);
  });

  it("treats a storage that throws as never shown, rather than crashing the page", () => {
    // Private windows and blocked site data throw on access. The popup is
    // decoration; it must never take the page down.
    const broken = {
      getItem: () => { throw new Error("blocked"); },
      setItem: () => { throw new Error("blocked"); },
    };
    expect(wasCallbackShown(broken)).toBe(false);
    expect(() => markCallbackShown(broken)).not.toThrow();
  });

  it("ignores a value written by some other feature under a different key", () => {
    expect(wasCallbackShown(fakeStorage({ marzi_callback_popup_submitted: "1" }))).toBe(false);
  });
});
