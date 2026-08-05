/**
 * Thin, typed wrappers over the backend endpoints.
 *
 * Full request/response shapes live in types/api.d.ts (generated from
 * rahgeer-be/openapi.yaml — regenerate with `npm run gen:api`). The
 * interfaces here are the hand-curated subset views actually consume;
 * extend as screens need more fields.
 */

import { apiFetch, session } from "./client";

// --- itineraries ------------------------------------------------------------

export interface ItineraryIntake {
  traveler_name: string;
  phone: string;
  email?: string;
  destination: string;
  country?: string;
  travel_month: number; // 1-12
  duration_nights: number;
  start_date?: string;
  departure_city: string;
  group_type: "solo" | "couple" | "family" | "friends";
  pax?: number; // ignored for solo/couple (server forces 1/2)
  food_preference?: "any" | "veg" | "non_veg" | "vegan";
  pace?: "relaxed" | "balanced" | "packed";
  walking_capacity?: "short" | "moderate" | "long";
  trip_type?: "sightseeing" | "adventure" | "relaxation";
  accommodation?: "hotel" | "resort" | "villa_homestay";
  interests?: string[];
  special_requests?: string;
}

export interface ItineraryBlock {
  time_of_day: "morning" | "afternoon" | "evening";
  title: string;
  description: string;
  estimated_cost_inr: number;
  citations: string[];
}

export interface ItineraryDay {
  day_number: number;
  date: string | null;
  title: string;
  blocks: ItineraryBlock[];
}

export interface Itinerary {
  id: string;
  ai_status: "pending" | "processing" | "success" | "failure";
  ai_output: {
    title: string;
    summary: string;
    total_estimated_cost_inr: number;
    travel_tips: string[];
  } | null;
  ai_error: string;
  days: ItineraryDay[];
  destination: string;
  travel_month: number;
  duration_nights: number;
  [key: string]: unknown;
}

export async function createItinerary(intake: ItineraryIntake) {
  const result = await apiFetch<{
    itinerary: { id: string };
    guest_session_id: string;
  }>("/api/v1/itineraries/", { method: "POST", body: intake });
  session.setGuestSessionId(result.guest_session_id); // persist for claim later
  return result;
}

export const getItinerary = (id: string) =>
  apiFetch<Itinerary>(`/api/v1/itineraries/${id}/`);

export const regenerateDay = (id: string, dayNumber: number, feedback = "") =>
  apiFetch<{ queued_day: number }>(
    `/api/v1/itineraries/${id}/days/${dayNumber}/regenerate/`,
    {
      method: "POST",
      body: { feedback },
    },
  );

export const listVersions = (id: string) =>
  apiFetch<
    {
      version: number;
      title: string;
      total_estimated_cost_inr: number;
      created: string;
    }[]
  >(`/api/v1/itineraries/${id}/versions/`);

export const restoreVersion = (id: string, version: number) =>
  apiFetch<Itinerary>(
    `/api/v1/itineraries/${id}/versions/${version}/restore/`,
    {
      method: "POST",
    },
  );

// --- search & packages ------------------------------------------------------

export interface SearchResult {
  content: string;
  source_type: string;
  source_id: string;
  metadata: Record<string, unknown>;
  score: number;
}

export const search = (q: string, type?: string) =>
  apiFetch<{ results: SearchResult[] }>(
    `/api/v1/search/?q=${encodeURIComponent(q)}${type ? `&type=${type}` : ""}`,
  );

export const listPackages = (destination?: string) =>
  apiFetch<{ results: unknown[] }>(
    `/api/v1/packages/${destination ? `?destination=${encodeURIComponent(destination)}` : ""}`,
  );

export const createPackageRequest = (body: Record<string, unknown>) =>
  apiFetch<{ request: unknown; matches: unknown[] }>(
    "/api/v1/package-requests/",
    {
      method: "POST",
      body,
    },
  );

// --- enquiries --------------------------------------------------------------

export const createEnquiry = (body: Record<string, unknown>) =>
  apiFetch<{ id: string }>("/api/v1/enquiries/", { method: "POST", body });

// --- auth & profile ---------------------------------------------------------

export async function register(
  username: string,
  password: string,
  email?: string,
) {
  const result = await apiFetch<{
    user: unknown;
    access: string;
    refresh: string;
  }>("/api/v1/auth/register/", {
    method: "POST",
    body: { username, password, email },
    auth: false,
  });
  session.setTokens(result.access, result.refresh);
  return result;
}

export async function login(username: string, password: string) {
  const result = await apiFetch<{ access: string; refresh: string }>(
    "/api/v1/auth/token/",
    {
      method: "POST",
      body: { username, password },
      auth: false,
    },
  );
  session.setTokens(result.access, result.refresh);
  return result;
}

/** Call after register/login: transfers guest itineraries to the account.
 *  Idempotent — safe to call on every login. */
export const claimGuestSession = () =>
  apiFetch<{ claimed_itineraries: number }>("/api/v1/auth/claim/", {
    method: "POST",
  });

export const myPreferences = () =>
  apiFetch<{ profile: Record<string, unknown> | null }>(
    "/api/v1/auth/me/preferences/",
  );
