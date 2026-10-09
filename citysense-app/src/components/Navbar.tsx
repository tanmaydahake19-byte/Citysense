"use client";

import React from "react";
import { useCitySenseStore, NavTab } from "@/lib/store";
import { 
  Compass, 
  ShieldAlert, 
  Scale, 
  Radio, 
  Route, 
  Search, 
  AlertTriangle, 
  Sparkles, 
  PlusCircle, 
  User, 
  MapPin,
  Bell
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery, 
    currentCity,
    triggerCitySearch,
    setSOSOpen, 
    setReportModalOpen, 
    isAIChatOpen, 
    setAIChatOpen,
    incidents
  } = useCitySenseStore();

  const activeIncidentCount = incidents.filter(i => i.status === 'active').length;

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      triggerCitySearch(searchQuery.trim());
    }
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'explore', label: 'Explore & Heritage', icon: <Compass className="w-4 h-4" /> },
    { id: 'safety', label: 'Safety & Security', icon: <ShieldAlert className="w-4 h-4" />, badge: activeIncidentCount },
    { id: 'routes', label: 'Safe Routes', icon: <Route className="w-4 h-4" /> },
    { id: 'matrix', label: 'City Index & Matrix', icon: <Scale className="w-4 h-4" /> },
    { id: 'feed', label: 'Live Insights', icon: <Radio className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Dynamic City Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('explore')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
                <Compass className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    CitySense
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Live
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-medium">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate max-w-[150px] sm:max-w-[200px]">{currentCity || "Delhi, India"}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block ml-1 shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="Search any city or landmark (Press Enter to Fly)..."
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-full pl-10 pr-4 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions & Utility */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Report Button */}
            <button
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition-all hover:scale-[1.02] shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Report Hazard</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={() => setAIChatOpen(!isAIChatOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                isAIChatOpen 
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300 ring-2 ring-purple-500/30' 
                  : 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={() => setSOSOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 border border-red-400/40 animate-pulse hover:animate-none transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

            {/* Profile Avatar */}
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:border-slate-500 text-slate-300 ml-1">
              <User className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/50">
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
