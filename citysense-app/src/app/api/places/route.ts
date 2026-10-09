import { NextResponse } from "next/server";
import { MOCK_PLACES } from "@/data/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const neighborhood = searchParams.get("neighborhood");

  let filtered = MOCK_PLACES;

  if (category && category !== "all") {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (neighborhood) {
    filtered = filtered.filter((p) => p.neighborhood.toLowerCase().includes(neighborhood.toLowerCase()));
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
}
