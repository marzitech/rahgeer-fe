import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  __resetMetaPixelForTests,
  captureFbclid,
  ensureMetaPixel,
  firstThisSession,
  isPixelHostname,
  metaFunnel,
  normCity,
  normEmail,
  normName,
  normPhone,
  readMetaCookies,
  setMetaAdvancedMatching,
  trackMetaPixel,
} from "./meta-pixel";

/**
 * The module reads browser globals directly, deliberately: it is a verbatim
 * port of marzi-web-next's, and diverging its shape to suit a test is how the
 * two copies start drifting. So the browser is stubbed here instead.
 */
type Call = unknown[];

function installBrowser(opts: { hostname?: string; search?: string } = {}) {
  const calls: Call[] = [];
  const store = new Map<string, string>();
  let cookie = "";
  const fbq = (...args: unknown[]) => void calls.push(args);

  const win = {
    fbq,
    location: {
      hostname: opts.hostname ?? "rahgeer.in",
      search: opts.search ?? "",
    },
    sessionStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    },
  };
  const doc = {
    get cookie() {
      return cookie;
    },
    set cookie(value: string) {
      // Good enough for these tests: keep the name=value pair only.
      const [pair] = value.split(";");
      const [name] = pair.split("=");
      const kept = cookie
        .split("; ")
        .filter((c) => c && !c.startsWith(`${name}=`));
      cookie = [...kept, pair].join("; ");
    },
    querySelector: () => null,
    createElement: () => ({ setAttribute: () => {} }),
    head: { appendChild: () => {} },
  };

  (globalThis as Record<string, unknown>).window = win;
  (globalThis as Record<string, unknown>).document = doc;
  return { calls, setCookie: (raw: string) => void (cookie = raw) };
}

afterEach(() => {
  delete (globalThis as Record<string, unknown>).window;
  delete (globalThis as Record<string, unknown>).document;
  __resetMetaPixelForTests();
});

describe("the site gate", () => {
  it("fires on the live travel site only", () => {
    expect(isPixelHostname("rahgeer.in")).toBe(true);
    expect(isPixelHostname("www.rahgeer.in")).toBe(true);
  });

  it("never fires on localhost or a Vercel preview", () => {
    // Previews build with the production environment, so an env flag could
    // not tell them apart — the hostname is the only reliable signal.
    for (const host of [
      "localhost",
      "127.0.0.1",
      "rahgeer-fe-git-feat-x.vercel.app",
      "marzi.life",
    ]) {
      expect(isPixelHostname(host)).toBe(false);
    }
  });
});

describe("every travel event is separable inside the shared dataset", () => {
  // The dataset is shared with the community site (one pixel, two business
  // lines). content_category is the ONLY thing Events Manager can filter a
  // custom conversion on, so losing it silently merges travel leads into
  // meetup leads and trains the optimiser on the wrong funnel.
  beforeEach(() => installBrowser());

  it("tags ViewContent", () => {
    const { calls } = installBrowser();
    metaFunnel.viewContent({ id: "kashmir-5n", title: "Kashmir 5N", priceInr: 45000 });
    const [, event, params] = calls[0] as [string, string, Record<string, unknown>];
    expect(event).toBe("ViewContent");
    expect(params.content_category).toBe("travel");
  });

  it("tags Lead", () => {
    const { calls } = installBrowser();
    metaFunnel.lead({ source: "home-hero" });
    const [, event, params] = calls[0] as [string, string, Record<string, unknown>];
    expect(event).toBe("Lead");
    expect(params.content_category).toBe("travel");
    expect(params.lead_source).toBe("home-hero");
  });

  it("tags Contact", () => {
    const { calls } = installBrowser();
    metaFunnel.contact({ channel: "whatsapp", placement: "float" });
    const [, event, params] = calls[0] as [string, string, Record<string, unknown>];
    expect(event).toBe("Contact");
    expect(params.content_category).toBe("travel");
    expect(params.contact_channel).toBe("whatsapp");
  });
});

