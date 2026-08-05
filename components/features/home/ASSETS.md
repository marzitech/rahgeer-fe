# Home page — pending Figma asset exports

Figma MCP quota (View seat) ran out before image assets could be exported.
Every `<ImagePlaceholder>` below needs its real asset. When quota resets
(or with a Dev seat), pull each node with `get_design_context` and commit
the exported images under `public/images/home/`.

Design: Marzi Production — node `3256:93803` (Web / home desktop, 1280w).

| Component        | Placeholder                                                                      | Figma section node       |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------ |
| Hero.tsx         | 3 trusted-customer avatars                                                       | 3256:94262               |
| TravelMitr.tsx   | Travel Mitr portrait (180px circle)                                              | 3297:96501               |
| TravelMitr.tsx   | chip icons (explore/date_range/cottage/map/support_agent/article — Material set) | 3297:96501               |
| PlanningFor.tsx  | 2 audience card photos                                                           | 3256:94314               |
| Destinations.tsx | 6 destination photos (Europe, Kashmir, Japan, Kerala, Vietnam, Rajasthan)        | 3256:94344               |
| PressStrip.tsx   | press logos (~3 distinct, strip repeats)                                         | 3256:94370               |
| HowItWorks.tsx   | family-planning photo (640x480)                                                  | 3256:94387               |
| Testimonials.tsx | 4 avatars + 2 trip photos                                                        | 3256:94501               |
| Header/Footer    | Marzi logo (currently styled text)                                               | 3256:93804 / 3378:109175 |
| Header           | app QR/badge asset ("10 July – 31 July") — omitted for now                       | 3256:93804               |

Also refine when Figma access returns: exact gradient stops, scallop edge
detail, decorative ellipse groups behind sections (omitted in v1).
