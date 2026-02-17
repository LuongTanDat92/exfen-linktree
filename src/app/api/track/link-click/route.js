import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Event from "@/models/Event";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  await Event.create({
    type: "link_click",
    page: body.pageId,
    uri: body.uri,
    target: body.url,
  });

  return NextResponse.json({ ok: true });
}
