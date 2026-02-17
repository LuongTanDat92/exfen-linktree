import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Event from "@/models/Event";

export async function POST(req) {
  await connectDB();

  const body = await req.json(); // ✅ BẮT BUỘC

  await Event.create({
    type: "button_click",
    page: body.page,
    uri: body.uri,
    buttonType: body.buttonType,
    url: body.url,
  });

  return NextResponse.json({ ok: true });
}
