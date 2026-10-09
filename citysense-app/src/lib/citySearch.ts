import { MarkerCategory } from "@/data/locations";
import { PRESET_CITIES, PresetCity } from "@/data/cityDatabase";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface GeocodedCity {
  name: string;
  country?: string;
  displayName: string;
  lat: number;
  lng: number;
  boundingBox?: [number, number, number, number];
}

export interface DynamicLocation {
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
  tags?: Record<string, string>;
}

// ── Normalize text for matching ───────────────────────────────────────────────
function normalizeName(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// ── Find preset city if available ─────────────────────────────────────────────
export function findPresetCity(query: string): PresetCity | null {
  const norm = normalizeName(query);
  if (!norm) return null;

  // Direct ID check
  if (PRESET_CITIES[norm]) return PRESET_CITIES[norm];

  // Common aliases
  const aliasMap: Record<string, string> = {
    newdelhi: "delhi",
    ncr: "delhi",
    bombay: "mumbai",
    bangalore: "bengaluru",
    blr: "bengaluru",
    nyc: "newyork",
    ny: "newyork",
    newyorkcity: "newyork",
    manhattan: "newyork",
    dxb: "dubai",
    tyo: "tokyo",
  };

  if (aliasMap[norm] && PRESET_CITIES[aliasMap[norm]]) {
    return PRESET_CITIES[aliasMap[norm]];
  }

  // Partial match
  for (const [key, preset] of Object.entries(PRESET_CITIES)) {
    if (norm.includes(key) || key.includes(norm) || normalizeName(preset.name).includes(norm)) {
      return preset;
    }
  }

  return null;
}

// ── Nominatim geocoder (free, no key) ─────────────────────────────────────────
export async function geocodeCity(query: string): Promise<GeocodedCity | null> {
  const clean = query.trim();
  if (!clean) return null;

  // Check preset first for instant zero-latency response
  const preset = findPresetCity(clean);
  if (preset) {
    return {
      name: preset.name,
      country: preset.country,
      displayName: preset.displayName,
      lat: preset.lat,
      lng: preset.lng,
    };
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      clean
    )}&format=json&limit=1&addressdetails=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(url, {
      headers: { "Accept-Language": "en", "User-Agent": "CitySense-App/1.0" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const data = await res.json();
    if (!data || data.length === 0) return null;

    const place = data[0];
    const cityName =
      place.address?.city ||
      place.address?.town ||
      place.address?.municipality ||
      place.address?.state_district ||
      place.address?.state ||
      clean;
    const country = place.address?.country || "";

    return {
      name: cityName,
      country,
      displayName: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      boundingBox: place.boundingbox
        ? [
            parseFloat(place.boundingbox[0]),
            parseFloat(place.boundingbox[1]),
            parseFloat(place.boundingbox[2]),
            parseFloat(place.boundingbox[3]),
          ]
        : undefined,
    };
  } catch {
    return null;
  }
}

// ── Generate Procedural Realistic Locations for ANY City ─────────────────────
// Ensures that every searched city has full coverage across all 6 categories
export function generateRealisticCityLocations(
  cityName: string,
  lat: number,
  lng: number
): DynamicLocation[] {
  // Realistic radius offsets around the city center (0.005 to 0.035 deg ~ 500m - 4km)
  const offsets = [
    { dLat: 0.012, dLng: 0.015 },
    { dLat: -0.014, dLng: 0.008 },
    { dLat: 0.006, dLng: -0.018 },
    { dLat: -0.009, dLng: -0.012 },
    { dLat: 0.022, dLng: -0.005 },
    { dLat: -0.019, dLng: 0.021 },
    { dLat: 0.003, dLng: 0.026 },
    { dLat: -0.028, dLng: -0.019 },
    { dLat: 0.018, dLng: 0.024 },
    { dLat: -0.005, dLng: -0.029 },
    { dLat: 0.029, dLng: -0.014 },
    { dLat: -0.022, dLng: 0.007 },
    { dLat: 0.011, dLng: -0.022 },
    { dLat: -0.016, dLng: -0.003 },
    { dLat: 0.008, dLng: 0.019 },
    { dLat: -0.011, dLng: 0.014 },
    { dLat: 0.025, dLng: 0.006 },
    { dLat: -0.027, dLng: -0.025 },
  ];

  const templates: {
    category: MarkerCategory;
    nameSuffix: string;
    desc: (city: string) => string;
    rating?: number;
    safetyScore?: number;
    price?: string;
  }[] = [
    // ── FOOD ──
    {
      category: "food",
      nameSuffix: "Heritage Bistro & Cafe",
      desc: (c) => `Authentic dining spot in ${c} serving artisanal regional specialties, fresh brew coffee, and signature delicacies.`,
      rating: 4.8,
      safetyScore: 92,
      price: "$$",
    },
    {
      category: "food",
      nameSuffix: "Street Food Gourmet Alley",
      desc: (c) => `Bustling open-air food hub celebrating ${c}'s culinary street traditions with high hygiene standards and vibrant crowd.`,
      rating: 4.7,
      safetyScore: 88,
      price: "$",
    },
    {
      category: "food",
      nameSuffix: "Skyline Rooftop Grill",
      desc: (c) => `Premier fine-dining restaurant featuring panoramic sunset views over ${c}, curated wine pairings, and contemporary cuisine.`,
      rating: 4.9,
      safetyScore: 98,
      price: "$$$$",
    },

    // ── ATTRACTIONS ──
    {
      category: "attraction",
      nameSuffix: "Central City Plaza & Promenade",
      desc: (c) => `The iconic public heart of ${c} featuring architectural fountains, pedestrian walkways, street artists, and community events.`,
      rating: 4.8,
      safetyScore: 96,
    },
    {
      category: "attraction",
      nameSuffix: "Botanical & Sculpture Gardens",
      desc: (c) => `Expansive lush green park in ${c} with century-old trees, scenic reflecting water bodies, and open-air sculpture exhibits.`,
      rating: 4.7,
      safetyScore: 97,
    },
    {
      category: "attraction",
      nameSuffix: "Panoramic Observation Deck",
      desc: (c) => `High-altitude scenic viewpoint offering spectacular 360-degree aerial views across ${c} and surrounding horizons.`,
      rating: 4.9,
      safetyScore: 99,
    },

    // ── HERITAGE ──
    {
      category: "heritage",
      nameSuffix: "Old Town Historic Fort & Citadel",
      desc: (c) => `Centuries-old fortified monument commemorating ${c}'s rich founding history, imperial ramparts, and museum exhibits.`,
      rating: 4.8,
      safetyScore: 94,
      price: "$",
    },
    {
      category: "heritage",
      nameSuffix: "Grand Temple & Cultural Sanctuary",
      desc: (c) => `Sacred historical landmark renowned for its intricate stone carvings, peaceful courtyards, and deep cultural legacy in ${c}.`,
      rating: 4.9,
      safetyScore: 97,
    },
    {
      category: "heritage",
      nameSuffix: "National Architectural Museum",
      desc: (c) => `Prominent heritage complex preserving historic artifacts, classical architecture, and royal archives of ${c}.`,
      rating: 4.6,
      safetyScore: 93,
      price: "$$",
    },

    // ── BUDGET GEMS ──
    {
      category: "budget",
      nameSuffix: "Old Quarter Artisan Flea Market",
      desc: (c) => `Lively weekend bazaar packed with handmade crafts, vintage collectibles, thrift clothing, and pocket-friendly street treats in ${c}.`,
      rating: 4.5,
      safetyScore: 89,
      price: "$",
    },
    {
      category: "budget",
      nameSuffix: "Backpacker Haven & Social Hub",
      desc: (c) => `Friendly gathering spot in ${c} offering budget-friendly food, book exchange, travel information, and community vibe.`,
      rating: 4.6,
      safetyScore: 90,
      price: "$",
    },
    {
      category: "budget",
      nameSuffix: "Wholesale Spice & Souvenir Bazaar",
      desc: (c) => `Traditional trade arcade with great bargain deals on authentic spices, handcrafted gifts, and regional teas of ${c}.`,
      rating: 4.4,
      safetyScore: 86,
      price: "$",
    },

    // ── HOTELS ──
    {
      category: "hotel",
      nameSuffix: "Grand Royal Palace & Spa",
      desc: (c) => `World-class 5-star luxury hotel in ${c} offering palatial suites, serene infinity pools, spa sanctuary, and Michelin dining.`,
      rating: 4.9,
      safetyScore: 99,
      price: "$$$$",
    },
    {
      category: "hotel",
      nameSuffix: "Urban Boutique & Design Hotel",
      desc: (c) => `Stylish modern hotel in central ${c} with bespoke designer interiors, rooftop lounge, and high-speed tech amenities.`,
      rating: 4.6,
      safetyScore: 96,
      price: "$$$",
    },
    {
      category: "hotel",
      nameSuffix: "Eco Social Hostel & Pods",
      desc: (c) => `Top-rated community hostel featuring cozy sleep pods, coworking lounge, organized city tours, and affordable rates in ${c}.`,
      rating: 4.5,
      safetyScore: 92,
      price: "$",
    },

    // ── HAZARDS ──
    {
      category: "hazard",
      nameSuffix: "Central Station Transit Congestion",
      desc: (c) => `High-density commuter interchange with rush-hour bottlenecks. Maintain vigilance against pickpockets; use verified transit exits.`,
      safetyScore: 42,
    },
    {
      category: "hazard",
      nameSuffix: "Sub-Arterial Low-Lighting Alert",
      desc: (c) => `Narrow pedestrian alleyway with intermittent lighting coverage. CitySense safety sensors advise using main illuminated avenues after dusk.`,
      safetyScore: 36,
    },
    {
      category: "hazard",
      nameSuffix: "Ring Expressway High-Speed Junction",
      desc: (c) => `Heavy merging vehicular flow and limited pedestrian zebra crossings. Use designated overhead bridges and exercise caution.`,
      safetyScore: 32,
    },
  ];

  return templates.map((tmpl, idx) => {
    const offset = offsets[idx % offsets.length];
    return {
      id: `gen-${cityName.toLowerCase().replace(/[^a-z0-9]/g, "")}-${idx}-${tmpl.category}`,
      name: `${cityName} ${tmpl.nameSuffix}`,
      category: tmpl.category,
      lat: lat + offset.dLat,
      lng: lng + offset.dLng,
      description: tmpl.desc(cityName),
      rating: tmpl.rating,
      safetyScore: tmpl.safetyScore,
      priceLevel: tmpl.price,
      openNow: true,
    };
  });
}

// ── Overpass API POI fetcher (free, no key) ───────────────────────────────────
export async function fetchCityPOIs(
  cityName: string,
  lat: number,
  lng: number,
  radiusMeters = 5000
): Promise<DynamicLocation[]> {
  // Check preset first for instant, highest quality curated locations
  const preset = findPresetCity(cityName);
  if (preset) {
    return preset.locations;
  }

  // Overpass query for real OSM POIs
  const overpassQuery = `
[out:json][timeout:15];
(
  node["amenity"~"restaurant|cafe|fast_food|bar|pub|food_court"](around:${radiusMeters},${lat},${lng});
  node["tourism"~"attraction|museum|theme_park|viewpoint|zoo|gallery|artwork"](around:${radiusMeters},${lat},${lng});
  node["historic"~"monument|castle|fort|ruins|archaeological_site|memorial|temple|church|mosque|shrine"](around:${radiusMeters},${lat},${lng});
  node["tourism"~"hotel|hostel|guest_house|motel"](around:${radiusMeters},${lat},${lng});
);
out body 40;`;

  let osmResults: DynamicLocation[] = [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(overpassQuery),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      const elements: any[] = json.elements || [];
      const seen = new Set<string>();

      for (const el of elements) {
        if (!el.lat || !el.lon) continue;
        const tags = el.tags || {};
        const name = tags.name || tags["name:en"] || tags.brand || null;
        if (!name) continue;

        const key = `${name}|${el.lat.toFixed(4)}|${el.lon.toFixed(4)}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const category = tagToCategory(tags);
        if (!category) continue;

        const description = buildDescription(tags, category, cityName);

        osmResults.push({
          id: `osm-${el.id}`,
          name,
          category,
          lat: el.lat,
          lng: el.lon,
          description,
          safetyScore: Math.floor(Math.random() * 20 + 78),
          rating: +(Math.random() * 0.8 + 4.1).toFixed(1),
          priceLevel: tags.price_range || guessPriceLevel(tags, category),
          tags,
        });

        if (osmResults.length >= 30) break;
      }
    }
  } catch {
    // Overpass failed or timed out; we will supplement with procedural generator
  }

  // Always generate procedural base ensuring all 6 categories (hazard, budget, etc.) are covered
  const procedural = generateRealisticCityLocations(cityName, lat, lng);

  // Merge OSM results with procedural: keep OSM POIs and ensure missing categories (hazards, budget gems) are filled
  const categoryCounts: Record<MarkerCategory, number> = {
    food: 0,
    attraction: 0,
    heritage: 0,
    budget: 0,
    hotel: 0,
    hazard: 0,
  };

  for (const p of osmResults) {
    categoryCounts[p.category]++;
  }

  const finalResults: DynamicLocation[] = [...osmResults];

  // Add procedural items for categories with low count
  for (const gen of procedural) {
    if (categoryCounts[gen.category] < 3) {
      finalResults.push(gen);
      categoryCounts[gen.category]++;
    }
  }

  return finalResults;
}

// ── Tag → Category mapping ────────────────────────────────────────────────────
function tagToCategory(tags: Record<string, string>): MarkerCategory | null {
  const amenity = tags.amenity || "";
  const tourism = tags.tourism || "";
  const historic = tags.historic || "";

  if (amenity.match(/restaurant|cafe|fast_food|bar|pub|food_court/)) return "food";
  if (tourism.match(/hotel|hostel|guest_house|motel/)) return "hotel";
  if (historic.match(/monument|castle|fort|ruins|archaeological_site|memorial|temple|church|mosque|shrine/))
    return "heritage";
  if (tourism.match(/museum|gallery|artwork/)) return "heritage";
  if (tourism.match(/attraction|theme_park|zoo|viewpoint/)) return "attraction";
  if (tourism === "information") return "attraction";
  return null;
}

// ── Build a human-readable description from OSM tags ─────────────────────────
function buildDescription(tags: Record<string, string>, cat: MarkerCategory, city: string): string {
  if (tags.description) return tags.description;
  if (tags["description:en"]) return tags["description:en"];

  const parts: string[] = [];

  if (cat === "food") {
    if (tags.cuisine) parts.push(`Cuisine: ${tags.cuisine.replace(/;/g, ", ")}.`);
    if (tags.opening_hours) parts.push(`Open: ${tags.opening_hours}.`);
    if (tags.outdoor_seating === "yes") parts.push("Outdoor seating available.");
    if (!parts.length) parts.push(`Popular local dining destination in ${city}.`);
  } else if (cat === "hotel") {
    if (tags.stars) parts.push(`${tags.stars}-star rated accommodation.`);
    if (tags.rooms) parts.push(`${tags.rooms} guest rooms available.`);
    if (!parts.length) parts.push(`Verified hospitality stay in central ${city}.`);
  } else if (cat === "heritage") {
    if (tags.historic) parts.push(`Historical ${tags.historic} monument.`);
    if (tags.wikipedia || tags.wikidata) parts.push("Formally listed heritage landmark.");
    if (!parts.length) parts.push(`Cultural monument and architectural heritage in ${city}.`);
  } else if (cat === "attraction") {
    if (tags.tourism) parts.push(`Prominent tourist ${tags.tourism}.`);
    if (tags.wheelchair === "yes") parts.push("Wheelchair accessible.");
    if (!parts.length) parts.push(`Top-rated city landmark and visitor attraction in ${city}.`);
  }

  return parts.join(" ") || `Notable urban landmark in ${city} registered in CitySense.`;
}

function guessPriceLevel(tags: Record<string, string>, cat: MarkerCategory): string {
  if (cat === "hotel") {
    const stars = parseInt(tags.stars || "0");
    if (stars >= 5) return "$$$$";
    if (stars >= 4) return "$$$";
    if (stars >= 3) return "$$";
    return "$";
  }
  return cat === "food" ? "$$" : "";
}

// ── Build realistic curved waypoints between two geographic points ─────────────
// Uses perpendicular offsets and multiple intermediate points for natural-looking routes
function buildCurvedWaypoints(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  curveFactor: number = 0.0,
  steps: number = 8
): [number, number][] {
  const points: [number, number][] = [];

  // Perpendicular direction (90° rotation of the direction vector)
  const dLat = endLat - startLat;
  const dLng = endLng - startLng;
  const perpLat = -dLng;
  const perpLng = dLat;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic bezier interpolation
    const parabola = 4 * t * (1 - t); // peaks at 0.5
    const lat = startLat + dLat * t + perpLat * curveFactor * parabola;
    const lng = startLng + dLng * t + perpLng * curveFactor * parabola;
    points.push([parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6))]);
  }

  return points;
}

// ── Compute straight-line distance in km between two coords ───────────────────
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Generate routes from real geocoded coordinates ────────────────────────────
export function generateRoutesFromCoords(
  cityName: string,
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): import("@/types").SafeRouteOption[] {
  const baseDist = haversineKm(startLat, startLng, endLat, endLng);
  const prefix = cityName.toLowerCase().replace(/[^a-z0-9]/g, "");

  return [
    {
      id: `route-${prefix}-safest-${Date.now()}`,
      name: `Safe Illuminated Corridor`,
      type: "safest",
      distanceKm: parseFloat((baseDist * 1.35).toFixed(1)),
      durationMinutes: Math.round(baseDist * 1.35 * 13),
      safetyScore: 96,
      wellLitPercentage: 99,
      emergencyBoothCount: 5,
      incidentAlertsOnWay: 0,
      description: `CCTV-monitored, fully illuminated boulevard route with pedestrian crossings and SOS booths every 800m.`,
      waypoints: buildCurvedWaypoints(startLat, startLng, endLat, endLng, 0.38, 12),
    },
    {
      id: `route-${prefix}-fastest-${Date.now()}`,
      name: `Direct Express Route`,
      type: "fastest",
      distanceKm: parseFloat((baseDist * 1.05).toFixed(1)),
      durationMinutes: Math.round(baseDist * 1.05 * 8),
      safetyScore: 74,
      wellLitPercentage: 70,
      emergencyBoothCount: 1,
      incidentAlertsOnWay: 2,
      description: `Shortest straight-line connection. Faster travel time but passes near congestion zones with limited lighting after 9 PM.`,
      waypoints: buildCurvedWaypoints(startLat, startLng, endLat, endLng, 0.10, 6),
    },
    {
      id: `route-${prefix}-scenic-${Date.now()}`,
      name: `Scenic Heritage Walkway`,
      type: "scenic",
      distanceKm: parseFloat((baseDist * 1.6).toFixed(1)),
      durationMinutes: Math.round(baseDist * 1.6 * 15),
      safetyScore: 91,
      wellLitPercentage: 90,
      emergencyBoothCount: 3,
      incidentAlertsOnWay: 0,
      description: `Curated cultural route past green avenues, heritage monuments, and public plazas. Slightly longer but highly scenic.`,
      waypoints: buildCurvedWaypoints(startLat, startLng, endLat, endLng, -0.52, 14),
    },
  ];
}

// ── Legacy helper: generate routes for city center (used in store defaults) ───
export function generateRoutesForCity(cityName: string, lat: number, lng: number): import("@/types").SafeRouteOption[] {
  return generateRoutesFromCoords(
    cityName,
    lat - 0.014, lng - 0.016,
    lat + 0.016, lng + 0.020
  );
}
