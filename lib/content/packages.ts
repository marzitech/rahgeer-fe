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
    genEvScore: 82,
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
    genEvScore: 80,
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
    durationLabel: "8 Nights · 9 Days",
    datesLabel: "17 – 26 November",
    packageType: "Flights from Bangalore included",
    mealsLabel: "All meals & all flights included",
    fromCity: "Bangalore",
    placesCovered: ["Sapa", "Halong Bay", "Hanoi", "Da Nang", "Hoi An"],
    genEvScore: 79,
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
        title: "Welcome to Vietnam",
        stops: [
          {
            time: "On arrival",
            title: "Bangalore → Hanoi | Private airport transfer",
            description:
              "Begin your Vietnam adventure with a comfortable flight from Bangalore to Hanoi. On arrival, enjoy a seamless private transfer from the airport to your hotel. Check in, settle into your room, and take the rest of the day to relax and recharge after your journey. Your Vietnamese adventure begins at an easy, unhurried pace.",
          },
        ],
      },
      {
        day: 2,
        title: "Discover the Charm of Hanoi",
        stops: [
          {
            time: "9:00 AM",
            title: "Hanoi Old Quarter & lakeside",
            description:
              "Start your Vietnam experience with a gentle exploration of Hanoi's iconic Old Quarter. Discover its atmospheric streets, traditional architecture, colourful storefronts, local cafés, and lively neighbourhoods. Continue towards the peaceful lakeside, taking in the contrast between Hanoi's vibrant streets and tranquil surroundings. The day is designed at a comfortable pace, giving you time to experience the character of Vietnam's capital without feeling rushed.",
          },
        ],
      },
      {
        day: 3,
        title: "From Hanoi to the Mountains of Sapa",
        stops: [
          {
            time: "2:00 PM",
            title: "Comfortable transfer to Sapa",
            description:
              "Leave the energy of Hanoi behind as you travel towards the spectacular mountain landscapes of Sapa. Enjoy a scenic and comfortable road journey through the Vietnamese countryside, with a convenient rest stop along the way. Watch the landscape gradually transform as you approach the mountains. On arrival in Sapa, check in to your hotel, unwind, and enjoy a peaceful evening surrounded by beautiful mountain scenery.",
          },
        ],
      },
      {
        day: 4,
        title: "Sapa's Rice Terraces and Fansipan",
        stops: [
          {
            time: "10:00 AM",
            title: "Rice terraces & scenic viewpoints",
            description:
              "Discover the breathtaking landscapes that make Sapa one of Vietnam's most beautiful destinations. Visit comfortable and accessible viewpoints overlooking the region's famous rice terraces, where layers of green valleys unfold across dramatic mountain slopes. Take your time to admire the scenery, capture photographs, and enjoy the peaceful atmosphere without the need for strenuous hiking.",
          },
          {
            time: "2:00 PM",
            title: "Fansipan cable car experience",
            description:
              "Experience Vietnam's highest mountain in comfort with a spectacular cable car ride to Fansipan. As the cable car rises above the mountains, enjoy sweeping views across Sapa's valleys and surrounding peaks. Reach the summit area without the challenge of climbing and take in the remarkable panoramic scenery from above.",
          },
        ],
      },
      {
        day: 5,
        title: "Journey to Magical Halong Bay",
        stops: [
          {
            time: "Morning",
            title: "Sapa → Halong Bay via Hanoi",
            description:
              "After breakfast, begin your journey from the mountains towards the coast. Travel comfortably through the changing landscapes of northern Vietnam, returning via Hanoi before continuing towards Halong Bay.",
          },
          {
            time: "1:00 PM",
            title: "Board your overnight Halong Bay cruise",
            description:
              "Step aboard your cruise and settle into your floating retreat among Halong Bay's towering limestone karsts. As the cruise glides across the emerald waters, relax on board and enjoy the spectacular scenery surrounding you. Spend the evening taking in the peaceful beauty of Halong Bay and enjoy the unique experience of staying overnight on the water.",
          },
        ],
      },
      {
        day: 6,
        title: "From Halong Bay to Da Nang",
        stops: [
          {
            time: "Morning",
            title: "Bay cruising & caves",
            description:
              "Wake up to the spectacular scenery of Halong Bay and enjoy a gentle morning cruise through its emerald waters. Glide past towering limestone islands and discover fascinating caves and natural formations along the way, with comfortable and accessible stops to experience the bay up close.",
          },
          {
            time: "Afternoon",
            title: "Fly to Da Nang",
            description:
              "After disembarking from the cruise, continue your journey south with a short flight to Da Nang. On arrival, transfer to your hotel, check in, and relax. Enjoy a peaceful evening by the coast and take in the laid-back atmosphere of central Vietnam.",
          },
        ],
      },
      {
        day: 7,
        title: "Golden Bridge and the Magic of Hoi An",
        stops: [
          {
            time: "9:30 AM",
            title: "Ba Na Hills & Golden Bridge",
            description:
              "Begin the day with a comfortable cable car journey up to Ba Na Hills, travelling above the forested mountains and clouds. Discover the iconic Golden Bridge, famous for its striking design and spectacular mountain setting. Enjoy panoramic views across the surrounding landscape without the need for a strenuous climb.",
          },
          {
            time: "4:00 PM",
            title: "Da Nang beach leisure",
            description:
              "Return to Da Nang for a relaxed afternoon by the sea. Enjoy some unhurried time along the seafront, take in the ocean views, relax at your hotel, or simply enjoy the peaceful coastal atmosphere at your own pace.",
          },
        ],
      },
      {
        day: 8,
        title: "Hoi An and a Lantern-Lit Farewell",
        stops: [
          {
            time: "10:00 AM",
            title: "Hoi An Old Town",
            description:
              "Step into the timeless charm of Hoi An, one of Vietnam's most atmospheric heritage towns. Explore its flat and walkable streets lined with colourful buildings, traditional houses, charming cafés, local boutiques, and tailor shops. Stroll along the river and enjoy the relaxed rhythm of this beautifully preserved town.",
          },
          {
            time: "6:00 PM",
            title: "Lantern-lit evening",
            description:
              "As evening arrives, Hoi An takes on a magical character as its streets and riverside glow with colourful lanterns. Enjoy a gentle evening stroll through the illuminated old town, pause at a riverside café, and soak in the enchanting atmosphere before returning to your hotel.",
          },
        ],
      },
      {
        day: 9,
        title: "Da Nang → Bangalore",
        stops: [
          {
            time: "Morning",
            title: "Check-out & flight home",
            description:
              "Enjoy a relaxed breakfast before checking out. Your private transfer will take you to the airport for your return journey to Bangalore, bringing your Vietnam adventure to a memorable close.",
          },
        ],
      },
    ],
    priceIncludes: [
      "Return economy flights from Bangalore.",
      "All meals throughout the tour.",
      "Accommodation on twin-sharing basis for 8 nights.",
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
