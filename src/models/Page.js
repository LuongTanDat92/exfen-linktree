import mongoose from "@/libs/mongoose-lite";

const { Schema } = mongoose;

/* =========================
   BLOCK SUB SCHEMA
========================= */
const BlockSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["link", "text", "affiliate", "ad", "donate", "embed", "product"],
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

/* =========================
   PAGE SCHEMA
========================= */
const PageSchema = new Schema(
  {
    uri: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    owner: {
      type: String,
      required: true,
      index: true,
    },

    displayName: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },

    bgType: {
      type: String,
      enum: ["color", "image"],
      default: "color",
    },

    bgColor: { type: String, default: "#000000" },
    bgImage: { type: String, default: "" },

    buttons: {
      type: Object,
      default: {},
    },

    links: {
      type: [
        {
          title: String,
          subtitle: String,
          url: String,
          icon: String,
        },
      ],
      default: [],
    },

    blocks: {
      type: [BlockSchema],
      default: [],
    },
  },
  { timestamps: true }
);

/* =========================
   SAFE EXPORT (NEXT 13+)
========================= */
const Page = mongoose.models?.Page || mongoose.model("Page", PageSchema);

export default Page;
