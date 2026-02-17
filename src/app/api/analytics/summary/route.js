import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Event from "@/models/Event";
import { subDays } from "date-fns";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get("pageId");
  const days = Number(searchParams.get("days") || 14);

  if (!pageId || pageId === "undefined") {
    return NextResponse.json({ views: 0, items: [] }, { status: 200 });
  }

  const fromDate = subDays(new Date(), days);

  const events = await Event.find({
    page: pageId,
    createdAt: { $gte: fromDate },
  }).lean();

  let views = 0;
  const map = {};

  events.forEach((e) => {
    if (e.type === "page_view") {
      views++;
    }

    if (e.type === "link_click" || e.type === "button_click") {
      if (!e.target) return;
      map[e.target] = (map[e.target] || 0) + 1;
    }
  });

  const items = Object.entries(map).map(([target, clicks]) => ({
    target,
    clicks,
  }));

  return NextResponse.json({
    views,
    items,
  });
}
