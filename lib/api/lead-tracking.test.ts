import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The wiring, not the helpers.
 *
 * `lead.test.ts` proves the payload is shaped right. This proves the thing
 * that actually broke before: that submitting an enquiry calls the tracker
 * at all. Every form on the site goes through these two functions, so a
 * regression here silently stops travel leads reaching the CRM again —
 * with no error anywhere, because tracking failures are swallowed by
 * design.
 */

const track = vi.fn();
const apiFetch = vi.fn();

vi.mock("@/lib/analytics", () => ({ track: (...args: unknown[]) => track(...args) }));
vi.mock("./client", () => ({
  apiFetch: (...args: unknown[]) => apiFetch(...args),
  session: { get: () => null, set: () => {}, clear: () => {} },
}));

const { createEnquiry, createPackageRequest } = await import("./endpoints");

beforeEach(() => {
  track.mockReset();
  apiFetch.mockReset().mockResolvedValue({ id: "e1" });
});

describe("createEnquiry", () => {
  it("reports the lead, with the traits the CRM identifies people by", async () => {
    await createEnquiry({ full_name: "Asha Rao", phone: "+919812345678", form: "home-hero" });

    expect(track).toHaveBeenCalledTimes(1);
    const [name, props, opts] = track.mock.calls[0];
    expect(name).toBe("travel_lead_submitted");
    expect(props).toEqual({ form: "home-hero" });
    expect(opts).toEqual({
      traits: { name: "Asha Rao", phone: "+919812345678" },
      urgent: true,
    });
  });

  it("still returns what the caller asked for", async () => {
    apiFetch.mockResolvedValue({ id: "abc" });
    await expect(
      createEnquiry({ full_name: "Asha", phone: "98" }),
    ).resolves.toEqual({ id: "abc" });
  });

  it("does not report a lead when the submission failed", async () => {
    // Nothing was saved, so there is nobody to follow up.
    apiFetch.mockRejectedValue(new Error("500"));
    await expect(createEnquiry({ full_name: "Asha", phone: "98" })).rejects.toThrow();
    expect(track).not.toHaveBeenCalled();
  });

  it("does not report a lead nobody can be identified from", async () => {
    await createEnquiry({ form: "home-hero" });
    expect(track).not.toHaveBeenCalled();
  });

  it("never lets a tracking failure break the submission", async () => {
    track.mockImplementation(() => {
      throw new Error("tracker exploded");
    });
    await expect(
      createEnquiry({ full_name: "Asha", phone: "98" }),
    ).resolves.toEqual({ id: "e1" });
  });
});

describe("createPackageRequest", () => {
  it("reports the lead too — it is the other form that collects one", async () => {
    apiFetch.mockResolvedValue({ request: {}, matches: [] });
    await createPackageRequest({
      full_name: "Asha Rao",
      phone: "98",
      destination: "Kashmir",
    });

    expect(track).toHaveBeenCalledTimes(1);
    const [name, props] = track.mock.calls[0];
    expect(name).toBe("travel_lead_submitted");
    expect(props).toEqual({ destination: "Kashmir" });
  });
});
