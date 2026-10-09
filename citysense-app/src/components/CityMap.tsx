"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useCitySenseStore } from "@/lib/store";
import { CATEGORY_CONFIG, MarkerCategory } from "@/data/locations";
import { DynamicLocation, geocodeCity, fetchCityPOIs, findPresetCity } from "@/lib/citySearch";
import { Layers, ShieldAlert, Compass, Map as MapIcon, Search, Loader2, X, Navigation, Sparkles, MapPin } from "lucide-react";

// ── Satellite Icon ────────────────────────────────────────────────────────────
const SatelliteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m13 7 1.5-1.5a3.536 3.536 0 0 1 5 5L18 12" />
    <path d="m11 13-5.5 5.5a3.536 3.536 0 0 0 5 5L16 18" />
    <path d="m3 3 18 18" /><path d="m14 14-1 1" />
  </svg>
);

type MapStyle = "satellite" | "hybrid" | "street";
type LayerGroupMap = Record<MarkerCategory, any>;

// ── Build Leaflet DivIcon for any marker ──────────────────────────────────────
function buildIcon(L: any, category: MarkerCategory, isFocused = false) {
  const cfg = CATEGORY_CONFIG[category] || {
    color: "#06b6d4", emoji: "📍", label: "Place", borderColor: "#22d3ee"
  };
  const isHazard = category === "hazard";
  const size = isFocused ? 46 : 38;
  const anchor = isFocused ? 23 : 19;
  const emojiSize = isFocused ? "20px" : "16px";

  return L.divIcon({
    className: "cs-custom-pin",
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
        ${isFocused ? `<div style="position:absolute;inset:-10px;border-radius:50%;border:3px solid #38bdf8;animation:cs-focus-ring 1.2s cubic-bezier(0,0,.2,1) infinite;background:rgba(56,189,248,0.25);"></div>` : ""}
        ${isHazard && !isFocused ? `<div style="position:absolute;inset:-6px;border-radius:50%;border:2.5px solid ${cfg.color};animation:cs-ping 1.6s cubic-bezier(0,0,.2,1) infinite;opacity:.7;"></div>` : ""}
        <div style="
          width:${size - 2}px;height:${size - 2}px;border-radius:50%;
          background:${cfg.color};
          border:${isFocused ? "3.5px solid #ffffff" : `3px solid ${cfg.borderColor}`};
          box-shadow:${isFocused ? "0 0 25px rgba(56,189,248,0.9), 0 4px 16px rgba(0,0,0,0.8)" : "0 4px 14px rgba(0,0,0,.65),0 0 0 2px rgba(255,255,255,.2)"};
          display:flex;align-items:center;justify-content:center;
          font-size:${emojiSize};cursor:pointer;transition:transform .15s ease-out;
          transform:${isFocused ? "scale(1.15)" : "scale(1)"};
        " onmouseover="this.style.transform='scale(1.25)'" onmouseout="this.style.transform='${isFocused ? "scale(1.15)" : "scale(1)"}'">
          ${cfg.emoji}
        </div>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
    popupAnchor: [0, -anchor - 4],
  });
}