describe("money", () => {
  it("reports rupees, not paise", () => {
    // GANGADHAR's own event carries price_from_paise, one line above the Meta
    // call. Passing that same number here would report a ₹45,000 trip as
    // ₹45,00,000 and make every ROAS figure in the ad account wrong.
    const { calls } = installBrowser();
    metaFunnel.viewContent({ id: "kashmir-5n", priceInr: 45000 });
    const [, , params] = calls[0] as [string, string, Record<string, unknown>];
    expect(params.value).toBe(45000);
    expect(params.currency).toBe("INR");
  });

  it("omits value entirely when a package has no price", () => {
    // A zero would be a real "this trip is free" signal to the optimiser.
    const { calls } = installBrowser();
    metaFunnel.viewContent({ id: "custom-trip", priceInr: null });
    const [, , params] = calls[0] as [string, string, Record<string, unknown>];
    expect(params).not.toHaveProperty("value");
    expect(params).not.toHaveProperty("currency");
  });
});

describe("deduplication against the server's copy", () => {
  it("uses the caller's event id for a Lead", () => {
    // GANGADHAR mirrors the same lead through the Conversions API keyed on
    // the enquiry id. A fresh uuid here double-counts every travel lead.
    const { calls } = installBrowser();
    const enquiryId = "d9b1f0c2-0000-4000-8000-000000000001";
    metaFunnel.lead({ source: "home-hero", eventId: enquiryId });
    const [, , , opts] = calls[0] as [string, string, unknown, { eventID: string }];
    expect(opts.eventID).toBe(enquiryId);
  });

  it("still sends a Lead when the backend returned no id", () => {
    // Better a lead Meta might count twice than a lead it never hears about.
    const { calls } = installBrowser();
    metaFunnel.lead({ source: "home-hero", eventId: undefined });
    const [, , , opts] = calls[0] as [string, string, unknown, { eventID?: string }];
    expect(typeof opts.eventID).toBe("string");
  });
});

describe("once per subject per session", () => {
  it("counts one ViewContent however often the page is re-opened", () => {
    const { calls } = installBrowser();
    metaFunnel.viewContent({ id: "kashmir-5n" });
    metaFunnel.viewContent({ id: "kashmir-5n" });
    metaFunnel.viewContent({ id: "kashmir-5n" });
    expect(calls).toHaveLength(1);
  });

  it("counts a different package separately", () => {
    const { calls } = installBrowser();
    metaFunnel.viewContent({ id: "kashmir-5n" });
    metaFunnel.viewContent({ id: "kerala-6n" });
    expect(calls).toHaveLength(2);
  });

  it("fires rather than not at all when storage throws", () => {
    // Private windows throw on sessionStorage. Losing the throttle is a
    // counting error; losing the event is a missing conversion.
    installBrowser();
    const win = (globalThis as { window: { sessionStorage: unknown } }).window;
    win.sessionStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(firstThisSession("ViewContent", "kashmir-5n")).toBe(true);
    expect(firstThisSession("ViewContent", "kashmir-5n")).toBe(true);
  });
});

describe("health-content suppression", () => {
  // The dataset is shared with marzi.life. Meta restricts datasets that
  // receive health signals, so one "Wellness" package title from this site
  // can cost the community site its pixel.
  it("neutralises a health-sounding package title", () => {
    const { calls } = installBrowser();
    metaFunnel.viewContent({ id: "rishikesh-yoga", title: "Yoga & Wellness Retreat" });
    const [, , params] = calls[0] as [string, string, Record<string, unknown>];
    expect(params.content_name).toBe("Marzi Travel");
  });

  it("leaves an ordinary trip title alone", () => {
    const { calls } = installBrowser();
    metaFunnel.viewContent({ id: "kashmir-5n", title: "Kashmir in Spring" });
    const [, , params] = calls[0] as [string, string, Record<string, unknown>];
    expect(params.content_name).toBe("Kashmir in Spring");
  });
});

describe("trackMetaPixel refuses to send nonsense", () => {
  it("drops a blank event name", () => {
    // A blank name arrives in Events Manager as `__missing_event`.
    const { calls } = installBrowser();
    trackMetaPixel("   ", { a: 1 });
    expect(calls).toHaveLength(0);
  });

  it("is a no-op before the pixel has loaded", () => {
    installBrowser();
    delete (globalThis as { window: { fbq?: unknown } }).window.fbq;
    expect(() => trackMetaPixel("PageView")).not.toThrow();
  });
});

