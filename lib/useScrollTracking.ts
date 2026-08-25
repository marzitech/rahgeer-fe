import { useEffect } from "react";
import { trackEvent } from "./api/trackEvent";
import { debounce } from "./debounce";

export function useScrollTracking() {
  useEffect(() => {
    const handleScroll = debounce(() => {
      trackEvent("page_scrolled", { scrollY: window.scrollY });
    }, 1000); // 1 second debounce

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}