// ── Build rich dark-themed popup HTML ─────────────────────────────────────────
function buildPopup(loc: DynamicLocation): string {
  const cfg = CATEGORY_CONFIG[loc.category] || {
    color: "#06b6d4", emoji: "📍", label: "Place", borderColor: "#22d3ee"
  };
  
  const ratingHtml = loc.rating
    ? `<div style="display:inline-flex;align-items:center;gap:3px;background:#f59e0b18;color:#f59e0b;font-size:11px;font-weight:700;padding:2px 7px;border-radius:6px;border:1px solid #f59e0b33;">★ ${loc.rating}</div>`
    : "";

  const safetyScore = loc.safetyScore ?? (loc.category === "hazard" ? 35 : 88);
  const safetyColor = safetyScore >= 75 ? "#10b981" : safetyScore >= 50 ? "#f59e0b" : "#ef4444";
  const safetyHtml = `
    <div style="display:inline-flex;align-items:center;gap:3px;background:${safetyColor}18;color:${safetyColor};font-size:11px;font-weight:700;padding:2px 7px;border-radius:6px;border:1px solid ${safetyColor}33;">
      🛡️ Safety: ${safetyScore}/100
    </div>`;

  const priceHtml = loc.priceLevel
    ? `<span style="font-size:11px;color:#94a3b8;margin-left:auto;font-weight:600;">${loc.priceLevel}</span>`
    : "";

  return `
    <div style="min-width:220px;max-width:260px;font-family:system-ui,sans-serif;color:#f8fafc;padding:3px 1px;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
        <span style="background:${cfg.color}25;color:${cfg.color};border:1px solid ${cfg.color}55;font-size:10px;font-weight:800;letter-spacing:.05em;padding:2px 8px;border-radius:20px;text-transform:uppercase;">
          ${cfg.emoji} ${cfg.label}
        </span>
        ${priceHtml}
      </div>
      <h4 style="margin:0 0 6px;font-size:13.5px;font-weight:700;line-height:1.3;color:#ffffff;">${loc.name}</h4>
      <p style="margin:0 0 8px;font-size:11.5px;color:#94a3b8;line-height:1.45;">${loc.description.slice(0, 140)}${loc.description.length > 140 ? "…" : ""}</p>
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding-top:4px;border-top:1px solid #334155;">
        ${ratingHtml}
        ${safetyHtml}
      </div>
    </div>`;
}

// ── Quick City Chips ──────────────────────────────────────────────────────────
const POPULAR_CITIES = [
  { name: "Delhi", label: "Delhi 🇮🇳" },
  { name: "Mumbai", label: "Mumbai 🇮🇳" },
  { name: "Bengaluru", label: "Bengaluru 🇮🇳" },
  { name: "Tokyo", label: "Tokyo 🇯🇵" },
  { name: "Paris", label: "Paris 🇫🇷" },
  { name: "New York", label: "New York 🇺🇸" },
  { name: "London", label: "London 🇬🇧" },
  { name: "Dubai", label: "Dubai 🇦🇪" },
];

interface CityMapProps {
  initialLat?: number;
  initialLng?: number;
  initialZoom?: number;
}