describe("the _fbc click cookie", () => {
  it("writes Meta's format when the URL carries an fbclid", () => {
    installBrowser({ search: "?fbclid=IwAR_abc123" });
    captureFbclid();
    const { fbc } = readMetaCookies();
    expect(fbc).toMatch(/^fb\.1\.\d+\.IwAR_abc123$/);
  });

  it("leaves an existing cookie for the same click untouched", () => {
    // Rewriting it would move Meta's timestamp forward and be read as a
    // second, later click on the same ad.
    const { setCookie } = installBrowser({ search: "?fbclid=IwAR_abc123" });
    setCookie("_fbc=fb.1.1700000000000.IwAR_abc123");
    captureFbclid();
    expect(readMetaCookies().fbc).toBe("fb.1.1700000000000.IwAR_abc123");
  });

  it("preserves the fbclid's case exactly", () => {
    installBrowser({ search: "?fbclid=IwAR_MiXeD_CaSe" });
    captureFbclid();
    expect(readMetaCookies().fbc).toContain("IwAR_MiXeD_CaSe");
  });

  it("reports no cookies rather than empty strings when none are set", () => {
    installBrowser();
    expect(readMetaCookies()).toEqual({});
  });

  it("does nothing at all without an fbclid anywhere", () => {
    installBrowser();
    captureFbclid();
    expect(readMetaCookies().fbc).toBeUndefined();
  });
});

describe("Advanced Matching normalisation", () => {
  // These rules decide what gets hashed. A phone normalised differently here
  // and on marzi.life hashes to two different people, so a customer who
  // visited both sites matches as neither.
  it("puts an Indian mobile into Meta's country-code form", () => {
    expect(normPhone("98765 43210")).toBe("919876543210");
    expect(normPhone("+91 98765-43210")).toBe("919876543210");
    expect(normPhone("098765 43210")).toBe("919876543210");
  });

  it("leaves an already-prefixed number alone", () => {
    expect(normPhone("919876543210")).toBe("919876543210");
  });

  it("returns undefined for nothing usable", () => {
    expect(normPhone("")).toBeUndefined();
    expect(normPhone("abc")).toBeUndefined();
    expect(normPhone(undefined)).toBeUndefined();
  });

  it("lowercases an email and rejects a non-address", () => {
    expect(normEmail("  Ravi@Example.COM ")).toBe("ravi@example.com");
    expect(normEmail("ravi")).toBeUndefined();
    expect(normEmail(null)).toBeUndefined();
  });

  it("strips punctuation and accents-adjacent noise from a name", () => {
    expect(normName("  Ravi   Kumar.  ")).toBe("ravi kumar");
    expect(normName("O'Brien")).toBe("obrien");
  });

  it("keeps the vowel marks in a Devanagari name", () => {
    // A matra is a combining MARK, not a letter, so a \p{L}-only filter
    // deletes it and hashes a name nobody has.
    expect(normName("रवि कुमार")).toBe("रवि कुमार");
  });

  it("reduces a city to bare letters", () => {
    expect(normCity(" New Delhi ")).toBe("newdelhi");
  });

  it("re-inits the pixel so the next event carries the details", () => {
    // Meta reads matching data at init only, so details learned at submit
    // time — which is the ONLY time this site learns a phone number — reach
    // it no other way.
    const { calls } = installBrowser();
    ensureMetaPixel();
    calls.length = 0;
    setMetaAdvancedMatching({ phone: "98765 43210", fullName: "Ravi Kumar" });
    const init = calls.find((c) => c[0] === "init");
    expect(init?.[2]).toMatchObject({
      ph: "919876543210",
      fn: "ravi",
      ln: "kumar",
      country: "in",
    });
  });

  it("holds details learned before the pixel loaded instead of losing them", () => {
    const { calls } = installBrowser();
    setMetaAdvancedMatching({ phone: "9876543210" });
    expect(calls).toHaveLength(0); // nothing to re-init yet
    ensureMetaPixel();
    const init = calls.find((c) => c[0] === "init");
    expect(init?.[2]).toMatchObject({ ph: "919876543210" });
  });
});
