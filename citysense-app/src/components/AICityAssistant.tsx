"use client";

import React, { useState } from "react";
import { useCitySenseStore } from "@/lib/store";
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  Compass, 
  ShieldCheck, 
  MapPin, 
  ArrowRight
} from "lucide-react";

export const AICityAssistant: React.FC = () => {
  const { 
    isAIChatOpen, 
    setAIChatOpen, 
    chatMessages, 
    addChatMessage, 
    setSelectedPlace, 
    places, 
    setActiveTab, 
    setActiveRoute,
    routes
  } = useCitySenseStore();

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    "Safest night route to Cyber Oasis?",
    "Best budget street food in Old Town?",
    "Historical background of Old Fort Citadel?",
    "Compare safety: Harbor Bay vs Old Town"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // 1. Add User Message
    addChatMessage({
      id: "u-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    if (!textToSend) setInput("");
    setIsTyping(true);

    // 2. Intelligent NLP Assistant Response Simulation
    setTimeout(() => {
      let responseText = "";
      let suggestedAction: any = undefined;
      const lower = query.toLowerCase();

      if (lower.includes("food") || lower.includes("budget") || lower.includes("eat")) {
        responseText = "According to CitySense foodie sentiment scores, Spice Alley in Old Town is the #1 recommended budget gem (4.9★, full meal under $6). For a modern late-night experience, Cyber Oasis Rooftop in Tech Quarter has 96% safety score.";
        const place = places.find(p => p.category === 'food');
        if (place) {
          suggestedAction = {
            type: "view_place",
            targetId: place.id,
            label: "Pin Spice Alley on Map"
          };
        }
      } else if (lower.includes("safe") || lower.includes("route") || lower.includes("night") || lower.includes("cyber")) {
        responseText = "For night travel, I strongly advise the SafeSense Smart Corridor. It avoids the lighting outages at 7th Cross, has 98% illumination with continuous municipal CCTV, and passes 4 emergency call booths.";
        suggestedAction = {
          type: "view_route",
          targetId: routes[0]?.id,
          label: "Preview Safe Corridor on Map"
        };
      } else if (lower.includes("history") || lower.includes("citadel") || lower.includes("heritage")) {
        responseText = "The Old Fort Citadel was erected during the 16th-century Mughal era with red sandstone fortifications. Pro tip: Free entry is available before 9:00 AM on weekdays, and authentic classical concerts are held on weekends!";
        const place = places.find(p => p.category === 'heritage');
        if (place) {
          suggestedAction = {
            type: "view_place",
            targetId: place.id,
            label: "View Heritage Details"
          };
        }
      } else if (lower.includes("compare") || lower.includes("harbor")) {
        responseText = "Harbor Bay rates higher for safety (93%) and cleanliness (95%), but is pricier ($1,850/mo rent). Old Town offers rich heritage and superior affordability (96 score) but has 2 active hazard zones tonight.";
        suggestedAction = {
          type: "view_route",
          label: "Open Urban Comparison Matrix"
        };
      } else {
        responseText = `Analyzing city sensor networks for "${query}"... I found verified recommendations. You can explore interactive pins on the map, filter by safety ratings, or calculate safer navigation routes!`;
      }

      addChatMessage({
        id: "a-" + Date.now(),
        sender: "assistant",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction
      });

      setIsTyping(false);
    }, 600);
  };

  if (!isAIChatOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md bg-slate-950/95 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 max-h-[580px] h-[540px]">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-900/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              CitySense AI Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            </h3>
            <p className="text-[10px] text-purple-300">Powered by Urban NLP & Geo-Intelligence</p>
          </div>
        </div>

        <button
          onClick={() => setAIChatOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                msg.sender === "user"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "bg-purple-600 text-white"
              }`}
            >
              {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`space-y-1.5 max-w-[80%]`}>
              <div
                className={`p-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-cyan-600 text-white rounded-tr-none font-medium"
                    : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
              </div>

              {/* Action suggestion pill */}
              {msg.suggestedAction && (
                <button
                  onClick={() => {
                    if (msg.suggestedAction?.type === 'view_place') {
                      const place = places.find(p => p.id === msg.suggestedAction?.targetId) || places[0];
                      setSelectedPlace(place);
                    } else if (msg.suggestedAction?.type === 'view_route') {
                      setActiveTab('routes');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-[11px] font-bold text-purple-300 transition-all"
                >
                  <MapPin className="w-3 h-3 text-purple-400" />
                  <span>{msg.suggestedAction.label}</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </button>
              )}

              <div
                className={`text-[9px] text-slate-500 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic">
            <Bot className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            <span>CitySense AI is typing...</span>
          </div>
        )}
      </div>

      {/* Suggested prompts carousel */}
      <div className="p-2 border-t border-slate-800 bg-slate-900/50 flex gap-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-[10px] text-slate-300 whitespace-nowrap transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask CitySense about food, history, routes..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={() => handleSend()}
          className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-600/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
