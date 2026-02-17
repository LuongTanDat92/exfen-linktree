import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Event from "@/models/Event";
import mongoose from "mongoose";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get("pageId");
  const days = Number(searchParams.get("days") || 7);

  if (!pageId || !mongoose.Types.ObjectId.isValid(pageId)) {
    return NextResponse.json([]);
  }

  const pageObjectId = new mongoose.Types.ObjectId(pageId);

  const from = new Date();
  from.setDate(from.getDate() - days);

  const data = await Event.aggregate([
    {
      $match: {
        page: pageObjectId,
        createdAt: { $gte: from },
      },
    },
    {
      $group: {
        _id: {
          day: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          type: "$type",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.day",
        views: {
          $sum: {
            $cond: [{ $eq: ["$_id.type", "page_view"] }, "$count", 0],
          },
        },
        linkClicks: {
          $sum: {
            $cond: [{ $eq: ["$_id.type", "link_click"] }, "$count", 0],
          },
        },
        buttonClicks: {
          $sum: {
            $cond: [{ $eq: ["$_id.type", "button_click"] }, "$count", 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return NextResponse.json(
    data.map((d) => ({
      date: d._id,
      views: d.views,
      linkClicks: d.linkClicks,
      buttonClicks: d.buttonClicks,
    })),
  );
}
