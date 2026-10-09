export type PlaceCategory = 'food' | 'attraction' | 'hotel' | 'heritage' | 'budget';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  subcategory: string;
  rating: number;
  reviewsCount: number;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  safetyScore: number; // 0 - 100
  cleanlinessScore: number; // 0 - 100
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  description: string;
  culturalNote?: string;
  historicalPeriod?: string;
  budgetTip?: string;
  tags: string[];
  isOpen: boolean;
  openingHours: string;
  imageUrl: string;
}

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentCategory = 'accident' | 'poor_lighting' | 'congestion' | 'harassment' | 'roadblock' | 'weather_hazard';

export interface SafetyIncident {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  lat: number;
  lng: number;
  neighborhood: string;
  description: string;
  reportedAt: string;
  upvotes: number;
  verified: boolean;
  status: 'active' | 'investigating' | 'resolved';
}

export interface NeighborhoodStats {
  id: string;
  name: string;
  safetyScore: number;
  cleanlinessScore: number;
  affordabilityScore: number;
  accessibilityScore: number;
  overallRating: number;
  summary: string;
  highlightPros: string[];
  cautionPoints: string[];
  medianRent: string;
  avgMealCost: string;
  transitScore: number;
}

export interface CitizenReport {
  id: string;
  author: string;
  avatar: string;
  title: string;
  type: 'traffic' | 'safety' | 'gem' | 'weather' | 'event';
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  timestamp: string;
  likes: number;
  aiVerificationScore: number; // percentage
  aiNote?: string;
  mediaUrl?: string;
  voiceNoteDuration?: string;
}

export interface SafeRouteOption {
  id: string;
  name: string;
  type: 'safest' | 'fastest' | 'scenic';
  distanceKm: number;
  durationMinutes: number;
  safetyScore: number;
  wellLitPercentage: number;
  emergencyBoothCount: number;
  incidentAlertsOnWay: number;
  waypoints: [number, number][];
  description: string;
}

export interface WeatherInsight {
  temp: number;
  condition: string;
  airQualityIndex: number;
  aqiLabel: 'Good' | 'Moderate' | 'Unhealthy';
  humidity: number;
  visibilityKm: number;
  alert?: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'view_place' | 'view_route' | 'show_safe_corridor';
    targetId?: string;
    label: string;
  };
}
