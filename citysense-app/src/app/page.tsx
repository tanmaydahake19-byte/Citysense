"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { WeatherBanner } from "@/components/WeatherBanner";
import { ExplorationHub } from "@/components/ExplorationHub";
import { SafetyCenter } from "@/components/SafetyCenter";
import { SafeRoutePlanner } from "@/components/SafeRoutePlanner";
import { NeighborhoodMatrix } from "@/components/NeighborhoodMatrix";
import { SmartCityFeed } from "@/components/SmartCityFeed";
import { AICityAssistant } from "@/components/AICityAssistant";
import { ReportModal } from "@/components/ReportModal";
import { SOSModal } from "@/components/SOSModal";
import { useCitySenseStore } from "@/lib/store";

const CityMap = dynamic(
  () => import("@/components/CityMap").then((mod) => mod.CityMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-cyan-400 text-xs font-semibold gap-2 animate-pulse">
        <span>Loading CitySense Interactive Map…</span>
      </div>
    ),
  }
);
import { 
  Compass, 
  ShieldAlert, 
  Route, 
  Scale, 
  Radio, 
  MapPin, 
  Sparkles, 
  TrendingUp, 
  ArrowRight
} from "lucide-react";

export default function Home() {
  const { activeTab, setActiveTab } = useCitySenseStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Real-time Weather & Urban Alert Banner */}
      <WeatherBanner />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Hero Quick Banner / Context */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-cyan-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart City Navigator & Safety Guardian</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Exploring, Experiencing & Navigating the <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Urban Flow</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Transforming raw city data into verified intelligence. Uncover authentic culinary secrets, historical landmarks, real-time safety scores, and well-lit walking corridors.
            </p>
          </div>
        </div>

        {/* Dynamic Split Layout: Active Tool on Left, Interactive Map on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Active Feature Workspace Panel */}
          <div className="lg:col-span-7 space-y-4">
            {activeTab === 'explore' && <ExplorationHub />}
            {activeTab === 'safety' && <SafetyCenter />}
            {activeTab === 'routes' && <SafeRoutePlanner />}
            {activeTab === 'matrix' && <NeighborhoodMatrix />}
            {activeTab === 'feed' && <SmartCityFeed />}
          </div>

          {/* Sticky Interactive Map Panel */}
          <div className="lg:col-span-5 sticky top-28 space-y-3">
            <div className="flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Live Interactive Geo-Sense Map</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">CartoDB Voyager • Delhi Metro</span>
            </div>

            {/* Map Component */}
            <div className="h-[560px] w-full">
              <CityMap />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Click markers for safety score & details</span>
              <button 
                onClick={() => setActiveTab('routes')}
                className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
              >
                Plan Safe Route <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* Floating Modals and Assistant */}
      <AICityAssistant />
      <ReportModal />
      <SOSModal />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">CitySense™</span>
            <span>— Transforming Urban Chaos into Guided Harmony</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Next.js 14 App Router</span>
            <span>•</span>
            <span>Leaflet Maps</span>
            <span>•</span>
            <span>Zustand State</span>
            <span>•</span>
            <span>AI NLP Pipeline</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
