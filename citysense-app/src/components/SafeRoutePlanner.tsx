"use client";

import React, { useState, useMemo } from "react";
import { useCitySenseStore } from "@/lib/store";
import { SafeRouteOption } from "@/types";
import { generateRoutesForCity } from "@/lib/citySearch";
import { 
  Route, 
  ShieldCheck, 
  Zap, 
  Camera, 
  PhoneCall, 
  AlertTriangle, 
  Navigation, 
  Compass, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Volume2
} from "lucide-react";

export const SafeRoutePlanner: React.FC = () => {
  const { routes, activeRoute, setActiveRoute, currentCity, currentCityCoords } = useCitySenseStore();
  const [origin, setOrigin] = useState("Central Hub / Metro Station");
  const [destination, setDestination] = useState("City Center Plaza");
  const [isNavigating, setIsNavigating] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(true);

  // Compute routes tailored to the current city
  const cityRoutes = useMemo(() => {
    if (currentCityCoords && currentCityCoords[0] && currentCityCoords[1]) {
      return generateRoutesForCity(currentCity || "City", currentCityCoords[0], currentCityCoords[1]);
    }
    return routes;
  }, [currentCity, currentCityCoords, routes]);

  const handleSelectRoute = (route: SafeRouteOption) => {
    setActiveRoute(route);
    setIsNavigating(true);
    if (typeof window !== "undefined") {
      const mapEl = document.getElementById("city-map-container");
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleEndNavigation = () => {
    setIsNavigating(false);
    setActiveRoute(null);
  };

  return (
    <div className="space-y-5">
      {/* Route Query Inputs */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Route className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Safe Route Intelligence Engine</h3>
              <p className="text-[11px] text-slate-400">
                Calculates illuminated pathways, CCTV coverage & incident avoidance in {currentCity || "the city"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setVoiceGuidance(!voiceGuidance)}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
              voiceGuidance 
                ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice Safety Guidance</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Origin point..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-rose-400" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Route Options Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cityRoutes.map((route) => {
          const isSelected = activeRoute?.id === route.id;
          const isSafest = route.type === 'safest';
          const isFastest = route.type === 'fastest';

          return (
            <div
              key={route.id}
              onClick={() => handleSelectRoute(route)}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? isSafest
                    ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xl shadow-emerald-500/15'
                    : isFastest
                    ? 'bg-slate-900 border-orange-500 ring-2 ring-orange-500/30 shadow-xl shadow-orange-500/15'
                    : 'bg-slate-900 border-blue-500 ring-2 ring-blue-500/30 shadow-xl shadow-blue-500/15'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isSafest
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : isFastest
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                    }`}
                  >
                    {isSafest ? '★ Highest Safety (Green)' : isFastest ? '⚡ Quickest (Orange)' : '🌊 Scenic (Blue)'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {route.distanceKm} km
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-100">{route.name}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {route.description}
                </p>

                {/* Safety Score Meter */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Safety Index
                    </span>
                    <span className={`font-bold ${route.safetyScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {route.safetyScore}%
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isSafest ? 'bg-emerald-400' : isFastest ? 'bg-orange-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${route.safetyScore}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400">
                    <div>
                      <span>Illumination: </span>
                      <strong className="text-slate-200">{route.wellLitPercentage}%</strong>
                    </div>
                    <div>
                      <span>SOS Booths: </span>
                      <strong className="text-slate-200">{route.emergencyBoothCount}</strong>
                    </div>
                  </div>
                </div>

                {/* Hazards Alert on Route */}
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  {route.incidentAlertsOnWay > 0 ? (
                    <span className="flex items-center gap-1 text-rose-400 font-medium">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      {route.incidentAlertsOnWay} Hazards on Route
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      0 Hazard Bottlenecks
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-300 font-semibold">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {route.durationMinutes} mins
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectRoute(route);
                }}
                className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isSelected
                    ? isSafest
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      : isFastest
                      ? 'bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-md shadow-orange-500/20'
                      : 'bg-blue-500 hover:bg-blue-400 text-slate-950 shadow-md shadow-blue-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isSelected && isNavigating ? 'Navigating Live...' : 'Select & Preview'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Navigation Simulation Banner */}
      {isNavigating && activeRoute && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Active Guidance: {activeRoute.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                  activeRoute.type === 'safest'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : activeRoute.type === 'fastest'
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}>
                  {activeRoute.type === 'safest' ? 'Green Corridor' : activeRoute.type === 'fastest' ? 'Quick Transit' : 'Scenic Walk'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Path active on map ({activeRoute.distanceKm} km • ~{activeRoute.durationMinutes} mins).
              </p>
            </div>
          </div>

          <button
            onClick={handleEndNavigation}
            className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-xs border border-rose-500/40 shadow-lg shadow-rose-600/20 transition-all whitespace-nowrap"
          >
            End Navigation ✕
          </button>
        </div>
      )}
    </div>
  );
};
