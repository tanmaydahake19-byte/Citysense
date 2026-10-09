import { NextResponse } from "next/server";
import { MOCK_SAFETY_INCIDENTS, MOCK_SAFE_ROUTES } from "@/data/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "routes") {
    return NextResponse.json({
      success: true,
      routes: MOCK_SAFE_ROUTES,
    });
  }

  return NextResponse.json({
    success: true,
    incidents: MOCK_SAFETY_INCIDENTS,
    activeIncidentsCount: MOCK_SAFETY_INCIDENTS.filter((i) => i.status === "active").length,
  });
}
