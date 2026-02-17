import BlockRenderer from "@/components/blocks/BlockRenderer";
import PageButtons from "@/components/analytics/PageButtons";
import Page from "@/models/Page";
import User from "@/models/User";
import Event from "@/models/Event";

import {
  faDiscord,
  faFacebook,
  faGithub,
  faInstagram,
  faTelegram,
  faTiktok,
  faWhatsapp,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import connectDB from "@/libs/mongodb";
import Image from "next/image";
import Link from "next/link";

/* ================= SAFE IMAGE ================= */
function safeImage(src, fallback = "/avatar-placeholder.png") {
  if (typeof src === "string" && src.startsWith("http")) return src;
  if (src?.url && typeof src.url === "string") return src.url;
  return fallback;
}

/* ================= BUTTON ICONS ================= */
export const buttonsIcons = {
  email: faEnvelope,
  mobile: faPhone,
  instagram: faInstagram,
  facebook: faFacebook,
  discord: faDiscord,
  tiktok: faTiktok,
  youtube: faYoutube,
  whatsapp: faWhatsapp,
  github: faGithub,
  telegram: faTelegram,
};

// function buttonLink(key, value) {
//   if (key === "mobile") return "tel:" + value;
//   if (key === "email") return "mailto:" + value;
//   return value;
// }

/* ================= PAGE ================= */
export default async function UserPage({ params }) {
  const uri = params.uri;

  await connectDB();

  const rawPage = await Page.findOne({ uri }).lean();
  if (!rawPage) return null;

  /* ========= NORMALIZE BLOCKS ========= */
  const normalizedBlocks = (rawPage.blocks || []).map((block, index) => {
    let data = block.data ?? {};

    if (block.type === "link") {
      data = {
        links: Array.isArray(data.links)
          ? data.links
          : [
              {
                id: block._id || "legacy",
                title: data.title || "",
                subtitle: data.subtitle || "",
                url: data.url || "",
                icon: data.icon || "",
              },
            ],
      };
    }

    if (block.type === "text") {
      data = {
        content:
          typeof data.content === "string"
            ? data.content
            : typeof data.text === "string"
              ? data.text
              : "",
      };
    }

    return {
      _id: block._id?.toString(),
      clientId: block._id?.toString() || `block-${index}`,
      type: block.type,
      order: block.order ?? index,
      data,
    };
  });

  const page = {
    ...rawPage,
    _id: rawPage._id.toString(),
    blocks: normalizedBlocks,
  };

  const rawUser = await User.findOne({ email: page.owner }).lean();
  const user = rawUser ? { ...rawUser, _id: rawUser._id.toString() } : null;

  /* ================= EVENT: PAGE VIEW ================= */
  try {
    await Event.create({
      type: "page_view",
      page: page._id, // ✅ pageId
      uri: page.uri, // ✅ target
    });
  } catch (err) {
    console.warn("Analytics error (page_view)", err?.message);
  }

  return (
    <div className="bg-blue-950 text-white min-h-screen">
      {/* ===== COVER ===== */}
      <div
        className="h-36 bg-cover bg-center"
        style={
          page.bgType === "color"
            ? { backgroundColor: page.bgColor }
            : page.bgImage
              ? { backgroundImage: `url(${page.bgImage})` }
              : {}
        }
      />

      {/* ===== AVATAR ===== */}
      <div className="aspect-square w-36 h-36 mx-auto relative -top-16 -mb-12">
        <Image
          className="rounded-full w-full h-full object-cover"
          src={safeImage(user?.image)}
          alt="avatar"
          width={256}
          height={256}
        />
      </div>

      {/* ===== INFO ===== */}
      <h2 className="text-2xl text-center mb-1">{page.displayName}</h2>

      {page.location && (
        <h3 className="text-md flex gap-2 justify-center items-center text-white/70">
          <FontAwesomeIcon className="h-4" icon={faLocationDot} />
          <span>{page.location}</span>
        </h3>
      )}

      {page.bio && (
        <div className="max-w-xs mx-auto text-center my-2">
          <p>{page.bio}</p>
        </div>
      )}

      {/* ===== BUTTONS ===== */}
      <PageButtons
        buttons={page.buttons}
        pageId={page._id}
        uri={page.uri}
        icons={buttonsIcons}
      />

      {/* ===== BLOCKS ===== */}
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 p-4 px-8">
        {page.blocks
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((block) => (
            // <BlockRenderer key={block.clientId} block={block} />
            <BlockRenderer
              key={block.clientId}
              block={{
                ...block,
                pageId: page._id,
                uri: page.uri,
              }}
            />
          ))}
      </div>
    </div>
  );
}

// import BlockRenderer from "@/components/blocks/BlockRenderer";

// import Page from "@/models/Page";
// import User from "@/models/User";
// import Event from "@/models/Event";

// import {
//   faDiscord,
//   faFacebook,
//   faGithub,
//   faInstagram,
//   faTelegram,
//   faTiktok,
//   faWhatsapp,
//   faYoutube,
// } from "@fortawesome/free-brands-svg-icons";
// import {
//   faEnvelope,
//   faLocationDot,
//   faPhone,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// // import connectDB from "@/libs/connectDB";
// import connectDB from "@/libs/mongodb.js";
// import Image from "next/image";
// import Link from "next/link";

// /* ================= SAFE IMAGE ================= */
// function safeImage(src, fallback = "/avatar-placeholder.png") {
//   if (typeof src === "string" && src.startsWith("http")) return src;
//   if (src?.url && typeof src.url === "string") return src.url;
//   return fallback;
// }

// /* ================= BUTTON ICONS ================= */
// export const buttonsIcons = {
//   email: faEnvelope,
//   mobile: faPhone,
//   instagram: faInstagram,
//   facebook: faFacebook,
//   discord: faDiscord,
//   tiktok: faTiktok,
//   youtube: faYoutube,
//   whatsapp: faWhatsapp,
//   github: faGithub,
//   telegram: faTelegram,
// };

// function buttonLink(key, value) {
//   if (key === "mobile") return "tel:" + value;
//   if (key === "email") return "mailto:" + value;
//   return value;
// }

// /* ================= PAGE ================= */
// export default async function UserPage({ params }) {
//   const uri = params.uri;

//   await connectDB();

//   const rawPage = await Page.findOne({ uri }).lean();
//   if (!rawPage) return null;

//   /* ========= NORMALIZE BLOCKS (FIX CŨ + MỚI) ========= */
//   const normalizedBlocks = (rawPage.blocks || []).map((block, index) => {
//     let data = block.data ?? {};

//     if (block.type === "link") {
//       data = {
//         links: Array.isArray(data.links)
//           ? data.links
//           : [
//               {
//                 id: block._id || "legacy",
//                 title: data.title || "",
//                 subtitle: data.subtitle || "",
//                 url: data.url || "",
//                 icon: data.icon || "",
//               },
//             ],
//       };
//     }

//     if (block.type === "text") {
//       data = {
//         content:
//           typeof data.content === "string"
//             ? data.content
//             : typeof data.text === "string"
//             ? data.text
//             : "",
//       };
//     }

//     return {
//       _id: block._id?.toString(),
//       clientId: block._id?.toString() || `block-${index}`, // ✅ FIX
//       type: block.type,
//       order: block.order ?? index,
//       data,
//     };
//   });

//   /* ✅ KHAI BÁO page TRƯỚC */
//   const page = {
//     ...rawPage,
//     _id: rawPage._id.toString(),
//     blocks: normalizedBlocks,
//   };

//   /* ✅ GIỜ MỚI ĐƯỢC DÙNG page */
//   const rawUser = await User.findOne({ email: page.owner }).lean();
//   const user = rawUser ? { ...rawUser, _id: rawUser._id.toString() } : null;

//   /* ===== EVENT LOG ===== */
//   try {
//     await Event.create({ uri, page: uri, type: "view" });
//   } catch (_) {}

//   return (
//     <div className="bg-blue-950 text-white min-h-screen">
//       {/* ===== COVER ===== */}
//       <div
//         className="h-36 bg-cover bg-center"
//         style={
//           page.bgType === "color"
//             ? { backgroundColor: page.bgColor }
//             : page.bgImage
//             ? { backgroundImage: `url(${page.bgImage})` }
//             : {}
//         }
//       />

//       {/* ===== AVATAR ===== */}
//       <div className="aspect-square w-36 h-36 mx-auto relative -top-16 -mb-12">
//         <Image
//           className="rounded-full w-full h-full object-cover"
//           src={safeImage(user?.image, "/avatar-placeholder.png")}
//           alt="avatar"
//           width={256}
//           height={256}
//         />
//       </div>

//       {/* ===== INFO ===== */}
//       <h2 className="text-2xl text-center mb-1">{page.displayName}</h2>

//       {page.location && (
//         <h3 className="text-md flex gap-2 justify-center items-center text-white/70">
//           <FontAwesomeIcon className="h-4" icon={faLocationDot} />
//           <span>{page.location}</span>
//         </h3>
//       )}

//       {page.bio && (
//         <div className="max-w-xs mx-auto text-center my-2">
//           <p>{page.bio}</p>
//         </div>
//       )}

//       {/* ===== BUTTONS ===== */}
//       <div className="flex gap-2 justify-center mt-4 pb-4">
//         {Object.entries(page.buttons || {}).map(([key, value]) => {
//           const icon = buttonsIcons[key];
//           if (!icon || !value) return null;

//           return (
//             <Link
//               key={key}
//               href={buttonLink(key, value)}
//               target="_blank"
//               className="rounded-full bg-white text-blue-950 p-2 flex items-center justify-center"
//             >
//               <FontAwesomeIcon className="w-5 h-5" icon={icon} />
//             </Link>
//           );
//         })}
//       </div>

//       {/* ===== BLOCKS ===== */}
//       <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 p-4 px-8">
//         {page.blocks
//           .slice()
//           .sort((a, b) => a.order - b.order)
//           .map((block) => (
//             <BlockRenderer key={block.clientId} block={block} />
//           ))}
//       </div>
//     </div>
//   );
// }
