"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCitySenseStore } from "@/lib/store";
import { formatTimeAgo } from "@/lib/utils";
import { 
  Radio, 
  Heart, 
  MessageSquare, 
  Share2, 
  CheckCircle2, 
  Mic, 
  Image as ImageIcon, 
  PlusCircle, 
  MapPin, 
  Sparkles, 
  Car, 
  ShieldAlert, 
  Compass, 
  CloudSun
} from "lucide-react";

export const SmartCityFeed: React.FC = () => {
  const router = useRouter();
  const { citizenReports, likeReport, setReportModalOpen, focusOnLocation } = useCitySenseStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const handleReportFocus = (report: (typeof citizenReports)[0]) => {
    const category = report.type === 'safety' ? 'hazard' : report.type === 'gem' ? 'budget' : 'attraction';
    focusOnLocation({
      id: report.id,
      name: report.title,
      category,
      lat: report.lat,
      lng: report.lng,
      description: `${report.description} — Reported by ${report.author} at ${report.locationName}`,
    });

    const params = new URLSearchParams({
      id: report.id,
      name: report.title,
      category,
      lat: report.lat.toString(),
      lng: report.lng.toString(),
      description: `${report.description} — Reported by ${report.author} at ${report.locationName}`,
    });
    router.push(`/map?${params.toString()}`);
  };

  const filteredReports = citizenReports.filter(rep => {
    if (filterType !== 'all' && rep.type !== filterType) return false;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'traffic': return <Car className="w-3.5 h-3.5 text-cyan-400" />;
      case 'safety': return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case 'gem': return <Compass className="w-3.5 h-3.5 text-emerald-400" />;
      case 'weather': return <CloudSun className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Radio className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner and Quick Submission */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
            <h3 className="font-bold text-base text-slate-100">Live Citizen Pulse & AI Verification Feed</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Crowdsourced road conditions, hidden city discoveries & weather alerts analyzed by AI NLP.
          </p>
        </div>

        <button
          onClick={() => setReportModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Contribute Insight</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {['all', 'traffic', 'safety', 'gem', 'weather'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
              filterType === tab
                ? 'bg-slate-100 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab === 'gem' ? 'Hidden Gems' : tab}
          </button>
        ))}
      </div>

      {/* Feed Cards */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            onClick={() => handleReportFocus(report)}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-cyan-500/60 hover:bg-slate-900 transition-all shadow-md cursor-pointer group"
          >
            {/* Author and Type Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={report.avatar}
                  alt={report.author}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-200">{report.author}</span>
                    <span className="text-[10px] text-slate-500 font-mono">• {formatTimeAgo(report.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-cyan-400 group-hover:underline">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{report.locationName} (Click to View Map)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs">
                {getTypeIcon(report.type)}
                <span className="text-[11px] capitalize font-medium text-slate-300">{report.type}</span>
              </div>
            </div>

            {/* Title & Body */}
            <div>
              <h4 className="font-bold text-sm text-slate-100">{report.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{report.description}</p>
            </div>

            {/* Media Image if present */}
            {report.mediaUrl && (
              <div className="rounded-xl overflow-hidden max-h-64 border border-slate-800">
                <img src={report.mediaUrl} alt={report.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Voice Note Simulation */}
            {report.voiceNoteDuration && (
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-cyan-400">
                  <Mic className="w-4 h-4" />
                  <span>Voice Memo ({report.voiceNoteDuration})</span>
                </div>
                <button
                  onClick={() => setPlayingAudioId(playingAudioId === report.id ? null : report.id)}
                  className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold"
                >
                  {playingAudioId === report.id ? 'Pause ⏸' : 'Play Audio ▶'}
                </button>
              </div>
            )}

            {/* AI Verification & Sentiment Pill */}
            {report.aiNote && (
              <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 flex items-start gap-2 text-xs text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[10px] tracking-wider uppercase text-cyan-400">
                      CitySense AI NLP Verified ({report.aiVerificationScore}%)
                    </span>
                  </div>
                  <p className="text-[11px] text-cyan-200/90">{report.aiNote}</p>
                </div>
              </div>
            )}

            {/* Footer Likes & Social */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
              <button
                onClick={() => likeReport(report.id)}
                className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>{report.likes} Helpful</span>
              </button>

              <button className="flex items-center gap-1.5 hover:text-slate-200">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comments</span>
              </button>

              <button className="flex items-center gap-1.5 hover:text-slate-200">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
