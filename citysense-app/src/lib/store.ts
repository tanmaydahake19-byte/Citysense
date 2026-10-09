import { create } from "zustand";
import { Place, SafetyIncident, NeighborhoodStats, CitizenReport, SafeRouteOption, WeatherInsight, AIChatMessage, PlaceCategory } from "@/types";
import { MarkerCategory } from "@/data/locations";
import { MOCK_PLACES, MOCK_SAFETY_INCIDENTS, MOCK_NEIGHBORHOODS, MOCK_CITIZEN_REPORTS, MOCK_SAFE_ROUTES, INITIAL_WEATHER } from "@/data/mockData";

export type NavTab = 'explore' | 'safety' | 'matrix' | 'feed' | 'routes';

interface CitySenseState {
  // Navigation & Views
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Filter States
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: 'all' | PlaceCategory;
  setSelectedCategory: (cat: 'all' | PlaceCategory) => void;
  selectedPrice: 'all' | '$' | '$$' | '$$$' | '$$$$';
  setSelectedPrice: (price: 'all' | '$' | '$$' | '$$$' | '$$$$') => void;
  minSafetyScore: number;
  setMinSafetyScore: (score: number) => void;

  // Map Layer Toggles
  showSafetyOverlay: boolean;
  toggleSafetyOverlay: () => void;
  showTrafficOverlay: boolean;
  toggleTrafficOverlay: () => void;
  showHeritageOverlay: boolean;
  toggleHeritageOverlay: () => void;

  // Focus & Navigation Target
  focusedLocation: {
    lat: number;
    lng: number;
    id?: string;
    name: string;
    category?: MarkerCategory;
    description?: string;
    rating?: number;
    safetyScore?: number;
    priceLevel?: string;
  } | null;
  setFocusedLocation: (loc: CitySenseState['focusedLocation']) => void;
  focusOnLocation: (loc: NonNullable<CitySenseState['focusedLocation']>) => void;

  // Selected Entities
  selectedPlace: Place | null;
  setSelectedPlace: (place: Place | null) => void;
  selectedIncident: SafetyIncident | null;
  setSelectedIncident: (incident: SafetyIncident | null) => void;
  selectedNeighborhood: NeighborhoodStats;
  setSelectedNeighborhood: (nb: NeighborhoodStats) => void;
  activeRoute: SafeRouteOption | null;
  setActiveRoute: (route: SafeRouteOption | null) => void;

  // City & Geo State
  currentCity: string;
  setCurrentCity: (city: string) => void;
  currentCityCoords: [number, number];
  setCurrentCityCoords: (coords: [number, number]) => void;
  citySearchTarget: string | null;
  triggerCitySearch: (city: string) => void;

  // Modals
  isSOSOpen: boolean;
  setSOSOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setReportModalOpen: (open: boolean) => void;
  isAIChatOpen: boolean;
  setAIChatOpen: (open: boolean) => void;

  // Data Collections
  places: Place[];
  setPlaces: (places: Place[]) => void;
  incidents: SafetyIncident[];
  citizenReports: CitizenReport[];
  neighborhoods: NeighborhoodStats[];
  routes: SafeRouteOption[];
  weather: WeatherInsight;

  // Actions
  addCitizenReport: (report: CitizenReport) => void;
  addSafetyIncident: (incident: SafetyIncident) => void;
  upvoteIncident: (id: string) => void;
  likeReport: (id: string) => void;

  // AI Chat
  chatMessages: AIChatMessage[];
  addChatMessage: (msg: AIChatMessage) => void;
}

export const useCitySenseStore = create<CitySenseState>((set) => ({
  activeTab: 'explore',
  setActiveTab: (tab) => set({ activeTab: tab }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCategory: 'all',
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  selectedPrice: 'all',
  setSelectedPrice: (price) => set({ selectedPrice: price }),
  minSafetyScore: 0,
  setMinSafetyScore: (score) => set({ minSafetyScore: score }),

  showSafetyOverlay: true,
  toggleSafetyOverlay: () => set((s) => ({ showSafetyOverlay: !s.showSafetyOverlay })),
  showTrafficOverlay: true,
  toggleTrafficOverlay: () => set((s) => ({ showTrafficOverlay: !s.showTrafficOverlay })),
  showHeritageOverlay: true,
  toggleHeritageOverlay: () => set((s) => ({ showHeritageOverlay: !s.showHeritageOverlay })),

  focusedLocation: null,
  setFocusedLocation: (loc) => set({ focusedLocation: loc }),
  focusOnLocation: (loc) => {
    set({ focusedLocation: { ...loc } });
    if (typeof window !== "undefined") {
      const mapEl = document.getElementById("city-map-container");
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  },

  selectedPlace: null,
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  selectedIncident: null,
  setSelectedIncident: (incident) => set({ selectedIncident: incident }),
  selectedNeighborhood: MOCK_NEIGHBORHOODS[0],
  setSelectedNeighborhood: (nb) => set({ selectedNeighborhood: nb }),
  activeRoute: MOCK_SAFE_ROUTES[0],
  setActiveRoute: (route) => set({ activeRoute: route }),

  currentCity: "Delhi, India",
  setCurrentCity: (city) => set({ currentCity: city }),
  currentCityCoords: [28.6139, 77.2090],
  setCurrentCityCoords: (coords) => set({ currentCityCoords: coords }),
  citySearchTarget: null,
  triggerCitySearch: (city) => set({ citySearchTarget: city }),

  isSOSOpen: false,
  setSOSOpen: (open) => set({ isSOSOpen: open }),
  isReportModalOpen: false,
  setReportModalOpen: (open) => set({ isReportModalOpen: open }),
  isAIChatOpen: false,
  setAIChatOpen: (open) => set({ isAIChatOpen: open }),

  places: MOCK_PLACES,
  setPlaces: (places) => set({ places }),
  incidents: MOCK_SAFETY_INCIDENTS,
  citizenReports: MOCK_CITIZEN_REPORTS,
  neighborhoods: MOCK_NEIGHBORHOODS,
  routes: MOCK_SAFE_ROUTES,
  weather: INITIAL_WEATHER,

  addCitizenReport: (report) =>
    set((state) => ({
      citizenReports: [report, ...state.citizenReports]
    })),

  addSafetyIncident: (incident) =>
    set((state) => ({
      incidents: [incident, ...state.incidents]
    })),

  upvoteIncident: (id) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id ? { ...inc, upvotes: inc.upvotes + 1 } : inc
      )
    })),

  likeReport: (id) =>
    set((state) => ({
      citizenReports: state.citizenReports.map((rep) =>
        rep.id === id ? { ...rep, likes: rep.likes + 1 } : rep
      )
    })),

  chatMessages: [
    {
      id: "m-welcome",
      sender: "assistant",
      text: "👋 Hello! I am CitySense AI, your intelligent urban companion. Ask me for budget street food spots, historical landmarks, safest night walking routes, or neighborhood comparisons!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  addChatMessage: (msg) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, msg]
    }))
}));
