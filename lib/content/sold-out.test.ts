import { describe, expect, it } from "vitest";
import { isSoldOut, SOLD_OUT_SLUGS } from "./sold-out";

describe("isSoldOut", () => {
  it("flags the Vietnam package as sold out", () => {
    expect(SOLD_OUT_SLUGS).toContain("vietnam");
    expect(isSoldOut("vietnam")).toBe(true);
  });

  it("leaves every other package open for booking", () => {
    for (const slug of ["kashmir", "japan", "sri-lanka", "singapore", ""]) {
      expect(isSoldOut(slug)).toBe(false);
    }
  });

  it("is forgiving about slug casing and surrounding whitespace", () => {
    expect(isSoldOut("Vietnam")).toBe(true);
    expect(isSoldOut(" vietnam ")).toBe(true);
  });

  it("never throws on a missing slug", () => {
    expect(isSoldOut(undefined)).toBe(false);
    expect(isSoldOut(null)).toBe(false);
  });
});