export const CityMap: React.FC<CityMapProps> = ({ initialLat, initialLng, initialZoom }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerGroupsRef = useRef<Partial<LayerGroupMap>>({});
  const markerRegistryRef = useRef<Map<string, { marker: any; loc: DynamicLocation }>>(new Map());
  const highlightLayerRef = useRef<any>(null);
  const trafficLayerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);

  const [isReady, setIsReady] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>("satellite");

  // Search state
  const [searchInput, setSearchInput] = useState("Delhi, India");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [poiCount, setPoiCount] = useState(0);

  // Category visibility
  const [visible, setVisible] = useState<Record<MarkerCategory, boolean>>({
    food: true,
    attraction: true,
    heritage: true,
    budget: true,
    hotel: true,
    hazard: true,
  });

  const {
    currentCity,
    setCurrentCity,
    setCurrentCityCoords,
    showSafetyOverlay,
    toggleSafetyOverlay,
    showHeritageOverlay,
    toggleHeritageOverlay,
    showTrafficOverlay,
    toggleTrafficOverlay,
    activeRoute,
    activeTab,
    citySearchTarget,
    focusedLocation,
  } = useCitySenseStore();

  // ── Render locations into per-category LayerGroups ──────────────────────────
  const renderLocationsIntoGroups = useCallback(async (locations: DynamicLocation[]) => {
    if (!mapRef.current) return 0;
    const L = (await import("leaflet")).default;
    const groups = layerGroupsRef.current;

    // 1. Clear existing markers and registry
    for (const g of Object.values(groups)) {
      if (g) g.clearLayers();
    }
    if (trafficLayerRef.current) {
      trafficLayerRef.current.clearLayers();
    }
    if (highlightLayerRef.current) {
      highlightLayerRef.current.clearLayers();
    }
    markerRegistryRef.current.clear();

    let count = 0;
    for (const loc of locations) {
      const group = groups[loc.category];
      if (!group) continue;

      const icon = buildIcon(L, loc.category);
      const marker = L.marker([loc.lat, loc.lng], { icon });
      marker.bindPopup(buildPopup(loc), { maxWidth: 280, className: "cs-popup" });

      // Hazard animated perimeter circle
      if (loc.category === "hazard") {
        const cfg = CATEGORY_CONFIG.hazard;
        L.circle([loc.lat, loc.lng], {
          radius: 350,
          color: cfg.color,
          fillColor: cfg.color,
          fillOpacity: 0.15,
          weight: 1.5,
          dashArray: "4,4",
        }).addTo(group);
      }

      group.addLayer(marker);

      // Register marker for click-to-map lookups
      if (loc.id) markerRegistryRef.current.set(loc.id, { marker, loc });
      markerRegistryRef.current.set(`${loc.lat.toFixed(4)},${loc.lng.toFixed(4)}`, { marker, loc });
      markerRegistryRef.current.set(loc.name.toLowerCase().trim(), { marker, loc });

      count++;
    }

    // Add visual traffic corridors if locations exist
    if (trafficLayerRef.current && locations.length >= 4) {
      const topLocations = locations.slice(0, 5);
      const latlngs = topLocations.map((l) => [l.lat, l.lng]);
      L.polyline(latlngs, {
        color: "#06b6d4",
        weight: 4,
        opacity: 0.6,
        dashArray: "8, 8",
      }).addTo(trafficLayerRef.current);
    }

    return count;
  }, []);

  // ── Main Search Handler ─────────────────────────────────────────────────────
  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim() || !mapRef.current) return;
      setIsSearching(true);
      setSearchError(null);

      try {
        // 1. Geocode
        const geocoded = await geocodeCity(query);
        if (!geocoded) {
          setSearchError(`Could not find "${query}". Please check spelling.`);
          setIsSearching(false);
          return;
        }

        const map = mapRef.current;

        // 2. Fly map to city coordinates
        map.flyTo([geocoded.lat, geocoded.lng], 13, {
          animate: true,
          duration: 1.4,
        });

        // 3. Fetch POIs across all 6 categories (Preset, OSM, + Realistic Generator)
        const pois = await fetchCityPOIs(geocoded.name, geocoded.lat, geocoded.lng, 6000);

        // 4. Clear & Render new markers
        const count = await renderLocationsIntoGroups(pois);
        setPoiCount(count);

        // 5. Update global store
        const formattedCityName = geocoded.country
          ? `${geocoded.name}, ${geocoded.country}`
          : geocoded.displayName.split(",").slice(0, 2).join(",").trim();

        setCurrentCity(formattedCityName);
        setCurrentCityCoords([geocoded.lat, geocoded.lng]);
        setSearchInput(formattedCityName);
      } catch (err) {
        setSearchError("Failed to load city data. Please try again.");
      } finally {
        setIsSearching(false);
      }
    },
    [renderLocationsIntoGroups, setCurrentCity, setCurrentCityCoords]
  );

  // ── 1. Map Initialization (Leaflet Dynamic Import) ──────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current || mapRef.current) return;
    let alive = true;

    (async () => {
      const L = (await import("leaflet")).default;

      // Default Delhi coordinates or passed props
      const startCenter: [number, number] = [
        initialLat ?? 28.6139,
        initialLng ?? 77.209,
      ];
      const startZoom = initialZoom ?? 12;

      if (mapContainerRef.current) {
        if ((mapContainerRef.current as any)._leaflet_id) {
          (mapContainerRef.current as any)._leaflet_id = undefined;
        }
      }

      const map = L.map(mapContainerRef.current!, {
        center: startCenter,
        zoom: startZoom,
        zoomControl: false,
      });

      // Basemap Tile Layers
      const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar", maxZoom: 19 }
      );
      const labelsOverlay = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; Esri", maxZoom: 19, opacity: 0.85 }
      );
      const street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });

      satellite.addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Create LayerGroups for all 6 categories
      const cats: MarkerCategory[] = ["food", "attraction", "heritage", "budget", "hotel", "hazard"];
      const groups: Partial<LayerGroupMap> = {};
      for (const cat of cats) {
        groups[cat] = L.layerGroup().addTo(map);
      }
      highlightLayerRef.current = L.layerGroup().addTo(map);
      trafficLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);

      (map as any)._cs = { satellite, labelsOverlay, street, groups };
      mapRef.current = map;
      layerGroupsRef.current = groups;

      // Load initial default Delhi preset markers
      const initialLocations = PRESET_CITIES.delhi.locations;
      renderLocationsIntoGroups(initialLocations).then((c) => {
        if (alive) setPoiCount(c);
      });

      if (alive) setIsReady(true);
    })();

    return () => {
      alive = false;
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch {}
        mapRef.current = null;
      }
      if (mapContainerRef.current) {
        (mapContainerRef.current as any)._leaflet_id = undefined;
      }
    };
  }, [renderLocationsIntoGroups, initialLat, initialLng, initialZoom]);

  // ── 2. Click-to-Map Focus Listener ──────────────────────────────────────────
  useEffect(() => {
    if (!isReady || !mapRef.current || !focusedLocation) return;
    const map = mapRef.current;
    const { lat, lng, category, name, id, description, rating, safetyScore, priceLevel } = focusedLocation;

    // 1. Ensure the category layer is active & visible
    if (category) {
      setVisible((v) => ({ ...v, [category]: true }));
      if (category === "hazard" && !showSafetyOverlay) toggleSafetyOverlay();
      if (category === "heritage" && !showHeritageOverlay) toggleHeritageOverlay();
    }

    // 2. Fly map to place with close zoom (16)
    map.flyTo([lat, lng], 16, {
      animate: true,
      duration: 1.2,
    });

    // 3. Highlight pulse layer & open popup
    import("leaflet").then(({ default: L }) => {
      if (highlightLayerRef.current) {
        highlightLayerRef.current.clearLayers();

        // Pulsing radar highlight circle on the map
        const pulseCircle = L.circle([lat, lng], {
          radius: 140,
          color: "#38bdf8",
          fillColor: "#06b6d4",
          fillOpacity: 0.35,
          weight: 3,
        }).addTo(highlightLayerRef.current);

        // Auto remove pulse after 6 seconds to keep map clean
        setTimeout(() => {
          if (highlightLayerRef.current && highlightLayerRef.current.hasLayer(pulseCircle)) {
            highlightLayerRef.current.removeLayer(pulseCircle);
          }
        }, 6000);
      }

      // Find existing marker by id / coords / name
      let foundEntry: { marker: any; loc: DynamicLocation } | null = null;
      const keyId = id || "";
      const keyCoords = `${lat.toFixed(4)},${lng.toFixed(4)}`;
      const keyName = (name || "").toLowerCase().trim();

      if (keyId && markerRegistryRef.current.has(keyId)) {
        foundEntry = markerRegistryRef.current.get(keyId)!;
      } else if (markerRegistryRef.current.has(keyCoords)) {
        foundEntry = markerRegistryRef.current.get(keyCoords)!;
      } else {
        for (const [key, val] of markerRegistryRef.current.entries()) {
          if (key.includes(keyName) || keyName.includes(key)) {
            foundEntry = val;
            break;
          }
        }
      }

      if (foundEntry) {
        setTimeout(() => {
          foundEntry!.marker.openPopup();
        }, 400);
      } else {
        // Dynamically create and highlight marker on the fly
        const cat = category || "attraction";
        const locObj: DynamicLocation = {
          id: id || `focus-${Date.now()}`,
          name: name || "Selected Location",
          category: cat,
          lat,
          lng,
          description: description || "Verified location on the CitySense smart map.",
          rating,
          safetyScore,
          priceLevel,
        };

        const customIcon = buildIcon(L, cat, true);
        const focusMarker = L.marker([lat, lng], { icon: customIcon });
        focusMarker.bindPopup(buildPopup(locObj), { maxWidth: 280, className: "cs-popup" });

        if (highlightLayerRef.current) {
          highlightLayerRef.current.addLayer(focusMarker);
          setTimeout(() => {
            focusMarker.openPopup();
          }, 400);
        }
      }
    });
  }, [focusedLocation, isReady, showSafetyOverlay, showHeritageOverlay, toggleSafetyOverlay, toggleHeritageOverlay]);

  // ── 3. Handle External Search Trigger from Store ────────────────────────────
  useEffect(() => {
    if (citySearchTarget && isReady) {
      handleSearch(citySearchTarget);
    }
  }, [citySearchTarget, isReady, handleSearch]);

  // ── 4. Base Tile Switcher ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    const { satellite, labelsOverlay, street } = mapRef.current._cs;
    const map = mapRef.current;
    map.removeLayer(satellite);
    map.removeLayer(labelsOverlay);
    map.removeLayer(street);

    if (mapStyle === "satellite") {
      satellite.addTo(map);
    } else if (mapStyle === "hybrid") {
      satellite.addTo(map);
      labelsOverlay.addTo(map);
    } else {
      street.addTo(map);
    }
  }, [mapStyle, isReady]);

  // ── 5. Dynamic Layer Visibility Sync ────────────────────────────────────────
  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    const map = mapRef.current;
    const groups = layerGroupsRef.current;

    const eff: Record<MarkerCategory, boolean> = {
      food: visible.food,
      attraction: visible.attraction,
      heritage: showHeritageOverlay && visible.heritage,
      budget: visible.budget,
      hotel: visible.hotel,
      hazard: showSafetyOverlay && visible.hazard,
    };

    for (const [cat, show] of Object.entries(eff) as [MarkerCategory, boolean][]) {
      const g = groups[cat];
      if (!g) continue;
      if (show && !map.hasLayer(g)) map.addLayer(g);
      if (!show && map.hasLayer(g)) map.removeLayer(g);
    }

    // Traffic layer sync
    if (trafficLayerRef.current) {
      if (showTrafficOverlay && !map.hasLayer(trafficLayerRef.current)) {
        map.addLayer(trafficLayerRef.current);
      } else if (!showTrafficOverlay && map.hasLayer(trafficLayerRef.current)) {
        map.removeLayer(trafficLayerRef.current);
      }
    }
  }, [visible, showSafetyOverlay, showHeritageOverlay, showTrafficOverlay, isReady]);

  // ── 6. Safe Route Polyline Sync ─────────────────────────────────────────────
  useEffect(() => {
    if (!isReady || !mapRef.current || !routeLayerRef.current) return;
    import("leaflet").then(({ default: L }) => {
      routeLayerRef.current.clearLayers();
      if (!activeRoute || !activeRoute.waypoints || activeRoute.waypoints.length === 0) return;

      // Color mapping: Green for Highest Safety, Orange for Quickest, Blue for Scenic
      const color =
        activeRoute.type === "safest"
          ? "#10b981"
          : activeRoute.type === "fastest"
          ? "#f97316"
          : "#3b82f6";

      // 1. Glowing outer halo polyline
      L.polyline(activeRoute.waypoints, {
        color,
        weight: 14,
        opacity: 0.28,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(routeLayerRef.current);

      // 2. Crisp main polyline
      const mainLine = L.polyline(activeRoute.waypoints, {
        color,
        weight: 6,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
        dashArray: activeRoute.type === "fastest" ? "12,8" : undefined,
      }).addTo(routeLayerRef.current);

      // 3. Start (A) Marker
      const startCoord = activeRoute.waypoints[0];
      const endCoord = activeRoute.waypoints[activeRoute.waypoints.length - 1];

      const mkA = L.divIcon({
        className: "cs-route-pin",
        html: `
          <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid #10b981;animation:cs-ping 1.8s infinite;opacity:.7;"></div>
            <div style="background:#10b981;color:#ffffff;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;border:3px solid #ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.6);">
              A
            </div>
          </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const mkB = L.divIcon({
        className: "cs-route-pin",
        html: `
          <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid #ef4444;animation:cs-ping 1.8s infinite;opacity:.7;"></div>
            <div style="background:#ef4444;color:#ffffff;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;border:3px solid #ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.6);">
              B
            </div>
          </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const markerStart = L.marker(startCoord, { icon: mkA }).addTo(routeLayerRef.current);
      markerStart.bindPopup(
        `<div style="font-family:system-ui;color:#f8fafc;padding:2px 4px;"><strong style="color:#10b981;">📍 Route Origin (A)</strong><br/><span style="font-size:11px;color:#94a3b8;">Start of ${activeRoute.name}</span></div>`,
        { className: "cs-popup" }
      );

      const markerEnd = L.marker(endCoord, { icon: mkB }).addTo(routeLayerRef.current);
      markerEnd.bindPopup(
        `<div style="font-family:system-ui;color:#f8fafc;padding:2px 4px;"><strong style="color:#ef4444;">🏁 Destination (B)</strong><br/><span style="font-size:11px;color:#94a3b8;">Distance: ${activeRoute.distanceKm} km • ${activeRoute.durationMinutes} mins</span></div>`,
        { className: "cs-popup" }
      );

      // 4. Always auto-zoom / fit bounds to the route
      try {
        const bounds = mainLine.getBounds();
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds, {
            padding: [60, 60],
            maxZoom: 16,
            animate: true,
            duration: 0.9,
          });
        }
      } catch {}
    });
  }, [activeRoute, isReady]);

  // ── Toggle Helpers ──────────────────────────────────────────────────────────
  const toggleCat = (cat: MarkerCategory) =>
    setVisible((v) => ({ ...v, [cat]: !v[cat] }));

  return (
    <div
      id="city-map-container"
      className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl flex flex-col scroll-mt-24"
    >
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      {/* Global Map & Popup Styling */}
      <style>{`
        @keyframes cs-ping {
          0% { transform: scale(1); opacity: .75; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes cs-focus-ring {
          0% { transform: scale(0.9); opacity: 0.9; }
          50% { transform: scale(1.6); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .cs-popup .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          border: 1px solid #334155 !important;
          border-radius: 14px !important;
          box-shadow: 0 12px 30px rgba(0,0,0,.75) !important;
        }
        .cs-popup .leaflet-popup-tip {
          background: #0f172a !important;
        }
        .cs-popup .leaflet-popup-close-button {
          color: #94a3b8 !important;
          font-size: 18px !important;
          padding: 6px 8px !important;
        }
      `}</style>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px] z-0 flex-1" />

      {/* ── Search Bar & Quick Chips (top center) ──────────────────────── */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-3 space-y-1.5">
        <div className="flex items-center gap-2 bg-slate-950/95 backdrop-blur-md border border-slate-700 rounded-2xl px-3 py-2 shadow-2xl">
          <Navigation className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchInput)}
            placeholder="Search any city: Mumbai, Tokyo, Paris, New York…"
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none min-w-0"
          />
          {searchInput && !isSearching && (
            <button
              onClick={() => setSearchInput("")}
              className="text-slate-500 hover:text-slate-300"
              title="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => handleSearch(searchInput)}
            disabled={isSearching}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-60 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-md shrink-0"
          >
            {isSearching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>{isSearching ? "Flying…" : "Fly To"}</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 justify-center">
          {POPULAR_CITIES.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                setSearchInput(c.name);
                handleSearch(c.name);
              }}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-all shadow-sm"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Status / Active Info Pill */}
        {(searchError || (!isSearching && currentCity)) && (
          <div
            className={`text-center text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-md transition-all shadow-sm ${
              searchError
                ? "bg-rose-950/80 text-rose-300 border border-rose-800"
                : "bg-slate-950/85 text-cyan-300 border border-slate-700"
            }`}
          >
            {searchError || `📍 ${currentCity} • ${poiCount} smart points loaded`}
          </div>
        )}
      </div>

      {/* ── Layer Toggles (top-left) ────────────────────────────────────── */}
      <div className="absolute top-28 left-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={() => {
            toggleSafetyOverlay();
            toggleCat("hazard");
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-all shadow-md ${
            showSafetyOverlay
              ? "bg-rose-500/90 text-white ring-1 ring-rose-400"
              : "bg-slate-900/85 text-slate-300 border border-slate-700 hover:text-white"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-200" />
          <span>Safety Hazards</span>
        </button>

        <button
          onClick={() => {
            toggleHeritageOverlay();
            toggleCat("heritage");
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-all shadow-md ${
            showHeritageOverlay
              ? "bg-pink-600/90 text-white ring-1 ring-pink-400"
              : "bg-slate-900/85 text-slate-300 border border-slate-700 hover:text-white"
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-pink-200" />
          <span>Heritage Pins</span>
        </button>

        <button
          onClick={() => toggleTrafficOverlay()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-all shadow-md ${
            showTrafficOverlay
              ? "bg-cyan-600/90 text-white ring-1 ring-cyan-400"
              : "bg-slate-900/85 text-slate-300 border border-slate-700 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-200" />
          <span>Live Traffic</span>
        </button>
      </div>

      {/* ── Map Style Selector (top-right) ──────────────────────────────── */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-slate-950/90 backdrop-blur-md border border-slate-700 rounded-xl p-1 shadow-lg">
        {[
          { id: "satellite" as MapStyle, label: "Satellite", icon: <SatelliteIcon /> },
          { id: "hybrid" as MapStyle, label: "Hybrid", icon: <Layers className="w-3.5 h-3.5" /> },
          { id: "street" as MapStyle, label: "Street", icon: <MapIcon className="w-3.5 h-3.5" /> },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setMapStyle(s.id)}
            title={s.label}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              mapStyle === s.id
                ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            }`}
          >
            {s.icon}
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* ── Category Legend & Visibility Controls (bottom-left) ─────────── */}
      <div className="absolute bottom-10 left-3 z-10 flex flex-wrap gap-1.5 px-3 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-lg max-w-[calc(100%-1.5rem)]">
        {(
          Object.entries(CATEGORY_CONFIG) as [
            MarkerCategory,
            (typeof CATEGORY_CONFIG)[MarkerCategory]
          ][]
        ).map(([cat, cfg]) => (
          <button
            key={cat}
            onClick={() => toggleCat(cat)}
            title={`Toggle ${cfg.label}`}
            className={`flex items-center gap-1.5 text-[11px] font-medium rounded-lg px-2.5 py-1 transition-all border ${
              visible[cat]
                ? "text-slate-200 border-transparent shadow-sm"
                : "text-slate-500 border-slate-800 line-through opacity-50"
            }`}
            style={
              visible[cat]
                ? { borderColor: cfg.color + "66", background: cfg.color + "20" }
                : {}
            }
          >
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
              style={{ background: cfg.color }}
            />
            <span>{cfg.label}</span>
          </button>
        ))}
      </div>

      {/* ── Search Loading Overlay ──────────────────────────────────────── */}
      {isSearching && (
        <div className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-2xl flex flex-col items-center gap-3">
            <Loader2 className="w-9 h-9 text-cyan-400 animate-spin" />
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Calibrating City Intelligence…</span>
            </div>
            <div className="text-xs text-slate-400">
              Querying OpenStreetMap, Geocoder & Generating Verified Markers
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
