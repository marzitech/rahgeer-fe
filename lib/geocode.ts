/** Destination autocomplete for the AI trip-planner, backed by Photon
 *  (photon.komoot.io) — Komoot's free OpenStreetMap geocoder. No API key;
 *  built for search-as-you-type. We only surface trip-sized places
 *  (countries, states, cities, islands…), not street addresses or POIs. */

export interface DestinationSuggestion {
  /** What the user sees, e.g. "Munnar, Kerala, India". */
  label: string;
  /** What we store as the trip destination, e.g. "Munnar, India". */
  value: string;
}

interface PhotonFeature {
  properties?: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    type?: string;
    osm_value?: string;
  };
}

const PLACE_TYPES = new Set([
  "country",
  "state",
  "region",
  "province",
  "county",
  "district",
  "municipality",
  "city",
  "town",
  "village",
  "locality",
  "island",
  "archipelago",
]);

export interface SearchDestinationsOptions {
  signal?: AbortSignal;
  /** Restrict results to one country (e.g. "India" for departure cities);
   *  labels and values then omit the country name. */
  country?: string;
}

export async function searchDestinations(
  query: string,
  { signal, country }: SearchDestinationsOptions = {},
): Promise<DestinationSuggestion[]> {
  // Same-origin proxy to Photon (see next.config.ts rewrites) — Photon's
  // CORS policy blocks direct browser calls from our domain.
  // Country filtering happens client-side, so over-fetch to survive it.
  const res = await fetch(
    `/api/geocode/search?q=${encodeURIComponent(query)}&limit=${country ? 20 : 10}&lang=en`,
    { signal },
  );
  if (!res.ok) throw new Error(`Photon responded ${res.status}`);
  const data: { features?: PhotonFeature[] } = await res.json();

  const seen = new Set<string>();
  const suggestions: DestinationSuggestion[] = [];
  for (const feature of data.features ?? []) {
    const p = feature.properties ?? {};
    if (!p.name) continue;
    if (!PLACE_TYPES.has(p.type ?? "") && !PLACE_TYPES.has(p.osm_value ?? ""))
      continue;
    if (country && p.country !== country) continue;

    const label = [p.name, p.state, country ? undefined : p.country]
      .filter((part, i, arr): part is string =>
        Boolean(part && arr.indexOf(part) === i),
      )
      .join(", ");
    if (seen.has(label.toLowerCase())) continue;
    seen.add(label.toLowerCase());

    suggestions.push({
      label,
      value:
        !country && p.country && p.country !== p.name
          ? `${p.name}, ${p.country}`
          : p.name,
    });
    if (suggestions.length === 6) break;
  }
  return suggestions;
}

/** Coordinates → nearest city/town name, for the departure field's
 *  "Current Location" autofill. Returns null if Photon can't resolve one. */
export async function reverseGeocodeCity(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<string | null> {
  const res = await fetch(
    `/api/geocode/reverse?lat=${lat}&lon=${lon}&lang=en`,
    { signal },
  );
  if (!res.ok) throw new Error(`Photon responded ${res.status}`);
  const data: { features?: PhotonFeature[] } = await res.json();
  const p = data.features?.[0]?.properties ?? {};
  return p.city ?? p.name ?? p.state ?? null;
}
