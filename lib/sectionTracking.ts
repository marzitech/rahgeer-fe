// hooks/useTracking.ts
import { useEffect } from "react";
import { trackEvent } from "./api/trackEvent";
import { debounce } from "./debounce";

export function useTracking() {
  useEffect(() => {
    const sectionTimes: Record<string, number> = {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          console.log("this is the ID", id);
          if (!id) return;

          if (entry.isIntersecting) {
            // Section entered → store entry time
            if (!sectionTimes[id]) {
              sectionTimes[id] = Date.now();
              trackEvent("section_visible", {
                section: id,
                scrollY: window.scrollY,
                page: window.location.pathname,
                url: window.location.href,
                referrer: document.referrer,
                device: navigator.userAgent,
                viewport: { w: window.innerWidth, h: window.innerHeight },
              });
            }
          } else {
            // Section exited → calculate duration
            if (sectionTimes[id]) {
              const duration = Date.now() - sectionTimes[id];
              console.log("my duration is", duration);
              if (duration > 500) {
                // ignore very short flickers <0.5s
                trackEvent("section_time_spent", {
                  section: id,
                  ms: duration,
                  scrollY: window.scrollY,
                  page: window.location.pathname,
                  url: window.location.href,
                  referrer: document.referrer,
                  device: navigator.userAgent,
                  viewport: { w: window.innerWidth, h: window.innerHeight },
                });
              }
              delete sectionTimes[id];
            }
          }
        });
      },
      { threshold: 0.5 },
    );

    // Observe all elements with id (section/div/header)
    const sections = document.querySelectorAll("[id]");
    sections.forEach((sec) => observer.observe(sec));

    // Scroll tracking with debounce
    const handleScroll = debounce(() => {
      trackEvent("page_scrolled", {
        scrollY: window.scrollY,
        page: window.location.pathname,
        url: window.location.href,
        referrer: document.referrer,
        device: navigator.userAgent,
        viewport: { w: window.innerWidth, h: window.innerHeight },
      });
    }, 1000);

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
}
