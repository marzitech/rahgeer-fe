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
  // Contact is optional — captured at the download-gate, not at intake.
  traveler_name?: string;
  phone?: string;
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

export interface TransportOption {
  mode: string;
  duration: string;
  cost: string;
  senior_friendly: "high" | "medium" | "low";
  notes: string;
}

export interface ItineraryBlock {
  time_of_day: "morning" | "afternoon" | "evening";
  time?: string; // clock time, e.g. "10:30 AM"
  duration?: string;
  title: string;
  description: string;
  estimated_cost_inr: number;
  senior_note?: string;
  transport_options?: TransportOption[];
  recommended_mode?: string;
  citations: string[];
}

export interface ItineraryDay {
  day_number: number;
  date: string | null;
  title: string;
  blocks: ItineraryBlock[];
}

/** Day entry inside ai_output — carries the dossier extras the day rows
 *  don't (meals, stay, per-day Gen EV). */
export interface AiOutputDay {
  day_number: number;
  title: string;
  summary?: string;
  meals?: { breakfast: string; lunch: string; dinner: string };
  stay?: string;
  gen_ev_score?: number;
  day_type?: string;
  blocks: ItineraryBlock[];
}

export interface HotelOption {
  name: string;
  city: string;
  nights: number;
  category: string;
  why: string;
  strengths: string[];
  gen_ev_score: number;
  tier: "primary" | "alternative";
  price_per_night: string;
}

export interface RestaurantPick {
  name: string;
  city: string;
  cuisine: string;
  veg_options: string;
  why: string;
  context: string;
  gen_ev_score: number;
}

export interface CityWeather {
  city: string;
  temp: string;
  high: string;
  low: string;
  humidity: string;
  condition: string;
  summary: string;
  planning_note: string;
}

export interface BudgetLine {
  item: string;
  per_person_inr: number;
  total_inr: number;
}

export interface BudgetBreakdown {
  total_inr: number;
  per_person_inr: number;
  accommodation: BudgetLine[];
  transport: BudgetLine[];
  food_and_dining: BudgetLine[];
  activities_and_entry: BudgetLine[];
  miscellaneous: BudgetLine[];
}

export interface RejectedOption {
  option: string;
  reason: string;
  constraint: string;
}

export interface PackingList {
  essentials: string[];
  clothing: string[];
  medication_health: string[];
  comfort_seniors: string[];
  documents: string[];
  tech_gadgets: string[];
}

export interface GenEvScore {
  score: number;
  pacing_rest: number;
  accessibility: number;
  safety_security: number;
  value_for_money: number;
  label: string;
  summary: string;
}

export interface Itinerary {
  id: string;
  ai_status: "pending" | "processing" | "success" | "failure";
  ai_output: {
    title: string;
    summary: string;
    total_estimated_cost_inr: number;
    travel_tips: string[];
    // Trip Plan v2 dossier — optional so pre-v2 records still render
    gen_ev?: GenEvScore;
    trip_overview?: Record<string, string>;
    days?: AiOutputDay[];
    hotels?: HotelOption[];
    restaurants?: RestaurantPick[];
    weather?: CityWeather[];
    budget?: BudgetBreakdown;
    rejected_options?: RejectedOption[];
    packing_list?: PackingList;
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

/** Curated sample itinerary shown on the Explore-destinations cards,
 *  fetched by destination slug (kerala, japan, europe, rajasthan). */
export const getSampleItinerary = (slug: string) =>
  apiFetch<Itinerary>(`/api/v1/itineraries/samples/${slug}/`);

/** "Where should we send your plan?" — contact capture gating the
 *  dossier download; alerts the travel desk. */
export const submitItineraryLead = (
  id: string,
  body: { name: string; email: string; whatsapp: string },
) =>
  apiFetch<{ detail: string }>(`/api/v1/itineraries/${id}/lead/`, {
    method: "POST",
    body,
  });

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
