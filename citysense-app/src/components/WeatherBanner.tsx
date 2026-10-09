"use client";

import React from "react";
import { useCitySenseStore } from "@/lib/store";
import { CloudRain, Wind, AlertCircle, Sun, Activity, Eye, Zap } from "lucide-react";

export const WeatherBanner: React.FC = () => {
  const { weather, incidents, currentCity } = useCitySenseStore();
  const highRiskIncidents = incidents.filter(i => i.severity === 'high' || i.severity === 'critical');

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border-b border-slate-800 text-slate-200 py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Weather & AQI & City */}
        <div className="flex items-center flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold text-[11px]">
            <span>📍 {currentCity || "Delhi, India"}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sun className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-100">{weather.temp}°C</span>
            <span className="text-slate-400">({weather.condition})</span>
          </div>

          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">AQI:</span>
            <span className="font-semibold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px]">
              {weather.airQualityIndex} • {weather.aqiLabel}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>Humidity: {weather.humidity}%</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Vis: {weather.visibilityKm} km</span>
          </div>
        </div>

        {/* Live Alerts Marquee / Ticker */}
        <div className="flex items-center gap-3">
          {weather.alert && (
            <div className="flex items-center gap-1.5 text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[11px]">
              <AlertCircle className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>{weather.alert}</span>
            </div>
          )}

          {highRiskIncidents.length > 0 && (
            <div className="flex items-center gap-1.5 text-rose-300 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-[11px]">
              <Zap className="w-3 h-3 text-rose-400 animate-bounce" />
              <span className="font-semibold">{highRiskIncidents.length} Urgent Safety Alerts</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
