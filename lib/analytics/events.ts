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
} as const;
