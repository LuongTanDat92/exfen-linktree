import { Event } from "@/models/Event";
import connectDB from "@/libs/connectDB";
export async function POST(req) {
  await connectDB();
  const url = new URL(req.url);
  const clickedLink = atob(url.searchParams.get("url"));
  const page = url.searchParams.get("page");
  await Event.create({ type: "click", uri: clickedLink, page });
  return Response.json(true);
}
