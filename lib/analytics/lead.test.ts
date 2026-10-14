import { describe, expect, it } from "vitest";
import { LEAD_EVENT, leadProps, leadTraits } from "./lead";

describe("LEAD_EVENT", () => {
  it("ends in lead_submitted so the dashboard reads a stage from it", () => {
    // The admin matches journey stages by suffix; a name it has no rule
    // for leaves the person with no stage, which is the bug this fixes.
    expect(LEAD_EVENT.endsWith("lead_submitted")).toBe(true);
  });
});

describe("leadTraits", () => {
  it("carries the name and phone the CRM identifies people by", () => {
    expect(leadTraits({ full_name: "Asha Rao", phone: "+919812345678" })).toEqual({
      name: "Asha Rao",
      phone: "+919812345678",
    });
  });

  it("reads either field name the forms use", () => {
    expect(leadTraits({ name: "Asha Rao", phone: "9812345678" })?.name).toBe("Asha Rao");
  });

  it("includes the email when there is one", () => {
    expect(leadTraits({ name: "Asha", phone: "98", email: "a@b.com" })?.email).toBe("a@b.com");
  });

  it("trims what people type", () => {
    expect(leadTraits({ name: "  Asha Rao  ", phone: " 98 " })).toEqual({
      name: "Asha Rao",
      phone: "98",
    });
  });

  it("identifies on a phone alone", () => {
    expect(leadTraits({ phone: "9812345678" })).toEqual({ phone: "9812345678" });
  });

  it("is null when nothing identifies them", () => {
    // A nameless row in the leads list is worse than the anonymous
    // visitor it would replace.
    expect(leadTraits({})).toBeNull();
    expect(leadTraits({ name: "   ", phone: "" })).toBeNull();
    expect(leadTraits({ email: "a@b.com" })).toBeNull();
  });

  it("ignores values that are not text", () => {
    expect(leadTraits({ name: 42, phone: null })).toBeNull();
  });
});

describe("leadProps", () => {
  it("records which form converted and what they asked about", () => {
    expect(
      leadProps({ form: "home-hero", destination: "Kashmir", travel_month: "September" }),
    ).toEqual({ form: "home-hero", destination: "Kashmir", travel_month: "September" });
  });

  it("leaves out what was not filled in", () => {
    expect(leadProps({ form: "home-hero", destination: "" })).toEqual({ form: "home-hero" });
  });

  it("never carries the person's details into props", () => {
    // Those belong in traits; duplicating them here would scatter personal
    // data across every event's property bag.
    const props = leadProps({ form: "x", full_name: "Asha", phone: "98", email: "a@b.com" });
    expect(props).toEqual({ form: "x" });
  });
});
