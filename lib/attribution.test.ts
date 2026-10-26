import { afterEach, describe, expect, it } from "vitest";

import {
  boundedAttribution,
  captureUtmFromUrl,
  getAttribution,
  getStoredUtm,
} from "./attribution";

function installBrowser(opts: { search?: string; cookie?: string } = {}) {
  const store = new Map<string, string>();
  (globalThis as Record<string, unknown>).window = {
    location: { search: opts.search ?? "", hostname: "rahgeer.in" },
  };
  (globalThis as Record<string, unknown>).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  };
  (globalThis as Record<string, unknown>).document = { cookie: opts.cookie ?? "" };
  return store;
}

afterEach(() => {
  for (const key of ["window", "localStorage", "document"]) {
    delete (globalThis as Record<string, unknown>)[key];
  }
});

describe("the Meta click ids ride along with the enquiry", () => {
  // This is what lets the server tell Meta, hours later, which ad produced a
  // lead — the browser's own Lead event is blocked for roughly a third of
  // visitors, and the server's copy is the one that always arrives.
  it("sends _fbc and _fbp when Meta has set them", () => {
    installBrowser({
      search: "?utm_source=GPAY_ECOM",
      cookie: "_fbc=fb.1.1700000000000.IwAR_abc; _fbp=fb.1.1699000000000.1234567890",
    });
    const out = getAttribution();
    expect(out.fbc).toBe("fb.1.1700000000000.IwAR_abc");
    expect(out.fbp).toBe("fb.1.1699000000000.1234567890");
    expect(out.utm_source).toBe("GPAY_ECOM");
  });

  it("omits them entirely for an organic visitor", () => {
    installBrowser({ search: "?utm_source=newsletter" });
    const out = getAttribution();
    expect(out).not.toHaveProperty("fbc");
    expect(out).not.toHaveProperty("fbp");
  });

  it("still works when cookies throw", () => {
    installBrowser({ search: "?utm_source=newsletter" });
    Object.defineProperty(globalThis.document, "cookie", {
      get() {
        throw new Error("blocked");
      },
    });
    expect(() => getAttribution()).not.toThrow();
    expect(getAttribution().utm_source).toBe("newsletter");
  });
});

describe("what gets dropped when a link carries too much", () => {
  // The backend rejects the whole enquiry past its key cap — a lost lead. So
  // the decision of WHAT to drop belongs here, not to a 400.
  it("keeps the click ids and the named UTMs ahead of custom keys", () => {
    const identity = { fbc: "fb.1.1.abc", fbp: "fb.1.2.def", source: "promoter7" };
    const utm: Record<string, string> = {
      utm_source: "meta",
      utm_medium: "cpc",
      utm_campaign: "travel_oct",
      utm_content: "carousel",
      utm_term: "kashmir",
    };
    for (let i = 0; i < 10; i++) utm[`utm_custom_${i}`] = String(i);

    const out = boundedAttribution(identity, utm);
    expect(Object.keys(out)).toHaveLength(15);
    expect(out.fbc).toBe("fb.1.1.abc");
    expect(out.fbp).toBe("fb.1.2.def");
    expect(out.source).toBe("promoter7");
    expect(out.utm_source).toBe("meta");
    expect(out.utm_term).toBe("kashmir");
    // Something had to go, and a custom key is what goes.
    expect(out).not.toHaveProperty("utm_custom_9");
  });

  it("changes nothing about an ordinary link", () => {
    const out = boundedAttribution(
      { fbc: "fb.1.1.abc" },
      { utm_source: "meta", utm_campaign: "travel_oct" },
    );
    expect(out).toEqual({
      fbc: "fb.1.1.abc",
      utm_source: "meta",
      utm_campaign: "travel_oct",
    });
  });

  it("puts the named UTMs in reporting order, not arrival order", () => {
    const out = boundedAttribution({}, { utm_term: "x", utm_source: "meta" });
    expect(Object.keys(out)).toEqual(["utm_source", "utm_term"]);
  });
});

describe("the existing 72h first-touch behaviour still holds", () => {
  it("remembers a campaign across a later page with no utm in the URL", () => {
    installBrowser({ search: "?utm_source=meta&utm_campaign=travel_oct" });
    captureUtmFromUrl();
    expect(getStoredUtm().utm_source).toBe("meta");
  });

  it("does not let a plain visit clobber a stored campaign", () => {
    const store = installBrowser({ search: "?utm_source=meta" });
    captureUtmFromUrl();
    (globalThis as { window: { location: { search: string } } }).window.location.search = "";
    captureUtmFromUrl();
    expect(getStoredUtm().utm_source).toBe("meta");
    expect(store.size).toBe(1);
  });
});
