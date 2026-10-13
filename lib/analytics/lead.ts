/**
 * Turning a submitted enquiry into a lead the CRM can see.
 *
 * Every travel enquiry already lands in rahgeer-be, is emailed to ops and
 * appended to the leads sheet. None of that reaches GANGADHAR, so the
 * person never appeared in the dashboard's Live Activity alongside leads
 * from the app and marzi-web — they were a nameless anonymous visitor who
 * happened to stop browsing.
 *
 * Two details make the difference between "an event fired" and "a lead
 * the dashboard understands":
 *
 * 1. The NAME must end in `lead_submitted`. The dashboard reads a journey
 *    stage off the event name by suffix, and anything it has no rule for
 *    leaves the person with no stage at all — which is how the site's
 *    existing `Callback_request_footer_travel_web` behaves today.
 * 2. The name and phone ride on the event as `traits`. `/v1/identify`
 *    needs a login, and an enquirer has none, so traits on the event are
 *    the only way a number reaches the CRM for someone who is not a user.
 */

export const LEAD_EVENT = "travel_lead_submitted";

type EnquiryLike = {
  full_name?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
};

const text = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

/**
 * What identifies this person, or null when nothing does.
 *
 * Null rather than an empty object on purpose: an event carrying blank
 * traits would add a nameless row to the leads list, which is worse than
 * the anonymous visitor it replaced.
 */
export function leadTraits(body: EnquiryLike): Record<string, string> | null {
  const name = text(body.full_name) || text(body.name);
  const phone = text(body.phone);
  const email = text(body.email);
  if (!name && !phone) return null;

  const traits: Record<string, string> = {};
  if (name) traits.name = name;
  if (phone) traits.phone = phone;
  if (email) traits.email = email;
  return traits;
}

/** What the lead came from, for the event's own properties. */
export function leadProps(body: Record<string, unknown>): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  for (const key of ["form", "destination", "travel_month", "pax", "budget", "source"]) {
    const value = text(body[key]);
    if (value) props[key] = value;
  }
  return props;
}
