import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["page_view", "link_click", "button_click"],
      required: true,
    },
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
    },
    uri: String,
    target: String, // url link OR button url
  },
  { timestamps: true },
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
