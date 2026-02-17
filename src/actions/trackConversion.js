"use server";

import connectDB from "@/libs/mongodb";
import Event from "@/models/Event";

export async function trackConversion({
  uri,
  pageId,
  target,
  sessionId,
  meta,
}) {
  await connectDB();

  await Event.create({
    type: "conversion",
    uri,
    page: pageId,
    target,
    sessionId,
    meta,
  });
}
