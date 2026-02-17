"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Page from "@/models/Page";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import connectDB from "@/libs/mongodb";

/* ================= PAGE SETTINGS ================= */

export async function savePageSettings(formData) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) return false;

  const keys = [
    "displayName",
    "location",
    "bio",
    "bgType",
    "bgColor",
    "bgImage",
  ];

  const update = {};
  for (const k of keys) {
    if (formData.has(k)) update[k] = formData.get(k);
  }

  await Page.updateOne({ owner: session.user.email }, { $set: update });

  if (formData.has("avatar")) {
    await User.updateOne(
      { email: session.user.email },
      { image: formData.get("avatar") }
    );
  }

  revalidatePath("/dashboard");
  return true;
}

/* ================= PAGE BUTTONS ================= */

export async function savePageButtons(formData) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) return false;

  const buttons = {};
  formData.forEach((v, k) => (buttons[k] = v));

  await Page.updateOne({ owner: session.user.email }, { $set: { buttons } });

  revalidatePath("/dashboard");
  return true;
}

/* ================= SAVE ALL BLOCKS ================= */

export async function savePageBlocks({ pageId, blocks }) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await connectDB();

  await Page.updateOne(
    { _id: pageId, owner: session.user.email },
    {
      $set: {
        blocks: blocks.map((b, index) => ({
          ...b,
          order: index,
        })),
      },
    }
  );

  revalidatePath("/dashboard");
  return true;
}

/* ================= DELETE BLOCK ================= */

export async function deleteLinkBlock(blockId) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await connectDB();

  await Page.updateOne(
    { owner: session.user.email },
    { $pull: { blocks: { _id: blockId } } }
  );

  return true;
}

// "use server";

// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import Page from "@/models/Page";
// import User from "@/models/User";
// import { Types } from "mongoose";
// import { getServerSession } from "next-auth";
// import { revalidatePath } from "next/cache";
// import crypto from "crypto";
// //import connectDB from "@/libs/connectDB";
// import connectDB from "@/libs/mongodb.js";

// /* ---------------- PAGE SETTINGS ---------------- */

// export async function savePageSettings(formData) {
//   await connectDB();

//   const session = await getServerSession(authOptions);
//   if (!session) return false;

//   const keys = [
//     "displayName",
//     "location",
//     "bio",
//     "bgType",
//     "bgColor",
//     "bgImage",
//   ];

//   const update = {};
//   for (const k of keys) {
//     if (formData.has(k)) update[k] = formData.get(k);
//   }

//   await Page.updateOne({ owner: session.user.email }, { $set: update });

//   if (formData.has("avatar")) {
//     await User.updateOne(
//       { email: session.user.email },
//       { image: formData.get("avatar") }
//     );
//   }

//   revalidatePath("/dashboard");
//   return true;
// }

// /* ---------------- BUTTONS ---------------- */

// export async function savePageButtons(formData) {
//   await connectDB();

//   const session = await getServerSession(authOptions);
//   if (!session) return false;

//   const buttons = {};
//   formData.forEach((v, k) => (buttons[k] = v));

//   await Page.updateOne({ owner: session.user.email }, { $set: { buttons } });

//   revalidatePath("/dashboard");
//   return true;
// }

// /* ================= SAVE / UPDATE BLOCK ================= */

// export async function saveLinkBlock({ pageId, block }) {
//   const session = await getServerSession(authOptions);
//   if (!session) throw new Error("Unauthorized");

//   await connectDB();

//   const owner = session.user.email;

//   /* ===== CREATE ===== */
//   if (!block._id) {
//     const newBlock = {
//       _id: crypto.randomUUID(), // ✅ UUID STRING
//       type: block.type,
//       order: block.order ?? 0,
//       data: block.data ?? {},
//       createdAt: new Date(),
//     };

//     const res = await Page.findOneAndUpdate(
//       { owner },
//       { $push: { blocks: newBlock } },
//       { new: true }
//     );

//     return newBlock;
//   }

//   /* ===== UPDATE ===== */
//   const result = await Page.updateOne(
//     {
//       owner,
//       "blocks._id": block._id, // ✅ STRING MATCH
//     },
//     {
//       $set: {
//         "blocks.$.type": block.type,
//         "blocks.$.order": block.order ?? 0,
//         "blocks.$.data": block.data ?? {},
//         "blocks.$.updatedAt": new Date(),
//       },
//     }
//   );

//   if (result.matchedCount === 0) {
//     throw new Error("Block not found");
//   }

//   return { _id: block._id };
// }

// /* ================= DELETE BLOCK ================= */
// export async function deleteLinkBlock(blockId) {
//   const session = await getServerSession(authOptions);
//   if (!session) throw new Error("Unauthorized");

//   await connectDB();

//   const result = await Page.updateOne(
//     { owner: session.user.email },
//     { $pull: { blocks: { _id: blockId } } } // ✅ STRING
//   );

//   if (result.modifiedCount === 0) {
//     throw new Error("Block not found");
//   }

//   return true;
// }
