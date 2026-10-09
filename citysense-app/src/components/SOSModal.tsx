"use client";

import React, { useState } from "react";
import { useCitySenseStore } from "@/lib/store";
import { 
  X, 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  MapPin, 
  BellRing, 
  CheckCircle2, 
  Radio, 
  Send
} from "lucide-react";

export const SOSModal: React.FC = () => {
  const { isSOSOpen, setSOSOpen } = useCitySenseStore();
  const [alarmActive, setAlarmActive] = useState(false);
  const [sosDispatched, setSosDispatched] = useState(false);

  if (!isSOSOpen) return null;

  const emergencyContacts = [
    { title: "National Emergency Dispatch", number: "112", description: "Immediate Police, Fire & Medical" },
    { title: "Police Quick Response Unit", number: "100", description: "Urban police patrol" },
    { title: "Medical Emergency Ambulance", number: "108", description: "Paramedic rapid response" },
    { title: "Women's Safety & Anti-Harassment", number: "1091", description: "24/7 dedicated support" },
    { title: "Tourist Assistance Helpline", number: "1363", description: "Multilingual emergency guidance" },
  ];

  const handleDispatch = () => {
    setSosDispatched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-950 border-2 border-red-500/80 rounded-3xl shadow-2xl overflow-hidden p-6 text-slate-100 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-red-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600/30 text-red-400 border border-red-500/50 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg text-red-400 tracking-tight">EMERGENCY SOS COMMAND</h3>
              <p className="text-xs text-slate-400">Rapid Assistance & Distress Protocol</p>
            </div>
          </div>
          <button
            onClick={() => setSOSOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live GPS Broadcast Info */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" /> Current Coordinates
            </span>
            <span className="font-mono text-slate-200 font-bold">28.6180° N, 77.2120° E</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Nearest Safe Haven: <strong>Old Town Police Station</strong></span>
            <span className="text-emerald-400 font-semibold">350m away</span>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDispatch}
            className={`py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
              sosDispatched
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/40 animate-pulse hover:animate-none'
            }`}
          >
            {sosDispatched ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Dispatch Sent!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send SOS Signal</span>
              </>
            )}
          </button>

          <button
            onClick={() => setAlarmActive(!alarmActive)}
            className={`py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
              alarmActive
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-amber-500/30'
            }`}
          >
            <BellRing className={`w-4 h-4 ${alarmActive ? 'animate-bounce' : ''}`} />
            <span>{alarmActive ? 'Siren Active (ON)' : 'Sound Siren'}</span>
          </button>
        </div>

        {/* Emergency Contacts List */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            One-Touch Emergency Helplines
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {emergencyContacts.map((contact, i) => (
              <a
                key={i}
                href={`tel:${contact.number}`}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-bold text-xs text-slate-200">{contact.title}</div>
                  <div className="text-[10px] text-slate-500">{contact.description}</div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 font-mono font-bold text-xs">
                  <PhoneCall className="w-3 h-3" />
                  <span>{contact.number}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-900">
          CitySense emergency alerts ping verified nearby community guardians and patrol dispatch.
        </div>
      </div>
    </div>
  );
};
