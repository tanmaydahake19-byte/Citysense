"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCitySenseStore } from "@/lib/store";
import { IncidentSeverity } from "@/types";
import { formatTimeAgo, getSeverityBadge } from "@/lib/utils";
import { 
  ShieldAlert, 
  AlertTriangle, 
  ThumbsUp, 
  MapPin, 
  CheckCircle2, 
  Lightbulb, 
  Flame, 
  PhoneCall, 
  Radio, 
  ShieldCheck,
  Eye
} from "lucide-react";

export const SafetyCenter: React.FC = () => {
  const router = useRouter();
  const { 
    incidents, 
    upvoteIncident, 
    setSelectedIncident, 
    selectedIncident, 
    setSOSOpen,
    focusOnLocation 
  } = useCitySenseStore();
  const [filterSeverity, setFilterSeverity] = useState<'all' | IncidentSeverity>('all');

  const handleIncidentSelect = (inc: (typeof incidents)[0]) => {
    setSelectedIncident(inc);
    focusOnLocation({
      id: inc.id,
      name: inc.title,
      category: "hazard",
      lat: inc.lat,
      lng: inc.lng,
      description: inc.description,
      safetyScore: inc.severity === "critical" ? 22 : inc.severity === "high" ? 38 : 55,
    });

    const params = new URLSearchParams({
      id: inc.id,
      name: inc.title,
      category: "hazard",
      lat: inc.lat.toString(),
      lng: inc.lng.toString(),
      description: inc.description,
    });
    router.push(`/map?${params.toString()}`);
  };

  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
    return true;
  });

  const criticalCount = incidents.filter(i => i.severity === 'high' || i.severity === 'critical').length;
  const verifiedCount = incidents.filter(i => i.verified).length;

  return (
    <div className="space-y-5">
      {/* City Safety Radar Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">City Safety Rating</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">88.4 <span className="text-sm font-normal text-slate-400">/ 100</span></div>
            <div className="text-[11px] text-emerald-500 font-medium mt-0.5">● Normal Security Status</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Active Hazard Zones</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{criticalCount} <span className="text-sm font-normal text-slate-400">Urgent</span></div>
            <div className="text-[11px] text-slate-400 mt-0.5">{incidents.length} total monitored hazards</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">AI Verified Alerts</div>
            <div className="text-2xl font-black text-cyan-400 mt-1">{verifiedCount} <span className="text-sm font-normal text-slate-400">Verified</span></div>
            <div className="text-[11px] text-slate-400 mt-0.5">Community sensor cross-check</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Radio className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and SOS Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs text-slate-400 font-semibold mr-1">Severity:</span>
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                filterSeverity === sev
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSOSOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Instant Emergency Dispatch</span>
        </button>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {filteredIncidents.map(inc => {
          const isSelected = selectedIncident?.id === inc.id;
          return (
            <div
              key={inc.id}
              onClick={() => handleIncidentSelect(inc)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-rose-500 ring-2 ring-rose-500/20 shadow-xl'
                  : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700 hover:shadow-lg'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 border ${getSeverityBadge(inc.severity)}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-100">{inc.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getSeverityBadge(inc.severity)}`}>
                        {inc.severity}
                      </span>
                      {inc.verified && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>AI Verified</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{inc.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {inc.neighborhood}
                      </span>
                      <span>•</span>
                      <span>Reported {formatTimeAgo(inc.reportedAt)}</span>
                      <span>•</span>
                      <span className="capitalize font-medium text-slate-300">Status: {inc.status}</span>
                    </div>
                  </div>
                </div>

                {/* Upvote & Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto mt-2 sm:mt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      upvoteIncident(inc.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold transition-all hover:scale-105"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{inc.upvotes}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Protocol Advisory */}
      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <Lightbulb className="w-4 h-4" />
          <span>Smart Night Safety Advice</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          When exploring after 9:00 PM, stick to designated <strong className="text-white">CitySense Green Corridors</strong> with active commercial foot traffic and 100% illumination coverage. Avoid poorly lit alleyways around North Market underpass.
        </p>
      </div>
    </div>
  );
};
