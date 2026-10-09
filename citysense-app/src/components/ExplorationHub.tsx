"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCitySenseStore } from "@/lib/store";
import { PlaceCategory } from "@/types";
import { 
  Utensils, 
  Landmark, 
  Hotel, 
  Sparkles, 
  DollarSign, 
  Star, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Tag, 
  BookOpen
} from "lucide-react";

export const ExplorationHub: React.FC = () => {
  const router = useRouter();
  const { 
    places, 
    selectedCategory, 
    setSelectedCategory, 
    selectedPrice, 
    setSelectedPrice, 
    selectedPlace, 
    setSelectedPlace,
    focusOnLocation,
    searchQuery
  } = useCitySenseStore();

  const handlePlaceSelect = (place: (typeof places)[0]) => {
    setSelectedPlace(place);
    focusOnLocation({
      id: place.id,
      name: place.name,
      category: place.category,
      lat: place.lat,
      lng: place.lng,
      description: place.description,
      rating: place.rating,
      safetyScore: place.safetyScore,
      priceLevel: place.priceLevel,
    });

    const params = new URLSearchParams({
      id: place.id,
      name: place.name,
      category: place.category,
      lat: place.lat.toString(),
      lng: place.lng.toString(),
      description: place.description,
    });
    router.push(`/map?${params.toString()}`);
  };

  const categories: { id: 'all' | PlaceCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Sights', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'food', label: 'Local Food & Cafes', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'attraction', label: 'Attractions & Parks', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'heritage', label: 'History & Culture', icon: <Landmark className="w-3.5 h-3.5" /> },
    { id: 'hotel', label: 'Hotels & Pods', icon: <Hotel className="w-3.5 h-3.5" /> },
    { id: 'budget', label: 'Hidden Gems ($)', icon: <DollarSign className="w-3.5 h-3.5" /> },
  ];

  const priceFilters: ('all' | '$' | '$$' | '$$$' | '$$$$')[] = ['all', '$', '$$', '$$$', '$$$$'];

  const filteredPlaces = places.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedPrice !== 'all' && p.priceLevel !== selectedPrice) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchNeigh = p.neighborhood.toLowerCase().includes(q);
      const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchNeigh && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Category Badges & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25 scale-[1.02]'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {c.icon}
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Price Tier Filter */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <span className="text-[11px] text-slate-400 mr-1 hidden lg:inline">Budget:</span>
          {priceFilters.map((price) => (
            <button
              key={price}
              onClick={() => setSelectedPrice(price)}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all ${
                selectedPrice === price
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {price === 'all' ? 'Any $' : price}
            </button>
          ))}
        </div>
      </div>

      {/* Place Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlaces.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          return (
            <div
              key={place.id}
              onClick={() => handlePlaceSelect(place)}
              className={`group bg-slate-900/80 hover:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer flex flex-col justify-between ${
                isSelected 
                  ? 'border-cyan-500 ring-2 ring-cyan-500/30' 
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Image banner */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Badges on image */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-cyan-400 border border-cyan-500/30">
                    {place.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                    {place.priceLevel}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{place.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({place.reviewsCount})</span>
                </div>

                {/* Safety Score floating pill */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Safe: {place.safetyScore}%</span>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{place.neighborhood}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {place.description}
                  </p>

                  {/* Cultural / History Note if available */}
                  {place.culturalNote && (
                    <div className="mt-2.5 p-2 rounded-xl bg-purple-950/20 border border-purple-800/30 flex items-start gap-2 text-[11px] text-purple-300">
                      <BookOpen className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{place.culturalNote}</span>
                    </div>
                  )}

                  {/* Budget Tip if available */}
                  {place.budgetTip && (
                    <div className="mt-2 p-2 rounded-xl bg-emerald-950/20 border border-emerald-800/30 flex items-start gap-2 text-[11px] text-emerald-300">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{place.budgetTip}</span>
                    </div>
                  )}
                </div>

                {/* Tags and Hours */}
                <div className="space-y-2 pt-2 border-t border-slate-800/70">
                  <div className="flex flex-wrap gap-1">
                    {place.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{place.openingHours}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaceSelect(place);
                      }}
                      className="text-cyan-400 font-bold text-xs hover:text-cyan-300 hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                    >
                      View on Map →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
