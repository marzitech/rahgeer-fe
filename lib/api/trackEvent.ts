// // utils/trackEvent.ts
// export async function trackEvent(
//   eventName: string,
//   props: Record<string, any> = {},
// ) {
//   const payload = {
//     writeKey: "wk_web_742284be62e5de7f0450a1b1",
//     anonymousId: "anon_demo_0001",
//     sessionId: "sess_demo_0001",
//     ts: new Date().toISOString(),
//     page: window.location.pathname,
//     url: window.location.href,
//     referrer: document.referrer,
//     device: navigator.userAgent,
//     viewport: { w: window.innerWidth, h: window.innerHeight },
//     scrollY: window.scrollY,
//     events: [
//       {
//         eventId: crypto.randomUUID(),
//         name: eventName,
//         props,
//       },
//     ],
//   };

//   try {
//     console.log(payload);
//     const res = await fetch("https://track.marzitech.in/v1/events", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     console.log("Event sent:", eventName, res.status);
//   } catch (err) {
//     console.error("Event tracking failed:", err);
//   }
// }

// utils/trackEvent.ts
export async function trackEvent(
  eventName: string,
  props: Record<string, any> = {},
) {
  const payload = {
    writeKey: "wk_web_742284be62e5de7f0450a1b1",
    anonymousId: "anon_demo_0001",
    sessionId: "sess_demo_0001",
    ts: new Date().toISOString(),
    page: window.location.pathname,
    url: window.location.href,
    referrer: document.referrer,
    device: navigator.userAgent,
    viewport: { w: window.innerWidth, h: window.innerHeight },
    scrollY: window.scrollY,
    events: [
      {
        eventId: crypto.randomUUID(),
        name: eventName,
        props,
      },
    ],
  };

  try {
    const res = await fetch("https://track.marzitech.in/v1/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("Event sent:", eventName, res.status, payload);
  } catch (err) {
    console.error("Event tracking failed:", err);
  }
}
