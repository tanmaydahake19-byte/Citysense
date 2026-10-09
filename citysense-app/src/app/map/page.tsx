"use client";

import React, { useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { WeatherBanner } from "@/components/WeatherBanner";
import { AICityAssistant } from "@/components/AICityAssistant";
import { ReportModal } from "@/components/ReportModal";
import { SOSModal } from "@/components/SOSModal";
import { useCitySenseStore } from "@/lib/store";
import { MarkerCategory } from "@/data/locations";
import { MapPin, ArrowLeft, Layers, Compass } from "lucide-react";
import Link from "next/link";

const CityMap = dynamic(
  () => import("@/components/CityMap").then((mod) => mod.CityMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 text-xs font-semibold animate-pulse">
        Initializing Dynamic City Map…
      </div>
    ),
  }
);

function MapViewContent() {
  const searchParams = useSearchParams();
  const { focusOnLocation } = useCitySenseStore();

  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const initialLat = latParam ? parseFloat(latParam) : undefined;
  const initialLng = lngParam ? parseFloat(lngParam) : undefined;
  const initialZoom = initialLat && initialLng && !isNaN(initialLat) && !isNaN(initialLng) ? 16 : 13;

  useEffect(() => {
    const nameParam = searchParams.get("name");
    const categoryParam = searchParams.get("category") as MarkerCategory | null;
    const descParam = searchParams.get("description");
    const idParam = searchParams.get("id");

    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      if (!isNaN(lat) && !isNaN(lng)) {
        focusOnLocation({
          id: idParam || "url-place",
          name: nameParam || "Selected Location",
          category: categoryParam || "attraction",
          lat,
          lng,
          description: descParam || "Location highlighted from search query.",
        });
      }
    }
  }, [searchParams, latParam, lngParam, focusOnLocation]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <WeatherBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explorer</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Full Live Dynamic City Map</span>
          </div>
        </div>

        {/* Full-size Map Container */}
        <div className="h-[75vh] min-h-[580px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
          <CityMap initialLat={initialLat} initialLng={initialLng} initialZoom={initialZoom} />
        </div>
      </main>

      <AICityAssistant />
      <ReportModal />
      <SOSModal />
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 text-sm font-semibold">
          Loading CitySense Dynamic Map…
        </div>
      }
    >
      <MapViewContent />
    </Suspense>
  );
}
