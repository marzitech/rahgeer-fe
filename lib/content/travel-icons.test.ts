import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ICON_KEYS, iconSrc } from "./travel-icons";

/**
 * The dashboard stores an icon *key* and this site turns it into a file.
 * The way that breaks is quiet: a key gains a row but never gains an
 * SVG, so every tour showing it renders the fallback and looks subtly
 * wrong to the person who chose it. Nothing throws, so only a test that
 * goes to disk catches it.
 */

const PUBLIC_DIR = join(import.meta.dirname, "..", "..", "public");

describe("the icon a stored key resolves to", () => {
  it.each(ICON_KEYS)("%s ships the SVG it points at", (key) => {
    expect(existsSync(join(PUBLIC_DIR, iconSrc(key)))).toBe(true);
  });

  it("falls back rather than returning nothing for a key it has never heard of", () => {
    // Older rows, and anything typed straight into the API, can carry a
    // key this build does not know. A hole in the row reads as broken;
    // a sensible glyph does not.
    expect(existsSync(join(PUBLIC_DIR, iconSrc("not-an-icon")))).toBe(true);
  });

  it("offers every key the dashboard's picker can store", () => {
    // Kept in step with admin-v2 `src/lib/travel-icons.ts` by hand, so
    // the list is spelled out: a key quietly dropped from the map is the
    // failure this guards, and an assertion on its own length would not
    // notice a rename.
    expect([...ICON_KEYS].sort()).toEqual([
      "beverages",
      "clock",
      "coach",
      "doctor",
      "door",
      "flight",
      "guide",
      "hotel",
      "laundry",
      "meals",
      "sightseeing",
      "solo",
      "water",
    ]);
  });
});
