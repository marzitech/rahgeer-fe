# Rahgeer Frontend

Next.js app for Rahgeer — AI trip planning, packages, and enquiries.
Backend: [`rahgeer-be`](https://github.com/marzitech/rahgeer-be) (Django,
see its `ARCHITECTURE.md`).

## Stack

Next.js 16 (app router) · React 19 · TypeScript · Tailwind CSS 4

## Local development


```bash
cp .env.local.example .env.local   # points at the local backend
npm install
npm run dev                        # http://localhost:3000
```

The backend must be running for API calls: `docker compose up` inside
`../rahgeer-be` (API on http://localhost:8000).

## Talking to the backend

- `lib/api/client.ts` — the ONE fetch wrapper: unwraps the backend's
  `{ data, status, status_code }` envelope, attaches the JWT and the
  `X-Guest-Session` header automatically, throws `ApiError` on errors.
- `lib/api/endpoints.ts` — typed functions per endpoint (create itinerary,
  search, claim, …). Add new endpoints here, never inline `fetch`.
- `lib/api/stream.ts` — SSE subscription for live generation progress.
- `types/api.d.ts` — generated from the backend's OpenAPI spec:
  `npm run gen:api` (backend repo must sit at `../rahgeer-be`).

Key flows to know (details in the backend's Postman collection):

- **Guest-first**: anyone can generate itineraries; the first create returns
  a `guest_session_id` (persisted to localStorage by the client). After
  signup/login call `claimGuestSession()` — idempotent, safe on every login.
- **Generation is async**: create returns `202`; subscribe with
  `streamItineraryProgress()` for live steps, or poll `getItinerary()`.

## Scripts

```bash
npm run dev / build / start
npm run lint / lint:fix
npm run format / format:check
npm run type-check
npm run gen:api        # regenerate types after backend API changes
```

## Layout

```
app/                  # routes (app router)
components/
├── ui/               # design-system primitives (buttons, cards, inputs)
└── features/         # feature components (itinerary form steps, day cards…)
lib/
├── api/              # backend client (see above)
└── ...               # utils
hooks/                # shared React hooks
types/                # api.d.ts (generated) + hand-written types
```

## Branch flow

`main` (stable) ← `dev` (integration) ← `feature/*` — PRs into `dev`,
same convention as rahgeer-be.
