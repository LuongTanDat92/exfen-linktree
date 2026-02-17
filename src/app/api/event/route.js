import { NextResponse } from "next/server";
import connectDB from "@/libs/connectDB";
import Event from "@/models/Event";

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  await Event.create({
    page: body.pageId,
    type: body.type, // "button_click"
    target: body.target, // button id / label
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true });
}
