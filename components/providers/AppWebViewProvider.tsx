"use client";

import { createContext, useContext, type ReactNode } from "react";

/** Whether the current page is embedded in the Marzi app WebView. Seeded
 *  server-side from the layout, so the value is correct on first render. */
const AppWebViewContext = createContext(false);

export function AppWebViewProvider({
  isApp,
  children,
}: {
  isApp: boolean;
  children: ReactNode;
}) {
  return (
    <AppWebViewContext.Provider value={isApp}>
      {children}
    </AppWebViewContext.Provider>
  );
}

/** Read whether the page is inside the Marzi app WebView — for logic-level
 *  switches in client components. For simple show/hide, prefer the
 *  `hide-in-app` / `show-in-app` CSS classes (no JS needed). */
export function useIsAppWebView(): boolean {
  return useContext(AppWebViewContext);
}
