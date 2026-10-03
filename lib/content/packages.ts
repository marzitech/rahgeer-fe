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
  /** Optional one-line intro shown under the day heading. */
  description?: string;
  stops: PackageStop[];
};

export type PackageContent = {
  slug: string;
  name: string;
  title: string;
  image: string;
  /** Optional extra hero photos — the detail hero cycles through these. */
  heroImages?: string[];
  durationLabel: string; // "4 Nights · 5 Days"
  datesLabel: string; // "25 – 29 September 2026"
  packageType: string; // "Land package only" | "Flights from Bangalore included"
  mealsLabel: string; // "All meals included"
  fromCity?: string;
  placesCovered: string[];
  genEvScore: number;
  priceFromInr: number;
  whyTourWithMarzi: { term: string; description: string }[];
  highlights: { term: string; description: string }[];
  days: PackageDay[];
  priceIncludes: string[];
  priceExcludes: string[];
};

// The same senior-first promises apply across every curated tour.
const WHY_TOUR = [
  {
    term: "Indian tour guide on every trip",
    description:
      "An experienced Travel Mitr is part of every trip — speaks both Hindi and English.",
  },
  {
    term: "The right group, the right size",
    description:
      "Small, curated groups. Everyone on the trip is 50+, so you'll be with like-minded travelers at the same stage of life, all looking to explore, relax, and enjoy good company.",
  },
  {
    term: "24x7 Doctor support",
    description:
      "A health check before the trip, and a doctor on call throughout.",
  },
  {
    term: "Vegetarian food you'll enjoy",
    description:
      "All 3 meals (breakfast, lunch, dinner) are Indian and vegetarian-friendly.",
  },
  {
    term: "Safe for solo travelers",
    description:
      "Traveling alone or a single woman? You'll be well looked after and never feel out of place.",
  },
  {
    term: "Door to door",
    description:
      "International & domestic flights, visa, all private transfers, cabs from and to home, and guided sightseeing — everything is handled, you just show up and have fun.",
  },
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
    image: "/images/destinations/ram-mandir-corridor.jpg",
    heroImages: [
      "/images/destinations/ram-mandir-corridor.jpg",
      "/images/destinations/varanasi-aarti.jpg",
      "/images/destinations/ayodhya-riverfront.jpg",
    ],
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
          "Stand before one of India's most sacred sites, with an unhurried, guided visit that lets the moment truly sink in. 4.8/5 (TripAdvisor) — Top 4 place to visit!",
      },
      {
        term: "Ganga & Saryu aarti, front and centre",
        description:
          "As hundreds of oil lamps flicker across the water and chants rise into the evening air, you're seated comfortably — no jostling for a view, just the ceremony unfolding right in front of you. Varanasi's most-visited spot. 4.5/5 (TripAdvisor)",
      },
      {
        term: "Sunrise on the Ganga",
        description:
          "Glide past centuries-old ghats as the city wakes and the sky turns gold — a quiet, boat-side start to the day that stays with you long after.",
      },
      {
        term: "Kashi Vishwanath & Sarnath",
        description:
          "From the energy of one of Shiva's holiest shrines to the stillness of the spot where Buddha gave his first sermon — two sides of India's spiritual soul, in one day. Travellers' Choice \"Best of the Best\" 2026.",
      },
    ],
    days: [
      {
        day: 1,
        title: "Arrive in Ayodhya",
        description:
          "Step into the sacred city of Ayodhya and begin an unforgettable journey filled with divine blessings, cherished moments, and the timeless spirit of Lord Ram.",
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
        title: "Ayodhya to Varanasi",
        description:
          "After a beautiful morning of darshan in Ayodhya, journey onward to Varanasi — the ancient city where spirituality, tradition, and the Ganga come together.",
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
        title: "Varanasi Ghats & Temples",
        description:
          "Wake up to the magical glow of dawn on the Ganga and immerse yourself in the sacred energy of Varanasi's iconic ghats and revered temples.",
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
        description:
          "Discover another side of Varanasi as sacred temples, serene Sarnath, and the spectacular Ganga Aarti come together for a truly unforgettable day.",
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
        description:
          "As your sacred journey comes to an end, enjoy a relaxed morning and depart with a heart full of blessings, beautiful memories, and moments to treasure forever.",
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
    heroImages: [
      "/images/destinations/halong-bay-sunset.jpg",
      "/images/destinations/hoi-an-lanterns.jpg",
      "/images/destinations/halong-bay-viewpoint.jpg",
    ],
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
        term: "Ride to the \"Roof of Indochina\"",
        description:
          "Cable car up to Fansipan, Vietnam's highest peak — rated a \"must\" experience by travelers — then wander into Cat Cat Village to meet the Black H'Mong community amid waterfalls and mountain mist. 4.3/5 (TripAdvisor)",
      },
      {
        term: "Walk on glass, above the clouds",
        description:
          "Sapa's dramatic Glass Bridge and the artsy Moana viewpoints deliver panoramas you won't get anywhere else! 4.5/5 (TripAdvisor)",
      },
      {
        term: "Sleep among limestone giants",
        description:
          "An overnight-style Halong Bay cruise through thousands of karst islands rising out of emerald water — one of the world's most surreal seascapes. Travelers call it an absolute must-see and \"the definite highlight\" of their entire Vietnam trip. 4.5/5 (TripAdvisor)",
      },
      {
        term: "Golden hands in the sky",
        description:
          "\"One of the most photographed spots in Vietnam\" — Ba Na Hills' iconic Golden Bridge is cradled by giant stone hands, plus a French Village and gardens waiting at the top of the cable car ride. 4.6/5 (TripAdvisor)",
      },
      {
        term: "Lantern-lit nights on the Hoai River",
        description:
          "Drift through Hoi An's glowing old town on a traditional lantern boat, dress up like a traditional Vietnamese in 'Ao Dai' and experience the basket-boat ride through the Coconut Forest along the way. 4.5/5 (TripAdvisor)",
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
  japan: {
    slug: "japan",
    name: "Japan",
    title: "Japan — Tokyo, Osaka, Kyoto, Nara & Hiroshima",
    image: "/images/destinations/japan.jpg",
    heroImages: [
      "/images/destinations/chureito-pagoda-fuji.jpg",
      "/images/destinations/fuji-sakura-panorama.jpg",
      "/images/destinations/japan.jpg",
    ],
    durationLabel: "8 Nights · 9 Days",
    datesLabel: "Early April · Cherry Blossom Season",
    packageType: "Flights from Bangalore included",
    mealsLabel: "All meals included",
    placesCovered: [
      "Tokyo",
      "Hakone",
      "Osaka",
      "Kyoto",
      "Nara",
      "Hiroshima",
      "Miyajima",
    ],
    genEvScore: 91,
    priceFromInr: 390000,
    whyTourWithMarzi: WHY_TOUR,
    highlights: [
      {
        term: "Cherry Blossom Season",
        description:
          "Travel in early April and catch the last of Japan's sakura — parks, temples and lakesides washed in pink.",
      },
      {
        term: "5 iconic cities in one seamless trip",
        description:
          "Tokyo, Osaka, Kyoto, Nara & Hiroshima — connected by private coach and the Shinkansen bullet train, with no rushed changeovers.",
      },
      {
        term: "Mt. Fuji & Hakone",
        description:
          "Lake Ashi Cruise, Owakudani Ropeway and Lake Kawaguchi — Fuji's most scenic viewpoints without any trekking.",
      },
      {
        term: "Tokyo DisneySea included",
        description:
          "A full day at Tokyo DisneySea with the entry ticket and private round-trip transfers covered.",
      },
      {
        term: "Nara, Kyoto & Miyajima",
        description:
          "Deer Park, ancient temples, the bamboo grove and the Grand Torii Gate rising out of the sea.",
      },
      {
        term: "Senior-friendly travel",
        description:
          "Dedicated tour manager, Indian meals and a private coach throughout — every day paced for comfort.",
      },
    ],
    days: [
      {
        day: 1,
        title: "Welcome to Tokyo",
        stops: [
          {
            time: "On arrival",
            title: "Private airport transfer & Tokyo local market",
            description:
              "Arrive at Tokyo Airport, where your private transfer is waiting. Settle in with an easy visit to a local Tokyo market on the way — a gentle first taste of Japan without any rush.",
          },
          {
            time: "Evening",
            title: "Dinner at an Indian restaurant",
            description:
              "End your first day with a familiar, comforting Indian dinner before a restful night at your hotel.",
          },
        ],
      },
      {
        day: 2,
        title: "Mt. Fuji & Hakone",
        stops: [
          {
            time: "Full day",
            title: "Hakone Shrine, Lake Ashi Cruise & Owakudani Ropeway",
            description:
              "Visit the lakeside Hakone Shrine, then board the Pirate Ship Cruise across Lake Ashi from Motohakone to Togendai. From Togendai, ride the Owakudani Ropeway over the volcanic valley, continue to the spring-fed ponds of Oshino Hakkai, and finish at Lake Kawaguchi with its classic Mt. Fuji views. Lake Ashi Cruise and Ropeway tickets are included.",
          },
        ],
      },
      {
        day: 3,
        title: "Tokyo City Tour",
        stops: [
          {
            time: "Full day",
            title: "Ueno Park, Senso-ji, Skytree & Shibuya Crossing",
            description:
              "A comfortable day through Tokyo's icons: Ueno Park and the historic Senso-ji Temple, a photo stop at Shinjuku I-Land, then up the Tokyo Skytree's 350m observation deck (ticket included). Photo stop at Tokyo Tower before soaking in the famous Shibuya Crossing.",
          },
        ],
      },
      {
        day: 4,
        title: "Tokyo DisneySea",
        stops: [
          {
            time: "Full day",
            title: "Tokyo DisneySea with transfers & entry included",
            description:
              "A full day at Tokyo DisneySea — the one-day passport and private round-trip transfers are both included. Enjoy the park entirely at your own pace.",
          },
        ],
      },
      {
        day: 5,
        title: "Tokyo → Osaka by Bullet Train",
        stops: [
          {
            time: "Morning",
            title: "Shinkansen to Osaka",
            description:
              "Private transfer to Tokyo Station to board the Shinkansen bullet train to Osaka (Ordinary Reserved Class) — one of Japan's great travel experiences, in comfort.",
          },
          {
            time: "Afternoon",
            title: "Osaka local market visit",
            description:
              "On arrival at Osaka Station, transfer to your hotel with an unhurried stop at a local Osaka market along the way.",
          },
        ],
      },
      {
        day: 6,
        title: "Nara & Kyoto",
        stops: [
          {
            time: "Full day",
            title: "Deer Park, ancient temples & the bamboo grove",
            description:
              "A full-day excursion to Nara and Kyoto with an English-speaking local guide — greet the friendly deer of Nara Park, wander ancient temples, and walk the famous bamboo grove at an easy pace.",
          },
        ],
      },
      {
        day: 7,
        title: "Hiroshima & Miyajima",
        stops: [
          {
            time: "Early morning",
            title: "Train to Hiroshima",
            description:
              "An early morning private transfer to Osaka Station to board the train to Hiroshima — settle in for a smooth, scenic ride west.",
          },
          {
            time: "Full day",
            title: "Miyajima Island, Grand Torii Gate & Peace Memorial",
            description:
              "Take the ferry across to Miyajima Island to see Itsukushima Shrine and its Grand Torii Gate standing in the sea, then visit the moving Atomic Bomb Dome and Peace Memorial Park. Return to Osaka by train with a private transfer to your hotel. Ferry and applicable entry tickets are included.",
          },
        ],
      },
      {
        day: 8,
        title: "Osaka City Tour",
        stops: [
          {
            time: "Full day",
            title: "Osaka Castle, Kuromon Market & Dotonbori",
            description:
              "A full-day Osaka city tour with an English-speaking local guide — Osaka Castle and its park, the bustling Kuromon Market, sweeping views from the Umeda Sky Observatory, and an easy evening stroll through neon-lit Dotonbori and Shinsaibashi. Osaka Castle and Umeda Sky Observatory tickets are included.",
          },
        ],
      },
      {
        day: 9,
        title: "Sayonara, Japan",
        stops: [
          {
            time: "Morning",
            title: "Check-out & airport transfer",
            description:
              "Enjoy a relaxed breakfast before checking out. Your private transfer takes you to Osaka Airport for your onward flight, closing out nine days of Japan in full bloom.",
          },
        ],
      },
    ],
    priceIncludes: [
      "Return economy flights from Bangalore.",
      "Accommodation for 8 nights.",
      "Japan visa.",
      "Daily breakfast at hotels.",
      "8 Indian lunches & 8 Indian dinners.",
      "Private airport transfers in Tokyo & Osaka.",
      "Vehicles for group transportation.",
      "Tokyo city tour.",
      "Tokyo Skytree admission (350m deck).",
      "Tokyo DisneySea 1-Day Passport.",
      "Mt. Fuji & Hakone tour.",
      "Hakone Ropeway ride (one way).",
      "Lake Ashi Cruise.",
      "Shinkansen (bullet train) Tokyo → Osaka, Ordinary Reserved Class.",
      "Kyoto & Nara full-day tour.",
      "Hiroshima & Miyajima guided tour.",
      "Osaka city tour.",
      "English-speaking guide throughout the tour.",
    ],
    priceExcludes: [
      "5% GST & 2% TCS (TCS is refundable in ITR).",
      "Tips for guide & driver — USD 5 per guest per day.",
      "New Year and Christmas gala dinner charges, if any.",
      "Transfers and sightseeing other than specified.",
      "Any increase in airfare, fuel surcharge or airline taxes before flight tickets are issued, irrespective of booking date.",
      "Peak-season surcharges.",
      "Any other expenses of a personal nature.",
    ],
  },

  gujarat: {
    slug: "gujarat",
    name: "Gujarat",
    title: "Gujarat — Dwarka, Somnath, Diu, Sasan Gir & Ahmedabad",
    image: "/images/destinations/somnath-temple-sunset.jpg",
    heroImages: [
      "/images/destinations/somnath-temple-sunset.jpg",
      "/images/destinations/rann-utsav-tents.jpg",
      "/images/destinations/rann-camel-caravan.jpg",
    ],
    durationLabel: "6 Nights · 7 Days",
    datesLabel: "10 – 16 December 2026",
    packageType: "Land package only",
    mealsLabel: "Breakfast & dinner included",
    fromCity: "Ahmedabad",
    placesCovered: [
      "Dwarka",
      "Porbandar",
      "Somnath",
      "Diu",
      "Sasan Gir",
      "Ahmedabad",
    ],
    genEvScore: 84,
    priceFromInr: 38400,
    whyTourWithMarzi: WHY_TOUR,
    highlights: [
      {
        term: "Two Jyotirlingas in one journey",
        description:
          "Darshan at Nageshwar and the great Somnath Jyotirlinga — two of the twelve, visited at an unhurried pace.",
      },
      {
        term: "Dwarkadhish Temple & Bet Dwarka",
        description:
          "Morning Aarti at the Dwarkadhish Temple and a gentle ferry ride from Okha to Bet Dwarka.",
      },
      {
        term: "Somnath Sound & Light Show",
        description:
          "An evening at the Somnath temple with its celebrated sound-and-light show — fully seated.",
      },
      {
        term: "Diu's beaches & Portuguese heritage",
        description:
          "Diu Fort, Naida Caves, St. Paul's Church and a sunset at Nagoa Beach — easy, compact sightseeing.",
      },
      {
        term: "Gir lion safari",
        description:
          "A safari through Gir National Park — the only home of the Asiatic lion — from the comfort of your vehicle.",
      },
      {
        term: "Senior-friendly travel",
        description:
          "Private AC tempo traveller throughout, comfortable 3★–4★ stays and assistance at every arrival and departure point.",
      },
    ],
    days: [
      {
        day: 1,
        title: "Arrive Ahmedabad — drive to Dwarka",
        stops: [
          {
            time: "On arrival",
            title: "Ahmedabad pickup & drive to Dwarka",
            description:
              "Arrive at Ahmedabad airport or railway station, where your private vehicle is waiting. Settle in for a comfortable drive to Dwarka (around 440 km) with easy breaks en route.",
          },
          {
            time: "Evening",
            title: "Check-in & optional evening Aarti",
            description:
              "Check in to your hotel in Dwarka and rest, or join the evening Aarti at the Dwarkadhish Temple if you feel up to it.",
          },
        ],
      },
      {
        day: 2,
        title: "Dwarka sightseeing",
        stops: [
          {
            time: "Morning",
            title: "Dwarkadhish Temple & Rukmini Devi Temple",
            description:
              "Begin with the morning Aarti at the Dwarkadhish Temple, followed by a visit to the Rukmini Devi Temple.",
          },
          {
            time: "Afternoon",
            title: "Nageshwar Jyotirlinga & Bet Dwarka",
            description:
              "Darshan at the Nageshwar Jyotirlinga, then a ferry ride from Okha to Bet Dwarka, with stops at Gopi Talav and Bhadkeshwar Mahadev Temple.",
          },
          {
            time: "Evening",
            title: "Leisure at Dwarka beach",
            description:
              "An easy evening by the sea or back at the temple — entirely at your own pace.",
          },
        ],
      },
      {
        day: 3,
        title: "Dwarka to Somnath via Porbandar",
        stops: [
          {
            time: "Morning",
            title: "Drive to Somnath & Kirti Mandir",
            description:
              "A comfortable drive of about 250 km via Porbandar, stopping at Kirti Mandir — the birthplace of Mahatma Gandhi.",
          },
          {
            time: "Afternoon",
            title: "Somnath Jyotirlinga Temple",
            description:
              "Check in to your hotel, then darshan at the revered Somnath Jyotirlinga Temple.",
          },
          {
            time: "Evening",
            title: "Sound & Light Show",
            description:
              "A seated evening at the temple's celebrated sound-and-light show.",
          },
        ],
      },
      {
        day: 4,
        title: "Somnath to Diu",
        stops: [
          {
            time: "Morning",
            title: "Short drive to Diu",
            description:
              "An easy 90 km drive (2–3 hours) to the island town of Diu.",
          },
          {
            time: "Afternoon",
            title: "Diu Fort, Naida Caves & St. Paul's Church",
            description:
              "Compact, gentle sightseeing of Diu's Portuguese-era fort, the Naida Caves, St. Paul's Church and the INS Khukri Memorial.",
          },
          {
            time: "Evening",
            title: "Sunset at Nagoa Beach",
            description:
              "Unwind with a relaxed sunset on Diu's most beautiful beach.",
          },
        ],
      },
      {
        day: 5,
        title: "Diu to Sasan Gir",
        stops: [
          {
            time: "Morning",
            title: "Drive to Sasan Gir",
            description:
              "A short 65 km drive (about 1.5 hours) to Sasan Gir, gateway to the last home of the Asiatic lion.",
          },
          {
            time: "Afternoon",
            title: "Gir National Park safari",
            description:
              "A safari through Gir National Park (morning or afternoon slot, subject to booking), with a visit to Devaliya Park if open.",
          },
          {
            time: "Evening",
            title: "Relax at the resort",
            description:
              "Gentle nature walks and resort activities — an easy evening in the forest air.",
          },
        ],
      },
      {
        day: 6,
        title: "Sasan Gir to Ahmedabad",
        stops: [
          {
            time: "Morning",
            title: "Drive to Ahmedabad",
            description:
              "A comfortable drive of about 375 km back to Ahmedabad, with an optional en-route stop at Junagadh — Uparkot Fort and Mahabat Maqbara — if time permits.",
          },
          {
            time: "Evening",
            title: "Check-in at Ahmedabad",
            description:
              "Arrive in Ahmedabad by evening, check in and rest.",
          },
        ],
      },
      {
        day: 7,
        title: "Ahmedabad — departure",
        stops: [
          {
            time: "Morning",
            title: "Local sightseeing & departure",
            description:
              "After a relaxed breakfast, enjoy some easy local Ahmedabad sightseeing before your onward departure.",
          },
        ],
      },
    ],
    priceIncludes: [
      "Accommodation for 6 nights in 3★–4★ hotels (Dwarka, Somnath, Diu, Sasan Gir & Ahmedabad).",
      "Daily breakfast and dinner at the hotels.",
      "Private AC tempo traveller for all transfers and sightseeing.",
      "All sightseeing as per the itinerary.",
      "Assistance at all arrival and departure points.",
      "All taxes included.",
    ],
    priceExcludes: [
      "Airfare or train fare to and from Ahmedabad (land package only).",
      "Lunches and meals other than specified.",
      "Gir safari permit and jeep charges.",
      "New Year, Christmas and Diwali gala dinner charges, if any.",
      "Transfers and sightseeing other than specified.",
      "Peak-season surcharges.",
      "Any other expenses of a personal nature.",
    ],
  },

  "sri-lanka": {
    slug: "sri-lanka",
    name: "Sri Lanka",
    title: "Sri Lanka — Kandy, Nuwara Eliya, Bentota & Colombo",
    image: "/images/destinations/sigiriya-rock-sunset.jpg",
    heroImages: [
      "/images/destinations/sigiriya-rock-sunset.jpg",
      "/images/destinations/galle-lighthouse-coast.jpg",
      "/images/destinations/ella-train-tea-country.jpg",
    ],
    durationLabel: "6 Nights · 7 Days",
    datesLabel: "16 – 22 January 2026",
    packageType: "Land package only",
    mealsLabel: "Breakfast & dinner included",
    fromCity: "Colombo",
    placesCovered: ["Kandy", "Nuwara Eliya", "Bentota", "Colombo"],
    genEvScore: 83,
    priceFromInr: 42800,
    whyTourWithMarzi: WHY_TOUR,
    highlights: [
      {
        term: "Temple of the Tooth Relic",
        description:
          "Kandy's sacred Temple of the Tooth, the Royal Botanical Garden and a traditional cultural dance show.",
      },
      {
        term: "Little England of Sri Lanka",
        description:
          "Nuwara Eliya's tea estates, waterfalls and colonial charm — Pedro Tea Factory, Gregory Lake and Victoria Park.",
      },
      {
        term: "Two relaxed nights in Bentota",
        description:
          "A Madu River boat safari, the turtle hatchery and a full leisure day on golden beaches.",
      },
      {
        term: "Pinnawala Elephant Orphanage",
        description:
          "An en-route stop to watch rescued elephants at one of the world's best-known orphanages.",
      },
      {
        term: "Colombo in a day",
        description:
          "Galle Face Green, Gangaramaya Temple, Independence Square, Lotus Tower and easy mall stops.",
      },
      {
        term: "Senior-friendly travel",
        description:
          "Private AC coach with an English-speaking guide throughout, comfortable hotels and an unhurried pace.",
      },
    ],
    days: [
      {
        day: 1,
        title: "Arrive Colombo — drive to Kandy",
        stops: [
          {
            time: "On arrival",
            title: "Airport welcome & drive to Kandy",
            description:
              "A warm welcome at Bandaranaike International Airport, then a comfortable private transfer to Kandy (about 101 km, under 3 hours).",
          },
          {
            time: "En route",
            title: "Pinnawala Elephant Orphanage",
            description:
              "Stop at the famous Pinnawala Elephant Orphanage to watch the elephants up close (entrance fee payable directly).",
          },
          {
            time: "Evening",
            title: "Check-in at Kandy",
            description:
              "Arrive in Kandy, check in to your hotel and relax for the evening.",
          },
        ],
      },
      {
        day: 2,
        title: "Kandy city tour",
        stops: [
          {
            time: "Morning",
            title: "Temple of the Tooth & Royal Botanical Garden",
            description:
              "After breakfast, visit the Temple of the Tooth Relic Museum and stroll the Royal Botanical Garden at an easy pace.",
          },
          {
            time: "Afternoon",
            title: "Spice garden, viewpoints & craft centres",
            description:
              "A spice garden with a herbal massage, Kandy View Point, the gem museum, wood-carving centre and batik factory.",
          },
          {
            time: "Evening",
            title: "Cultural dance show",
            description:
              "A seated evening performance of traditional Kandyan dance before returning to your hotel.",
          },
        ],
      },
      {
        day: 3,
        title: "Kandy to Nuwara Eliya",
        stops: [
          {
            time: "Morning",
            title: "Scenic drive to Little England",
            description:
              "Check out after breakfast and drive to Nuwara Eliya (about 76 km, 2.5 hours), stopping at Ramboda Waterfalls and the Pedro Tea Factory.",
          },
          {
            time: "Afternoon",
            title: "Nuwara Eliya city tour",
            description:
              "Victoria Park, Gregory Lake, the colonial-era post office, Seetha Amman and Hanuman temples, and a strawberry farm.",
          },
        ],
      },
      {
        day: 4,
        title: "Nuwara Eliya to Bentota",
        stops: [
          {
            time: "Morning",
            title: "Drive to the coast",
            description:
              "A comfortable private transfer to Bentota (about 211 km) with breaks en route, arriving to the beautiful coastal air.",
          },
          {
            time: "Afternoon",
            title: "Madu River boat safari & turtle hatchery",
            description:
              "A gentle boat safari on the Madu River, then the turtle hatchery and a cinnamon factory visit.",
          },
        ],
      },
      {
        day: 5,
        title: "Bentota at leisure",
        stops: [
          {
            time: "All day",
            title: "Beach day",
            description:
              "A full free day to relax by the beach, enjoy the resort or try optional water sports at your own pace.",
          },
        ],
      },
      {
        day: 6,
        title: "Bentota to Colombo",
        stops: [
          {
            time: "Morning",
            title: "Drive to Colombo",
            description:
              "Check out after breakfast for a short drive to Colombo (about 81 km, under 2 hours).",
          },
          {
            time: "Afternoon",
            title: "Colombo city tour",
            description:
              "Galle Face Green, Gangaramaya and Seema Malaka temples, Independence Square, the Red Mosque, Lotus Tower and relaxed shopping stops for Ceylon tea and handicrafts.",
          },
        ],
      },
      {
        day: 7,
        title: "Departure",
        stops: [
          {
            time: "Morning",
            title: "Check-out & airport transfer",
            description:
              "A relaxed breakfast before your private transfer to Bandaranaike International Airport (about 40 minutes) for your onward flight.",
          },
        ],
      },
    ],
    priceIncludes: [
      "Accommodation for 6 nights on double-sharing basis (Kandy, Nuwara Eliya, Bentota & Colombo).",
      "Daily breakfast and dinner at the hotels.",
      "All transfers in a private AC coach with an English-speaking tour guide.",
      "Full city tours of Kandy, Nuwara Eliya, Bentota and Colombo.",
      "One 500ml water bottle per person per day on tour.",
      "Wheelchair assistance on request & 24-hour customer care.",
    ],
    priceExcludes: [
      "Airfare to and from Colombo (land package only).",
      "Entrance fees at monuments and attractions.",
      "Lunches and meals other than specified.",
      "2% TCS (refundable in your ITR).",
      "New Year and Christmas gala dinner charges, if any.",
      "Transfers and sightseeing other than specified.",
      "Peak-season surcharges.",
      "Any other expenses of a personal nature.",
    ],
  },

  andaman: {
    slug: "andaman",
    name: "Andaman",
    title: "Andaman — Port Blair, Havelock & Neil Island",
    image: "/images/destinations/andaman-sunset-bay.jpg",
    heroImages: [
      "/images/destinations/andaman-sunset-bay.jpg",
      "/images/destinations/andaman-island-pier.jpg",
      "/images/destinations/andaman-beach-boat.jpg",
    ],
    durationLabel: "5 Nights · 6 Days",
    datesLabel: "14 – 19 February 2027",
    packageType: "Land package only",
    mealsLabel: "Breakfast & dinner included",
    fromCity: "Port Blair",
    placesCovered: ["Port Blair", "Havelock", "Neil Island"],
    genEvScore: 85,
    priceFromInr: 63000,
    whyTourWithMarzi: WHY_TOUR,
    highlights: [
      {
        term: "Radhanagar Beach",
        description:
          "Havelock's world-famous white-sand beach — consistently rated among Asia's best — with two full nights on the island.",
      },
      {
        term: "Cellular Jail Sound & Light Show",
        description:
          "The moving story of India's freedom struggle, told under the stars at the historic Cellular Jail — fully seated.",
      },
      {
        term: "Island hopping by private ferry",
        description:
          "Comfortable cruise ferries (Makruzz / Nautika class) connect Port Blair, Havelock and Neil Island — no long drives.",
      },
      {
        term: "Elephant Beach by speedboat",
        description:
          "A speedboat ride to Elephant Beach's clear waters and coral — water activities optional, at your own pace.",
      },
      {
        term: "Neil Island & the Natural Bridge",
        description:
          "Laxmanpur and Bharatpur beaches and the famous Natural Bridge rock formation on laid-back Neil Island.",
      },
      {
        term: "All permits handled",
        description:
          "Entry permits, tickets and forest permits are all arranged — 4★ stays and private vehicles throughout.",
      },
    ],
    days: [
      {
        day: 1,
        title: "Arrive Port Blair — Ross Island & Cellular Jail",
        stops: [
          {
            time: "On arrival",
            title: "Airport pickup & Ross Island",
            description:
              "Arrive at Port Blair airport and transfer to your hotel, then take a boat across to historic Ross Island.",
          },
          {
            time: "Afternoon",
            title: "Cellular Jail",
            description:
              "Visit the Cellular Jail, the poignant national memorial of India's freedom struggle.",
          },
          {
            time: "Evening",
            title: "Sound & Light Show",
            description:
              "A seated evening show at the Cellular Jail that brings its history to life.",
          },
        ],
      },
      {
        day: 2,
        title: "Ferry to Havelock — Radhanagar Beach",
        stops: [
          {
            time: "Morning",
            title: "Private ferry to Havelock",
            description:
              "After breakfast, a comfortable cruise ferry to Havelock Island (about 1.5 hours).",
          },
          {
            time: "Afternoon",
            title: "Radhanagar Beach",
            description:
              "An easy afternoon at Radhanagar Beach — white sand, turquoise water and a spectacular sunset.",
          },
        ],
      },
      {
        day: 3,
        title: "Elephant Beach",
        stops: [
          {
            time: "Morning",
            title: "Speedboat to Elephant Beach",
            description:
              "A short speedboat ride to Elephant Beach, known for its shallow coral and clear waters.",
          },
          {
            time: "Afternoon",
            title: "Beach at leisure",
            description:
              "Enjoy the beach and optional water activities at your own cost, then return to your Havelock resort.",
          },
        ],
      },
      {
        day: 4,
        title: "Ferry to Neil Island",
        stops: [
          {
            time: "Morning",
            title: "Private ferry to Neil Island",
            description:
              "After breakfast, a one-hour cruise ferry to quiet, green Neil Island.",
          },
          {
            time: "Afternoon",
            title: "Beaches & the Natural Bridge",
            description:
              "Visit Laxmanpur Beach, Bharatpur Beach and the famous Natural Bridge rock formation.",
          },
        ],
      },
      {
        day: 5,
        title: "Return to Port Blair — Chidiyatapu sunset",
        stops: [
          {
            time: "Morning",
            title: "Ferry back to Port Blair",
            description:
              "Check out and cruise back to Port Blair (about 1 hour 15 minutes).",
          },
          {
            time: "Evening",
            title: "Chidiyatapu Sunset Point",
            description:
              "Drive to Chidiyatapu, the 'bird island', for one of the Andamans' most beautiful sunsets.",
          },
        ],
      },
      {
        day: 6,
        title: "Departure",
        stops: [
          {
            time: "Morning",
            title: "Check-out & airport transfer",
            description:
              "A relaxed breakfast before your transfer to Port Blair airport for the onward journey home.",
          },
        ],
      },
    ],
    priceIncludes: [
      "5 nights in 4★ hotels on twin-sharing — Port Blair (2), Havelock (2) & Neil Island (1).",
      "Buffet breakfast and dinner daily.",
      "Private cruise ferries (Makruzz / Nautika / Green Ocean class) for all inter-island transfers.",
      "Speedboat transfers to Elephant Beach.",
      "All entry permits, tickets and forest-area permits (except camera fees).",
      "Private AC vehicle for airport, harbour and sightseeing transfers.",
    ],
    priceExcludes: [
      "Airfare to and from Port Blair (land package only).",
      "Lunches and meals other than specified.",
      "Water sports and activities at the beaches.",
      "Camera fees at monuments and parks.",
      "New Year and Christmas gala dinner charges, if any.",
      "Transfers and sightseeing other than specified.",
      "Peak-season surcharges.",
      "Any other expenses of a personal nature.",
    ],
  },
};
