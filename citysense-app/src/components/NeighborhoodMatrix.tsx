"use client";

import React, { useState } from "react";
import { useCitySenseStore } from "@/lib/store";
import { NeighborhoodStats } from "@/types";
import { 
  Scale, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  Bus, 
  Star, 
  ThumbsUp, 
  AlertTriangle, 
  Check, 
  TrendingUp, 
  ArrowUpDown
} from "lucide-react";

export const NeighborhoodMatrix: React.FC = () => {
  const { neighborhoods, selectedNeighborhood, setSelectedNeighborhood } = useCitySenseStore();
  const [compareId, setCompareId] = useState<string>(neighborhoods[1]?.id || "");
  const [sortKey, setSortKey] = useState<'safetyScore' | 'cleanlinessScore' | 'affordabilityScore' | 'overallRating'>('safetyScore');

  const primary = selectedNeighborhood;
  const secondary = neighborhoods.find(n => n.id === compareId) || neighborhoods[1];

  const sortedNeighborhoods = [...neighborhoods].sort((a, b) => b[sortKey] - a[sortKey]);

  return (
    <div className="space-y-6">
      {/* Header & Comparison Selector */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Urban Matrix: Best vs. Worst Places</h3>
              <p className="text-xs text-slate-400">
                Direct head-to-head evaluation based on safety, cleanliness, affordability, ratings & transit.
              </p>
            </div>
          </div>

          {/* Quick Sort Selector */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Rank by:
            </span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-cyan-400 focus:outline-none focus:border-cyan-500"
            >
              <option value="safetyScore">Safety Index</option>
              <option value="cleanlinessScore">Cleanliness</option>
              <option value="affordabilityScore">Affordability</option>
              <option value="overallRating">Overall Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Head-to-Head Comparative Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider uppercase text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Head-to-Head Comparison
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Comparing Against:</span>
            <select
              value={compareId}
              onChange={(e) => setCompareId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {neighborhoods.map((nb) => (
                <option key={nb.id} value={nb.id}>
                  {nb.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Matrix Comparison Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primary Neighborhood */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-cyan-300">{primary.name}</h4>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {primary.overallRating}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{primary.summary}</p>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Safety Score</span>
                  <span className="font-bold text-emerald-400">{primary.safetyScore} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${primary.safetyScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Cleanliness & Air</span>
                  <span className="font-bold text-blue-400">{primary.cleanlinessScore} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${primary.cleanlinessScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Affordability Index</span>
                  <span className="font-bold text-purple-400">{primary.affordabilityScore} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${primary.affordabilityScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Transit & Walkability</span>
                  <span className="font-bold text-cyan-400">{primary.accessibilityScore} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${primary.accessibilityScore}%` }} />
                </div>
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                <ThumbsUp className="w-3 h-3" /> Key Strengths
              </div>
              {primary.highlightPros.map((pro, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                  <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </div>
              ))}

              <div className="text-rose-400 font-semibold flex items-center gap-1 text-[11px] pt-1">
                <AlertTriangle className="w-3 h-3" /> Caution Areas
              </div>
              {primary.cautionPoints.map((con, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-400 text-[11px]">
                  <span className="text-rose-400 font-bold shrink-0">•</span>
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Neighborhood */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-indigo-300">{secondary.name}</h4>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {secondary.overallRating}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{secondary.summary}</p>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Safety Score</span>
                  <span className="font-bold text-emerald-400">{secondary.safetyScore} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${secondary.safetyScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Cleanliness & Air</span>
                  <span className="font-bold text-blue-400">{secondary.cleanlinessScore} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${secondary.cleanlinessScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Affordability Index</span>
                  <span className="font-bold text-purple-400">{secondary.affordabilityScore} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${secondary.affordabilityScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Transit & Walkability</span>
                  <span className="font-bold text-cyan-400">{secondary.accessibilityScore} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${secondary.accessibilityScore}%` }} />
                </div>
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                <ThumbsUp className="w-3 h-3" /> Key Strengths
              </div>
              {secondary.highlightPros.map((pro, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                  <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </div>
              ))}

              <div className="text-rose-400 font-semibold flex items-center gap-1 text-[11px] pt-1">
                <AlertTriangle className="w-3 h-3" /> Caution Areas
              </div>
              {secondary.cautionPoints.map((con, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-400 text-[11px]">
                  <span className="text-rose-400 font-bold shrink-0">•</span>
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Neighborhood Ranking Grid */}
      <div className="space-y-3">
        <h4 className="font-bold text-sm text-slate-200">All City Neighborhoods Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedNeighborhoods.map((nb, i) => (
            <div
              key={nb.id}
              onClick={() => setSelectedNeighborhood(nb)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedNeighborhood.id === nb.id
                  ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center">
                    #{i + 1}
                  </span>
                  <h5 className="font-bold text-sm text-slate-100">{nb.name}</h5>
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  {nb[sortKey]} pts
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 text-center">
                <div>
                  <div>Safe</div>
                  <strong className="text-slate-200">{nb.safetyScore}%</strong>
                </div>
                <div>
                  <div>Clean</div>
                  <strong className="text-slate-200">{nb.cleanlinessScore}%</strong>
                </div>
                <div>
                  <div>Budget</div>
                  <strong className="text-slate-200">{nb.affordabilityScore}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
