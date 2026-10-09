export type MarkerCategory =
  | "food"
  | "attraction"
  | "heritage"
  | "budget"
  | "hotel"
  | "hazard";

export interface CityLocation {
  id: string;
  name: string;
  category: MarkerCategory;
  lat: number;
  lng: number;
  description: string;
  rating?: number;
  safetyScore?: number;
  priceLevel?: string;
  openNow?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
//  20 real Delhi-area locations spread across the city
// ─────────────────────────────────────────────────────────────────────────────
export const CITY_LOCATIONS: CityLocation[] = [
  // ── FOOD ─────────────────────────────────────────────────────────────────
  {
    id: "f1",
    name: "Karim's Restaurant",
    category: "food",
    lat: 28.6506,
    lng: 77.2334,
    description:
      "Legendary Mughal-era eatery near Jama Masjid serving slow-cooked mutton korma, nihari, and seekh kebabs since 1913.",
    rating: 4.8,
    safetyScore: 82,
    priceLevel: "$",
    openNow: true,
  },
  {
    id: "f2",
    name: "Paranthe Wali Gali",
    category: "food",
    lat: 28.6557,
    lng: 77.2306,
    description:
      "Famous lane in Chandni Chowk packed with century-old stalls frying stuffed parathas with 20+ fillings — a Delhi street-food icon.",
    rating: 4.7,
    safetyScore: 78,
    priceLevel: "$",
    openNow: true,
  },
  {
    id: "f3",
    name: "Indian Accent Restaurant",
    category: "food",
    lat: 28.5987,
    lng: 77.2001,
    description:
      "Award-winning fine-dining restaurant reimagining Indian classics. Consistently rated among Asia's 50 Best Restaurants.",
    rating: 4.9,
    safetyScore: 97,
    priceLevel: "$$$$",
    openNow: true,
  },
  {
    id: "f4",
    name: "Khan Market Food Street",
    category: "food",
    lat: 28.5997,
    lng: 77.2268,
    description:
      "Upscale market cluster with international cafes, fresh juice bars, artisan bakeries, and rooftop bistros.",
    rating: 4.6,
    safetyScore: 94,
    priceLevel: "$$",
    openNow: true,
  },

  // ── ATTRACTION ───────────────────────────────────────────────────────────
  {
    id: "a1",
    name: "India Gate",
    category: "attraction",
    lat: 28.6129,
    lng: 77.2295,
    description:
      "Iconic 42-metre war memorial on Rajpath, beautifully illuminated at night with lush lawns perfect for an evening stroll.",
    rating: 4.8,
    safetyScore: 96,
    openNow: true,
  },
  {
    id: "a2",
    name: "Lotus Temple",
    category: "attraction",
    lat: 28.5535,
    lng: 77.2588,
    description:
      "Stunning Bahá'í House of Worship shaped like a blooming lotus. Open to all faiths. Surrounded by serene reflecting pools.",
    rating: 4.7,
    safetyScore: 98,
    openNow: true,
  },
  {
    id: "a3",
    name: "Dilli Haat (INA)",
    category: "attraction",
    lat: 28.5729,
    lng: 77.2069,
    description:
      "Open-air crafts bazaar showcasing textiles, handicrafts, and regional cuisines from every Indian state under one roof.",
    rating: 4.5,
    safetyScore: 93,
    priceLevel: "$",
    openNow: true,
  },

  // ── HERITAGE ─────────────────────────────────────────────────────────────
  {
    id: "h1",
    name: "Red Fort (Lal Qila)",
    category: "heritage",
    lat: 28.6562,
    lng: 77.2410,
    description:
      "UNESCO World Heritage Mughal fortress built by Emperor Shah Jahan in 1638. Houses the Pearl Mosque and museum galleries.",
    rating: 4.7,
    safetyScore: 91,
    priceLevel: "$",
    openNow: true,
  },
  {
    id: "h2",
    name: "Qutub Minar",
    category: "heritage",
    lat: 28.5245,
    lng: 77.1855,
    description:
      "UNESCO-listed 73-metre brick minaret built in 1193 by Qutb ud-Din Aibak — tallest minaret in India, surrounded by ancient ruins.",
    rating: 4.8,
    safetyScore: 95,
    priceLevel: "$",
    openNow: true,
  },
  {
    id: "h3",
    name: "Humayun's Tomb",
    category: "heritage",
    lat: 28.5933,
    lng: 77.2507,
    description:
      "Magnificent 16th-century Mughal garden-tomb that served as the architectural inspiration for the Taj Mahal.",
    rating: 4.8,
    safetyScore: 93,
    priceLevel: "$",
    openNow: true,
  },
  {
    id: "h4",
    name: "Jama Masjid",
    category: "heritage",
    lat: 28.6507,
    lng: 77.2334,
    description:
      "India's largest mosque, built by Shah Jahan in 1656. Climb the south minaret for a sweeping panoramic view of Old Delhi.",
    rating: 4.6,
    safetyScore: 84,
    openNow: true,
  },
  {
    id: "h5",
    name: "Akshardham Temple",
    category: "heritage",
    lat: 28.6127,
    lng: 77.2773,
    description:
      "Breathtaking modern Hindu temple complex with intricate pink sandstone carvings, an IMAX film, and spectacular evening fountain show.",
    rating: 4.9,
    safetyScore: 98,
    openNow: true,
  },

  // ── BUDGET GEM ───────────────────────────────────────────────────────────
  {
    id: "b1",
    name: "Majnu Ka Tila (Tibetan Colony)",
    category: "budget",
    lat: 28.6867,
    lng: 77.2267,
    description:
      "Charming Tibetan refugee colony with excellent momos, thukpa noodle soup, and budget cafes. Authentic and very affordable.",
    rating: 4.6,
    safetyScore: 85,
    priceLevel: "$",
    openNow: true,
  },
  {
    id: "b2",
    name: "Paharganj Backpacker Lane",
    category: "budget",
    lat: 28.6439,
    lng: 77.2121,
    description:
      "Bustling backpacker hub near New Delhi Railway Station with cheap guesthouses, rooftop cafes, and vintage stores.",
    rating: 4.1,
    safetyScore: 71,
    priceLevel: "$",
    openNow: true,
  },
  {
    id: "b3",
    name: "Sarojini Nagar Market",
    category: "budget",
    lat: 28.5705,
    lng: 77.1952,
    description:
      "Delhi's biggest budget fashion market with export-surplus clothing, accessories, and shoes at rock-bottom prices.",
    rating: 4.4,
    safetyScore: 88,
    priceLevel: "$",
    openNow: true,
  },

  // ── HOTEL ────────────────────────────────────────────────────────────────
  {
    id: "ho1",
    name: "The Leela Palace New Delhi",
    category: "hotel",
    lat: 28.5974,
    lng: 77.2298,
    description:
      "Ultra-luxury 5-star palace hotel with opulent heritage décor, rooftop pool, Michelin-star dining, and city skyline views.",
    rating: 4.9,
    safetyScore: 99,
    priceLevel: "$$$$",
    openNow: true,
  },
  {
    id: "ho2",
    name: "Zostel Delhi Hostel",
    category: "hotel",
    lat: 28.6441,
    lng: 77.2198,
    description:
      "Top-rated social hostel chain offering clean pods, co-working terrace, communal kitchen, and free walking tours.",
    rating: 4.5,
    safetyScore: 91,
    priceLevel: "$",
    openNow: true,
  },
  {
    id: "ho3",
    name: "The Imperial Hotel",
    category: "hotel",
    lat: 28.6248,
    lng: 77.2194,
    description:
      "Colonial-era heritage luxury hotel on Janpath dating to 1931. Famous Art Deco interiors, spa, and world-class restaurants.",
    rating: 4.8,
    safetyScore: 98,
    priceLevel: "$$$",
    openNow: true,
  },

  // ── HAZARD ───────────────────────────────────────────────────────────────
  {
    id: "hz1",
    name: "Chandni Chowk Crowding Hotspot",
    category: "hazard",
    lat: 28.6506,
    lng: 77.2295,
    description:
      "Extreme pedestrian overcrowding, known pickpocket zone, and chaotic vehicular traffic. Keep valuables zipped. Avoid peak evening hours.",
    safetyScore: 44,
  },
  {
    id: "hz2",
    name: "Paharganj Lighting Outage Zone",
    category: "hazard",
    lat: 28.6445,
    lng: 77.2075,
    description:
      "Poorly lit back-alleys near the station. Several streetlights non-functional. Solo travellers should avoid after 10 PM.",
    safetyScore: 38,
  },
  {
    id: "hz3",
    name: "NH-48 Accident-Prone Stretch",
    category: "hazard",
    lat: 28.5681,
    lng: 77.1607,
    description:
      "High-speed expressway section with frequent lane-change accidents reported. No pedestrian crossings nearby. Extreme caution.",
    safetyScore: 31,
  },
];

// ─── Category config (colours + display names) ────────────────────────────────
export const CATEGORY_CONFIG: Record<
  MarkerCategory,
  { color: string; emoji: string; label: string; borderColor: string }
> = {
  food:       { color: "#f59e0b", emoji: "🍜", label: "Food & Cafes",    borderColor: "#fbbf24" },
  attraction: { color: "#3b82f6", emoji: "🌟", label: "Attractions",     borderColor: "#60a5fa" },
  heritage:   { color: "#ec4899", emoji: "🏛️", label: "Heritage Sites",  borderColor: "#f472b6" },
  budget:     { color: "#10b981", emoji: "💎", label: "Budget Gems",     borderColor: "#34d399" },
  hotel:      { color: "#8b5cf6", emoji: "🏨", label: "Hotels & Stays",  borderColor: "#a78bfa" },
  hazard:     { color: "#ef4444", emoji: "⚠️", label: "Hazard Zones",   borderColor: "#f87171" },
};
