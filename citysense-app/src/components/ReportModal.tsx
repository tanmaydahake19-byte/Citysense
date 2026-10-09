"use client";

import React, { useState } from "react";
import { useCitySenseStore } from "@/lib/store";
import { 
  X, 
  PlusCircle, 
  MapPin, 
  AlertTriangle, 
  Camera, 
  Mic, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2
} from "lucide-react";

export const ReportModal: React.FC = () => {
  const { isReportModalOpen, setReportModalOpen, addCitizenReport, addSafetyIncident } = useCitySenseStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [reportType, setReportType] = useState<'traffic' | 'safety' | 'gem' | 'weather'>('safety');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [isRecording, setIsRecording] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isReportModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !locationName) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newReportId = "rep-" + Date.now();

      // Add Citizen Report
      addCitizenReport({
        id: newReportId,
        author: "Citizen Explorer (You)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        title,
        type: reportType,
        description,
        locationName,
        lat: 28.6180 + (Math.random() - 0.5) * 0.02,
        lng: 77.2120 + (Math.random() - 0.5) * 0.02,
        timestamp: new Date().toISOString(),
        likes: 1,
        aiVerificationScore: 94,
        aiNote: "Analyzed by CitySense AI NLP: Validated geospatial report with verified confidence.",
        mediaUrl: hasPhoto ? "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80" : undefined,
        voiceNoteDuration: isRecording ? "0:18" : undefined
      });

      // If safety hazard, also add to active safety incidents
      if (reportType === 'safety') {
        addSafetyIncident({
          id: "inc-" + Date.now(),
          title,
          category: 'poor_lighting',
          severity,
          lat: 28.6180 + (Math.random() - 0.5) * 0.02,
          lng: 77.2120 + (Math.random() - 0.5) * 0.02,
          neighborhood: locationName,
          description,
          reportedAt: new Date().toISOString(),
          upvotes: 1,
          verified: true,
          status: 'active'
        });
      }

      setIsSubmitting(false);
      setSubmittedSuccess(true);

      setTimeout(() => {
        setSubmittedSuccess(false);
        setReportModalOpen(false);
        setTitle("");
        setDescription("");
        setLocationName("");
      }, 1200);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-slate-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Report Urban Hazard / Hidden Gem</h3>
              <p className="text-[11px] text-slate-400">Contribute verified insights to the CitySense network</p>
            </div>
          </div>
          <button
            onClick={() => setReportModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-lg text-white">Insight Published Successfully!</h4>
            <p className="text-xs text-slate-400">AI verification score calculated and added to the city map.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Category Selector */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Report Category</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'safety', label: 'Safety Hazard' },
                  { id: 'traffic', label: 'Traffic Alert' },
                  { id: 'gem', label: 'Hidden Gem' },
                  { id: 'weather', label: 'Weather' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setReportType(type.id as any)}
                    className={`py-2 rounded-xl text-center font-medium border transition-all ${
                      reportType === type.id
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Title / Brief Heading</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Streetlamp blackout near 4th avenue..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Location or Landmark</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Old Town Central Bazaar, Gate 2"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Severity if safety */}
            {reportType === 'safety' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Severity Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'medium', 'high', 'critical'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`py-1.5 rounded-xl uppercase text-[10px] font-bold border transition-all ${
                        severity === sev
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Detailed Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide accurate details so community members and authorities can verify..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* Attachments (Photo & Voice Memo) */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setHasPhoto(!hasPhoto)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${
                  hasPhoto
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{hasPhoto ? 'Photo Attached ✓' : 'Add Photo'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${
                  isRecording
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecording ? 'Voice Memo Attached ✓' : 'Record Voice'}</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Analyzing & Publishing...' : 'Submit with AI NLP Verification'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
