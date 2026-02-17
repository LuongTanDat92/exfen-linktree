"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import Page from "@/models/Page";

export default async function grabUsername(formData) {
  const session = await getServerSession(authOptions);
  if (!session) return false;

  const username = formData.get("username");

  const existingPage = await Page.findOne({ uri: username });
  if (existingPage) return false;

  return await Page.create({
    uri: username,
    owner: session.user.email,
  });
}

// "use server";

// import { Page } from "@/models/Page";
// import mongoose from "mongoose";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export default async function grabUsername(formData) {
//   const username = formData.get("username");
//   // mongoose.connect(process.env.MONGO_URI);
//   const existingPageDoc = await Page.findOne({ uri: username });
//   if (existingPageDoc) {
//     return false;
//   } else {
//     const session = await getServerSession(authOptions);
//     return await Page.create({
//       uri: username,
//       owner: session?.user?.email,
//     });
//   }
// }
