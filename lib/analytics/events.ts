/** Canonical GANGADHAR event names for the travel website.
 *  Convention: Capitalized_snake_case ending in _travel_web. Always add
 *  names here — never inline string literals at call sites. */
export const EVENTS = {
  HOME_PAGE_VIEWED: "Home_page_viewed_travel_web",
  SCROLL_DEPTH_HOME: "Scroll_depth_home_travel_web",
  SECTION_VISIBLE_HOME: "Section_visible_home_travel_web",
  SECTION_TIME_SPENT_HOME: "Section_time_spent_home_travel_web",
  BOOK_SELF_CTA: "Book_self_cta_home_travel_web",
  BOOK_PARENTS_CTA: "Book_parents_cta_home_travel_web",
  PACKAGE_CARD_CLICK: "Package_card_click_home_travel_web",
  FAQ_DROPDOWN_CLICK: "Faq_dropdown_click_home_travel_web",
  CALL_CLICK_FOOTER: "Call_click_footer_travel_web",
  CALLBACK_REQUEST_FOOTER: "Callback_request_footer_travel_web",

  // ── The funnel ────────────────────────────────────────────────────────────
  //
  // Everything above is presentation: scroll depth, section visibility, which
  // card was clicked. The single most important conversion on this site — the
  // enquiry form — emitted NOTHING, so no funnel could be computed and no
  // WhatsApp automation could be bound to a travel event, because none existed.
  //
  // These follow the estate taxonomy (`docs/EVENT_TAXONOMY.md` in
  // marzi-tracking): `<area>_<object>_<action>`, lowercase snake_case, action
  // in the PAST TENSE, and `travel` is already a reserved area. The names above
  // predate it and are deliberately left alone here — renaming them changes
  // what every existing funnel matches and has its own protocol (dual-emit one
  // cycle, migrate the matcher in analytics/journey.ts, then retire).
  //
  // Variants are PROPERTIES, never names: one `travel_enquiry_submitted`
  // carrying `form: "plan-parents"`, not a name per form.
  TRAVEL_ENQUIRY_STARTED: "travel_enquiry_started",
  TRAVEL_ENQUIRY_SUBMITTED: "travel_enquiry_submitted",
  TRAVEL_ENQUIRY_SUCCEEDED: "travel_enquiry_succeeded",
  TRAVEL_ENQUIRY_FAILED: "travel_enquiry_failed",
  /** Blocked by our own validation — the customer never reached the backend. */
  TRAVEL_ENQUIRY_REJECTED: "travel_enquiry_rejected",
  TRAVEL_PACKAGE_VIEWED: "travel_package_viewed",
} as const;
