// import {authOptions} from "@/app/api/auth/[...nextauth]/route";
// import PageButtonsForm from "@/components/forms/PageButtonsForm";
// import PageLinksForm from "@/components/forms/PageLinksForm";
// import PageSettingsForm from "@/components/forms/PageSettingsForm";
// import UsernameForm from "@/components/forms/UsernameForm";
// import {Page} from "@/models/Page";
// import mongoose from "mongoose";
// import {getServerSession} from "next-auth";
// import {redirect} from "next/navigation";
// import cloneDeep from 'clone-deep';

// export default async function AccountPage({searchParams}) {
//   const session = await getServerSession(authOptions);
//   const desiredUsername = searchParams?.desiredUsername;
//   if (!session) {
//     return redirect('/');
//   }
//   mongoose.connect(process.env.MONGO_URI);
//   const page = await Page.findOne({owner: session?.user?.email});

//   const leanPage = cloneDeep(page.toJSON());
//   leanPage._id = leanPage._id.toString();
//   if (page) {
//     return (
//       <>
//         <PageSettingsForm page={leanPage} user={session.user} />
//         <PageButtonsForm page={leanPage} user={session.user} />
//         <PageLinksForm page={leanPage} user={session.user} />
//       </>
//     );
//   }

//   return (
//     <div>
//       <UsernameForm desiredUsername={desiredUsername} />
//     </div>
//   );
// }

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageBlocksForm from "@/components/forms/PageBlocksForm";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import UsernameForm from "@/components/forms/UsernameForm";
import Page from "@/models/Page";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
// import mongoose from "mongoose";
// import connectDB from "@/libs/connectDB";
import connectDB from "@/libs/mongodb.js";
export default async function AccountPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  const desiredUsername = searchParams?.desiredUsername;

  if (!session) redirect("/");

  await connectDB();

  const page = await Page.findOne({ owner: session.user.email }).lean();

  if (!page) {
    return <UsernameForm desiredUsername={desiredUsername} />;
  }

  // convert ids
  page._id = page._id.toString();

  if (page.links?.length) {
    page.links = page.links.map((l) => ({
      ...l,
      _id: l._id.toString(),
    }));
  }

  if (page.buttons?.length) {
    page.buttons = page.buttons.map((b) => ({
      ...b,
      _id: b._id.toString(),
    }));
  }
  if (page.blocks?.length) {
    page.blocks = page.blocks.map((b) => ({
      ...b,
      _id: String(b._id), // 🔥 cực kỳ quan trọng
    }));
  }

  const user = { ...session.user };

  return (
    <>
      <PageSettingsForm page={page} user={user} />
      <PageButtonsForm page={page} user={user} />
      <PageBlocksForm page={page} user={user} />
    </>
  );
}
