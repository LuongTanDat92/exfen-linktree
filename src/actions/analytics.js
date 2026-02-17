"use server";

import mongoose from "mongoose";
import connectDB from "@/libs/mongodb";
import Event from "@/models/Event";

export async function trackLinkClick({ uri, pageId, blockId, url }) {
  if (!uri || !pageId || !url) return;

  await connectDB();

  await Event.create({
    type: "link_click",
    uri,
    page: new mongoose.Types.ObjectId(pageId),
    blockId,
    target: url,
  });
}

export async function trackButtonClick({ uri, pageId, button, url }) {
  if (!uri || !pageId || !button) return;

  await connectDB();

  await Event.create({
    type: "button_click",
    uri,
    page: pageId,
    target: button, // facebook / youtube / ...
    meta: {
      url,
    },
  });
}
