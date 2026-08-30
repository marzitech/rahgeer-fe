/**
 * Curated package content — the "View packages" pages (design: package
 * detail with hero, Gen EV, day-by-day itinerary, price includes/excludes).
 *
 * These are the real curated tours we're currently offering. Keyed by the
 * same slug as the home destination cards flagged with a price.
 */

export type PackageStop = {
  time: string;
  title: string;
  description: string;
};

export type PackageDay = {
  day: number;
  title: string;
  stops: PackageStop[];
};

export type PackagePlace = {
  name: string;
  blurb: string;
  image: string;
};

export type PackageStay = {
  name: string;
  city: string;
  nights: number;
};

export type PackageContent = {
  slug: string;
  name: string;
  title: string;
  image: string;
  durationLabel: string; // "4 Nights · 5 Days"
  datesLabel: string; // "25 – 29 September 2026"
  packageType: string; // "Land package only" | "Flights from Bangalore included"
  mealsLabel: string; // "All meals included"
  fromCity?: string;
  placesCovered: string[];
  genEvScore: number;
  priceFromInr: number;
  whyTourWithMarzi: string[];
  highlights: { term: string; description: string }[];
  days: PackageDay[];
  priceIncludes: string[];
  priceExcludes: string[];
  // Redesigned detail page (destination view) fields.
  about?: string;
  tempLabel?: string; // "12°C – 28°C"
  paceLabel?: string; // "Relaxed to Moderate"
  nearAirport?: string; // "Srinagar International Airport (SXR)"
  placesToVisit?: PackagePlace[];
  stays?: PackageStay[];
};

// The same senior-first promises apply across every curated tour.
const WHY_TOUR = [
  "Hand-picked, comfortable hotels throughout the tour.",
  "A dedicated Travel Mitr on call before and during your trip.",
  "Private, comfortable transfers and sightseeing — no crowded coaches.",
  "Unhurried pacing with rest built in after busy mornings.",
  "Every detail — stays, transfers and sightseeing — handled for you.",
];

