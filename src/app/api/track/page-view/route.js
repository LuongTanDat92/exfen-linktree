import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Event from "@/models/Event";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  await Event.create({
    type: "page_view",
    page: body.pageId,
    uri: body.uri,
  });

  return NextResponse.json({ ok: true });
}