export const PACKAGE_CONTENT: Record<string, PackageContent> = {
  kashmir: {
    slug: "kashmir",
    name: "Kashmir",
    title: "Kashmir — Srinagar, Pahalgam & Gulmarg",
    image: "/images/destinations/kashmir.jpg",
    durationLabel: "4 Nights · 5 Days",
    datesLabel: "25 – 29 September",
    packageType: "Land package only",
    mealsLabel: "All meals included",
    placesCovered: ["Srinagar", "Pahalgam", "Gulmarg"],
    about:
      "Kashmir is often called 'Paradise on Earth', and for good reason. Set in the Himalayas around Dal Lake and the meadows of Gulmarg and Pahalgam, it offers cool mountain air, gentle valley drives and some of India's most beautiful gardens.",
    tempLabel: "12°C – 28°C",
    paceLabel: "Relaxed to Moderate",
    nearAirport: "Srinagar International Airport (SXR)",
    // TODO(assets): per-place photos — all reuse the Kashmir hero for now.
    placesToVisit: [
      {
        name: "Srinagar",
        blurb:
          "Dal Lake shikara rides, Mughal gardens and old-city markets at an easy pace.",
        image: "/images/destinations/kashmir.jpg",
      },
      {
        name: "Gulmarg",
        blurb:
          "Gondola ride over pine meadows — Himalayan views with no trekking needed.",
        image: "/images/destinations/kashmir.jpg",
      },
      {
        name: "Pahalgam",
        blurb:
          "Gentle drives through the Lidder valley to the Betaab and Aru viewpoints.",
        image: "/images/destinations/kashmir.jpg",
      },
    ],
    stays: [
      { name: "Dal Lake houseboat & city hotel", city: "Srinagar", nights: 4 },
    ],
    genEvScore: 90,
    priceFromInr: 34999,
    whyTourWithMarzi: WHY_TOUR,
    highlights: [
      {
        term: "Dal Lake houseboat & shikara",
        description:
          "A tranquil houseboat stay with a gentle, seated shikara ride at sunset.",
      },
      {
        term: "Gulmarg gondola",
        description:
          "Ride the gondola up to the meadows — sweeping views with no trekking.",
      },
      {
        term: "Pahalgam valley",
        description:
          "A scenic, comfortable drive through the Lidder valley with easy stops.",
      },
      {
        term: "Mughal gardens",
        description:
          "Unhurried garden visits with plenty of shade and seating.",
      },
    ],
    days: [
      {
        day: 1,
        title: "Arrive Srinagar",
        stops: [
          {
            time: "Afternoon",
            title: "Houseboat check-in",
            description:
              "Private transfer to your Dal Lake houseboat. Settle in and relax.",
          },
          {
            time: "5:00 PM",
            title: "Sunset shikara ride",
            description:
              "A calm, seated shikara ride across the lake as the sun sets.",
          },
        ],
      },
      {
        day: 2,
        title: "Gulmarg day trip",
        stops: [
          {
            time: "10:00 AM",
            title: "Gulmarg gondola",
            description:
              "A comfortable cable-car ride to the meadows, with viewing points and tea stops.",
          },
          {
            time: "2:00 PM",
            title: "Leisure in the meadows",
            description:
              "Gentle time to enjoy the scenery at your own pace before returning.",
          },
        ],
      },
      {
        day: 3,
        title: "Pahalgam valley",
        stops: [
          {
            time: "9:30 AM",
            title: "Scenic drive to Pahalgam",
            description:
              "A comfortable drive through the valley with easy photo stops en route.",
          },
          {
            time: "1:00 PM",
            title: "Betaab & Aru valley",
            description:
              "Relaxed time in the meadows and riverside spots with plenty of seating.",
          },
        ],
      },
      {
        day: 4,
        title: "Srinagar at leisure",
        stops: [
          {
            time: "10:00 AM",
            title: "Mughal gardens",
            description:
              "Visit Nishat and Shalimar Bagh — flat, shaded gardens with seating.",
          },
          {
            time: "3:00 PM",
            title: "Local markets & Shankaracharya view",
            description:
              "Gentle browsing for Kashmiri crafts and an easy viewpoint stop.",
          },
        ],
      },
      {
        day: 5,
        title: "Departure",
        stops: [
          {
            time: "Morning",
            title: "Check-out & transfer",
            description:
              "A relaxed breakfast before your private transfer to Srinagar airport.",
          },
        ],
      },
    ],
    priceIncludes: [
      "Accommodation on twin-sharing basis for 4 nights.",
      "All meals — breakfast, lunch and dinner — throughout the tour.",
      "One-night Dal Lake houseboat stay with a shikara ride.",
      "All private transfers and sightseeing in Srinagar, Pahalgam & Gulmarg.",
      "Dedicated travel-desk support throughout.",
    ],
    priceExcludes: [
      "Airfare or train fare to and from Srinagar (land package only).",
      "Gondola, pony rides and personal activity charges.",
      "Personal expenses, tips and anything not listed.",
      "Travel insurance.",
    ],
  },

  "ayodhya-varanasi-sarnath": {
    slug: "ayodhya-varanasi-sarnath",
    name: "Ayodhya · Varanasi · Sarnath",
    title: "Ayodhya · Varanasi · Sarnath — A Spiritual Journey",
    // TODO(assets): swap in a real Varanasi/Ganga-ghat photo.
    image: "/images/home/review-trip-1.jpg",
    durationLabel: "4 Nights · 5 Days",
    datesLabel: "28 September – 2 October",
    packageType: "Land package only",
    mealsLabel: "Breakfast & select meals",
    placesCovered: ["Ayodhya", "Varanasi", "Sarnath"],
    about:
      "Ayodhya, Varanasi and Sarnath together form one of India's most sacred circuits — the birthplace of Shri Ram, the eternal ghats of the Ganga, and the site of Buddha's first sermon, all travelled at a gentle, unhurried pace.",
    tempLabel: "24°C – 34°C",
    paceLabel: "Relaxed",
    nearAirport: "Maharishi Valmiki International Airport, Ayodhya (AYJ)",
    // TODO(assets): per-place photos — reusing the card art for now.
    placesToVisit: [
      {
        name: "Ayodhya",
        blurb:
          "Shri Ram Janmabhoomi, Hanuman Garhi and the evening Saryu aarti.",
        image: "/images/home/review-trip-1.jpg",
      },
      {
        name: "Varanasi",
        blurb:
          "Sunrise boat ride past the ghats and darshan at Kashi Vishwanath.",
        image: "/images/home/review-trip-1.jpg",
      },
      {
        name: "Sarnath",
        blurb:
          "The Dhamek Stupa and museum where Buddha gave his first sermon.",
        image: "/images/home/review-trip-1.jpg",
      },
    ],
    stays: [
      { name: "Hand-picked comfortable hotel", city: "Ayodhya", nights: 1 },
      { name: "Hand-picked comfortable hotel", city: "Varanasi", nights: 3 },
    ],
    genEvScore: 88,
    priceFromInr: 21999,
    whyTourWithMarzi: WHY_TOUR,
    highlights: [
      {
        term: "Shri Ram Janmabhoomi darshan",
        description:
          "A guided, unhurried visit to the Ram Mandir with assistance throughout.",
      },
      {
        term: "Ganga & Saryu aarti",
        description:
          "Reserved, comfortable seating for the evening aarti ceremonies.",
      },
      {
        term: "Sunrise boat ride, Varanasi",
        description:
          "A gentle boat ride along the ghats as the sun rises over the Ganga.",
      },
      {
        term: "Kashi Vishwanath & Sarnath",
        description:
          "Temple darshan plus the peaceful Buddhist site at Sarnath.",
      },
    ],
    days: [
      {
        day: 1,
        title: "Arrive Ayodhya",
        stops: [
          {
            time: "Afternoon",
            title: "Shri Ram Janmabhoomi Temple",
            description:
              "Darshan at the Ram Mandir with a guide and assistance throughout.",
          },
          {
            time: "5:00 PM",
            title: "Hanuman Garhi & Saryu Aarti",
            description:
              "Visit Hanuman Garhi, then the evening Saryu River aarti with seating.",
          },
        ],
      },
      {
        day: 2,
        title: "Ayodhya → Varanasi",
        stops: [
          {
            time: "9:00 AM",
            title: "Nageshwarnath & Treta ke Thakur",
            description:
              "Morning darshan at Nageshwarnath and Treta ke Thakur temples.",
          },
          {
            time: "1:00 PM",
            title: "Comfortable transfer to Varanasi",
            description:
              "A private transfer to Varanasi, with a rest stop en route.",
          },
        ],
      },
      {
        day: 3,
        title: "Varanasi ghats & temples",
        stops: [
          {
            time: "5:30 AM",
            title: "Sunrise boat ride",
            description:
              "A gentle boat ride past Dashashwamedh and the ghats at dawn.",
          },
          {
            time: "11:00 AM",
            title: "Kashi Vishwanath & Kal Bhairav",
            description:
              "Darshan at Kashi Vishwanath and Kal Bhairav temples with assistance.",
          },
        ],
      },
      {
        day: 4,
        title: "Varanasi & Sarnath",
        stops: [
          {
            time: "9:30 AM",
            title: "Sankat Mochan, Durga Kund & Tulsi Manas",
            description:
              "A morning circuit of Varanasi's revered temples at an easy pace.",
          },
          {
            time: "2:00 PM",
            title: "Sarnath",
            description:
              "The peaceful Buddhist site — Dhamek Stupa and the museum.",
          },
          {
            time: "6:30 PM",
            title: "Ganga Aarti, Dashashwamedh Ghat",
            description:
              "The grand evening Ganga aarti with reserved, comfortable seating.",
          },
        ],
      },
      {
        day: 5,
        title: "Departure",
        stops: [
          {
            time: "Morning",
            title: "Check-out & transfer",
            description:
              "A relaxed breakfast before your private transfer to Varanasi airport/station.",
          },
        ],
      },
    ],
    priceIncludes: [
      "Accommodation on twin-sharing basis for 4 nights.",
      "Daily breakfast and select meals per the itinerary.",
      "All private transfers and temple sightseeing as listed.",
      "Boat ride and aarti visits with reserved seating.",
      "Dedicated travel-desk support throughout.",
    ],
    priceExcludes: [
      "Airfare or train fare to Ayodhya and from Varanasi (land package only).",
      "VIP darshan or special pooja charges.",
      "Personal expenses, tips and anything not listed.",
      "Travel insurance.",
    ],
  },

  vietnam: {
    slug: "vietnam",
    name: "Vietnam",
    title: "Vietnam — Sapa, Halong Bay, Hanoi, Da Nang & Hoi An",
    image: "/images/destinations/vietnam.jpg",
    durationLabel: "7 Nights · 8 Days",
    datesLabel: "15 – 23 November",
    packageType: "Flights from Bangalore included",
    mealsLabel: "All meals & all flights included",
    about:
      "Vietnam pairs misty rice terraces and limestone bays with easy coastal towns. This journey links Sapa's mountains, an overnight Halong Bay cruise and the lantern-lit streets of Hoi An — with flights, transfers and pacing all handled.",
    tempLabel: "24°C – 32°C",
    paceLabel: "Relaxed to Moderate",
    nearAirport: "Noi Bai International Airport, Hanoi (HAN)",
    // TODO(assets): per-place photos — reusing the Vietnam hero for now.
    placesToVisit: [
      {
        name: "Sapa",
        blurb:
          "Rice terraces and the Fansipan cable car — big views, no trekking.",
        image: "/images/destinations/vietnam.jpg",
      },
      {
        name: "Halong Bay",
        blurb:
          "An overnight cruise among the limestone karsts with easy boarding.",
        image: "/images/destinations/vietnam.jpg",
      },
      {
        name: "Hoi An",
        blurb:
          "The flat, walkable lantern-lit old town at a relaxed evening pace.",
        image: "/images/destinations/vietnam.jpg",
      },
    ],
    stays: [
      { name: "Hand-picked city hotel", city: "Hanoi", nights: 1 },
      { name: "Mountain-view hotel", city: "Sapa", nights: 2 },
      { name: "Overnight cruise cabin", city: "Halong Bay", nights: 1 },
      { name: "Beachside hotel", city: "Da Nang", nights: 3 },
    ],
    fromCity: "Bangalore",
    placesCovered: ["Sapa", "Halong Bay", "Hanoi", "Da Nang", "Hoi An"],
    genEvScore: 87,
    priceFromInr: 164999,
    whyTourWithMarzi: WHY_TOUR,
    highlights: [
      {
        term: "Sapa rice terraces",
        description:
          "The famous terraced valleys, enjoyed from comfortable viewpoints.",
      },
      {
        term: "Halong Bay overnight cruise",
        description:
          "An overnight cruise among the limestone karsts with easy boarding.",
      },
      {
        term: "Hoi An lantern old town",
        description:
          "The flat, walkable lantern-lit old town at a relaxed evening pace.",
      },
      {
        term: "Da Nang & the Golden Bridge",
        description:
          "Beaches and Ba Na Hills, reached comfortably by cable car.",
      },
    ],
    days: [
      {
        day: 1,
        title: "Bangalore → Hanoi",
        stops: [
          {
            time: "Evening",
            title: "Arrive Hanoi",
            description:
              "Flight from Bangalore, private transfer to your hotel, and rest.",
          },
        ],
      },
      {
        day: 2,
        title: "Hanoi → Sapa",
        stops: [
          {
            time: "9:00 AM",
            title: "Hanoi city tour",
            description:
              "An easy tour of the Old Quarter and lakeside at a gentle pace.",
          },
          {
            time: "2:00 PM",
            title: "Comfortable transfer to Sapa",
            description:
              "A scenic drive to Sapa with a rest stop; check in and relax.",
          },
        ],
      },
      {
        day: 3,
        title: "Sapa",
        stops: [
          {
            time: "10:00 AM",
            title: "Rice terraces & viewpoints",
            description:
              "The terraced valleys from comfortable, accessible viewpoints.",
          },
          {
            time: "2:00 PM",
            title: "Fansipan cable car",
            description:
              "Ascend by cable car for panoramic views — no climbing required.",
          },
        ],
      },
      {
        day: 4,
        title: "Sapa → Halong Bay",
        stops: [
          {
            time: "Morning",
            title: "Transfer to Halong",
            description: "A comfortable drive to Halong Bay via Hanoi.",
          },
          {
            time: "1:00 PM",
            title: "Board the overnight cruise",
            description:
              "Easy boarding onto your cruise among the limestone karsts.",
          },
        ],
      },
      {
        day: 5,
        title: "Halong Bay → Da Nang",
        stops: [
          {
            time: "Morning",
            title: "Bay cruising & caves",
            description:
              "Gentle cruising past the islands, with accessible stops.",
          },
          {
            time: "Afternoon",
            title: "Fly to Da Nang",
            description:
              "Disembark and a short flight to Da Nang; check in and relax.",
          },
        ],
      },
      {
        day: 6,
        title: "Da Nang",
        stops: [
          {
            time: "9:30 AM",
            title: "Ba Na Hills & Golden Bridge",
            description:
              "Reach the hills comfortably by cable car for the iconic Golden Bridge.",
          },
          {
            time: "4:00 PM",
            title: "Da Nang beach leisure",
            description: "Relaxed time by the seafront at your own pace.",
          },
        ],
      },
      {
        day: 7,
        title: "Hoi An",
        stops: [
          {
            time: "10:00 AM",
            title: "Hoi An old town",
            description:
              "The flat, walkable heritage town with tailors, cafes and river views.",
          },
          {
            time: "6:00 PM",
            title: "Lantern-lit evening",
            description:
              "The lantern streets and riverside at a gentle evening pace.",
          },
        ],
      },
      {
        day: 8,
        title: "Da Nang → Bangalore",
        stops: [
          {
            time: "Morning",
            title: "Check-out & flight home",
            description:
              "A relaxed breakfast before your transfer and return flight to Bangalore.",
          },
        ],
      },
    ],
    priceIncludes: [
      "Return economy flights from Bangalore.",
      "All meals throughout the tour.",
      "Accommodation on twin-sharing basis for 7 nights.",
      "Halong Bay overnight cruise and all private transfers.",
      "All sightseeing listed, with dedicated travel-desk support.",
    ],
    priceExcludes: [
      "Vietnam visa fees (assistance provided).",
      "Personal expenses, tips and optional activities.",
      "Anything not mentioned in the inclusions.",
      "Travel insurance.",
    ],
  },
};
