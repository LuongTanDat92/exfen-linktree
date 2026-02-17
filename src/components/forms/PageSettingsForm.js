// "use client";
// import { savePageSettings } from "@/actions/pageActions";
// import SubmitButton from "@/components/buttons/SubmitButton";
// import RadioTogglers from "@/components/formItems/radioTogglers";
// import SectionBox from "@/components/layout/SectionBox";
// import { upload } from "@/libs/upload";
// import {
//   faCloudArrowUp,
//   faImage,
//   faPalette,
//   faSave,
//   faUpload,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Image from "next/image";
// import { useState } from "react";
// import toast from "react-hot-toast";

// export default function PageSettingsForm({ page, user }) {
//   const [bgType, setBgType] = useState(page.bgType);
//   const [bgColor, setBgColor] = useState(page.bgColor);
//   const [bgImage, setBgImage] = useState(page.bgImage);
//   const [avatar, setAvatar] = useState(user?.image);
//   async function saveBaseSettings(formData) {
//     const result = await savePageSettings(formData);
//     if (result) {
//       toast.success("Saved!");
//     }
//   }

//   async function handleCoverImageChange(ev) {
//     await upload(ev, (link) => {
//       setBgImage(link);
//     });
//   }
//   async function handleAvatarImageChange(ev) {
//     await upload(ev, (link) => {
//       setAvatar(link);
//     });
//   }
//   return (
//     <div>
//       <SectionBox>
//         <form action={saveBaseSettings}>
//           <div
//             className="py-4 -m-4 min-h-[300px] flex justify-center items-center bg-cover bg-center"
//             style={
//               bgType === "color"
//                 ? { backgroundColor: bgColor }
//                 : { backgroundImage: `url(${bgImage})` }
//             }
//           >
//             <div>
//               <RadioTogglers
//                 defaultValue={page.bgType}
//                 options={[
//                   { value: "color", icon: faPalette, label: "Color" },
//                   { value: "image", icon: faImage, label: "Image" },
//                 ]}
//                 onChange={(val) => setBgType(val)}
//               />
//               {bgType === "color" && (
//                 <div className="bg-gray-200 shadow text-gray-700 p-2 mt-2">
//                   <div className="flex gap-2 justify-center">
//                     <span>Background color:</span>
//                     <input
//                       type="color"
//                       name="bgColor"
//                       onChange={(ev) => setBgColor(ev.target.value)}
//                       defaultValue={page.bgColor}
//                     />
//                   </div>
//                 </div>
//               )}
//               {bgType === "image" && (
//                 <div className="flex justify-center">
//                   <label className="bg-white shadow px-4 py-2 mt-2 flex gap-2">
//                     <input type="hidden" name="bgImage" value={bgImage} />
//                     <input
//                       type="file"
//                       onChange={handleCoverImageChange}
//                       className="hidden"
//                     />
//                     <div className="flex gap-2 items-center cursor-pointer">
//                       <FontAwesomeIcon
//                         icon={faCloudArrowUp}
//                         className="text-gray-700"
//                       />
//                       <span>Change image</span>
//                     </div>
//                   </label>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="flex justify-center -mb-12">
//             <div className="relative -top-8 w-[128px] h-[128px]">
//               <div className="overflow-hidden h-full rounded-full border-4 border-white shadow shadow-black/50">
//                 <Image
//                   className="w-full h-full object-cover"
//                   src={avatar}
//                   alt={"avatar"}
//                   width={128}
//                   height={128}
//                 />
//               </div>
//               <label
//                 htmlFor="avatarIn"
//                 className="absolute bottom-0 -right-2 bg-white p-2 rounded-full shadow shadow-black/50 aspect-square flex items-center cursor-pointer"
//               >
//                 <FontAwesomeIcon size={"xl"} icon={faCloudArrowUp} />
//               </label>
//               <input
//                 onChange={handleAvatarImageChange}
//                 id="avatarIn"
//                 type="file"
//                 className="hidden"
//               />
//               <input type="hidden" name="avatar" value={avatar} />
//             </div>
//           </div>
//           <div className="p-0">
//             <label className="input-label" htmlFor="nameIn">
//               Display name
//             </label>
//             <input
//               type="text"
//               id="nameIn"
//               name="displayName"
//               defaultValue={page.displayName}
//               placeholder="John Doe"
//             />
//             <label className="input-label" htmlFor="locationIn">
//               Location
//             </label>
//             <input
//               type="text"
//               id="locationIn"
//               name="location"
//               defaultValue={page.location}
//               placeholder="Somewhere in the world"
//             />
//             <label className="input-label" htmlFor="bioIn">
//               Bio
//             </label>
//             <textarea
//               name="bio"
//               defaultValue={page.bio}
//               id="bioIn"
//               placeholder="Your bio goes here..."
//             />
//             <div className="max-w-[200px] mx-auto">
//               <SubmitButton>
//                 <FontAwesomeIcon icon={faSave} />
//                 <span>Save</span>
//               </SubmitButton>
//             </div>
//           </div>
//         </form>
//       </SectionBox>
//     </div>
//   );
// }
"use client";

import { savePageSettings } from "@/actions/pageActions";
import SubmitButton from "@/components/buttons/SubmitButton";
import RadioTogglers from "@/components/formItems/radioTogglers";
import SectionBox from "@/components/layout/SectionBox";
import { upload } from "@/libs/upload";
import {
  faCloudArrowUp,
  faImage,
  faPalette,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function PageSettingsForm({ page, user }) {
  const [bgType, setBgType] = useState(page.bgType);
  const [bgColor, setBgColor] = useState(page.bgColor);
  const [bgImage, setBgImage] = useState(page.bgImage);
  const [avatar, setAvatar] = useState(user?.image);

  const safeAvatar =
    typeof avatar === "string" && avatar.startsWith("http")
      ? avatar
      : "/avatar-placeholder.png";

  async function saveBaseSettings(formData) {
    const result = await savePageSettings(formData);
    if (result) toast.success("Saved!");
  }

  async function handleCoverImageChange(ev) {
    await upload(ev, (url) => {
      setBgImage(url);
    });
  }

  async function handleAvatarImageChange(ev) {
    await upload(ev, (url) => {
      setAvatar(url);
    });
  }

  return (
    <SectionBox>
      <form action={saveBaseSettings} className="space-y-6">
        <input type="hidden" name="bgType" value={bgType} />

        {/* Cover */}
        <div
          className="relative py-6 -m-4 min-h-[320px] flex justify-center items-center bg-cover bg-center rounded-xl overflow-hidden"
          style={
            bgType === "color"
              ? { backgroundColor: bgColor }
              : bgImage
              ? { backgroundImage: `url(${bgImage})` }
              : {}
          }
        >
          <div className="relative z-10 text-center">
            <RadioTogglers
              defaultValue={page.bgType}
              options={[
                { value: "color", icon: faPalette, label: "Color" },
                { value: "image", icon: faImage, label: "Image" },
              ]}
              onChange={setBgType}
            />

            {bgType === "color" && (
              <div className="bg-white/90 backdrop-blur shadow rounded-lg text-gray-700 px-4 py-2 mt-3 inline-block">
                <div className="flex gap-3 items-center">
                  <span className="text-sm font-medium">Background color</span>
                  <input
                    type="color"
                    name="bgColor"
                    defaultValue={page.bgColor}
                    onChange={(ev) => setBgColor(ev.target.value)}
                  />
                </div>
              </div>
            )}

            {bgType === "image" && (
              <div className="flex justify-center mt-3">
                <label
                  htmlFor="coverIn"
                  className="bg-white/90 backdrop-blur shadow px-4 py-2 rounded-lg flex gap-2 cursor-pointer hover:opacity-80 transition"
                >
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                  <span>Change image</span>
                </label>

                <input
                  id="coverIn"
                  type="file"
                  className="hidden"
                  onChange={handleCoverImageChange}
                />

                <input type="hidden" name="bgImage" value={bgImage || ""} />
              </div>
            )}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-16">
          <div className="relative w-[128px] h-[128px]">
            <div className="overflow-hidden h-full rounded-full border-4 border-white shadow-lg">
              <Image
                src={safeAvatar}
                alt="avatar"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>

            <label
              htmlFor="avatarIn"
              className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow cursor-pointer hover:scale-105 transition"
            >
              <FontAwesomeIcon icon={faCloudArrowUp} />
            </label>

            <input
              id="avatarIn"
              type="file"
              className="hidden"
              onChange={handleAvatarImageChange}
            />

            <input type="hidden" name="avatar" value={avatar || ""} />
          </div>
        </div>

        {/* Profile fields */}
        <div className="space-y-4 pt-4">
          <div>
            <label className="input-label">Display name</label>
            <input
              name="displayName"
              defaultValue={page.displayName}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="input-label">Location</label>
            <input
              name="location"
              defaultValue={page.location}
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className="input-label">Bio</label>
            <textarea
              name="bio"
              defaultValue={page.bio}
              placeholder="Tell something about yourself"
            />
          </div>

          <div className="max-w-[220px] mx-auto pt-2">
            <SubmitButton>
              <FontAwesomeIcon icon={faSave} />
              <span>Save</span>
            </SubmitButton>
          </div>
        </div>
      </form>
    </SectionBox>
  );
}

// "use client";

// import { savePageSettings } from "@/actions/pageActions";
// import SubmitButton from "@/components/buttons/SubmitButton";
// import RadioTogglers from "@/components/formItems/radioTogglers";
// import SectionBox from "@/components/layout/SectionBox";
// import { upload } from "@/libs/upload";
// import {
//   faCloudArrowUp,
//   faImage,
//   faPalette,
//   faSave,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Image from "next/image";
// import { useState } from "react";
// import toast from "react-hot-toast";

// export default function PageSettingsForm({ page, user }) {
//   const [bgType, setBgType] = useState(page?.bgType || "color");
//   const [bgColor, setBgColor] = useState(page?.bgColor || "#ffffff");
//   const [bgImage, setBgImage] = useState(
//     typeof page?.bgImage === "string" ? page.bgImage : ""
//   );

//   const [avatar, setAvatar] = useState(
//     typeof user?.image === "string" ? user.image : ""
//   );

//   async function saveBaseSettings(formData) {
//     const result = await savePageSettings(formData);
//     if (result) toast.success("Saved!");
//   }

//   async function handleCoverImageChange(ev) {
//     await upload(ev, (link) => {
//       if (typeof link === "string") setBgImage(link);
//     });
//   }

//   async function handleAvatarImageChange(ev) {
//     await upload(ev, (link) => {
//       if (typeof link === "string") setAvatar(link);
//     });
//   }

//   const validAvatar = typeof avatar === "string" && avatar.startsWith("http");

//   return (
//     <SectionBox>
//       <form action={saveBaseSettings}>
//         <div
//           className="py-4 -m-4 min-h-[300px] flex justify-center items-center bg-cover bg-center"
//           style={
//             bgType === "color"
//               ? { backgroundColor: bgColor }
//               : bgImage
//               ? { backgroundImage: `url(${bgImage})` }
//               : {}
//           }
//         >
//           <div>
//             <RadioTogglers
//               defaultValue={page?.bgType}
//               options={[
//                 { value: "color", icon: faPalette, label: "Color" },
//                 { value: "image", icon: faImage, label: "Image" },
//               ]}
//               onChange={(val) => setBgType(val)}
//             />

//             {bgType === "color" && (
//               <div className="bg-gray-200 shadow text-gray-700 p-2 mt-2">
//                 <div className="flex gap-2 justify-center">
//                   <span>Background color:</span>
//                   <input
//                     type="color"
//                     name="bgColor"
//                     value={bgColor}
//                     onChange={(ev) => setBgColor(ev.target.value)}
//                   />
//                 </div>
//               </div>
//             )}

//             {bgType === "image" && (
//               <div className="flex justify-center">
//                 <label className="bg-white shadow px-4 py-2 mt-2 flex gap-2 cursor-pointer">
//                   <input type="hidden" name="bgImage" value={bgImage} />
//                   <input
//                     type="file"
//                     onChange={handleCoverImageChange}
//                     className="hidden"
//                   />
//                   <FontAwesomeIcon icon={faCloudArrowUp} />
//                   <span>Change image</span>
//                 </label>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* AVATAR */}
//         <div className="flex justify-center -mb-12">
//           <div className="relative -top-8 w-[128px] h-[128px]">
//             <div className="overflow-hidden h-full rounded-full border-4 border-white shadow">
//               {validAvatar ? (
//                 <Image
//                   src={avatar}
//                   alt="avatar"
//                   width={128}
//                   height={128}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
//                   No image
//                 </div>
//               )}
//             </div>

//             <label
//               htmlFor="avatarIn"
//               className="absolute bottom-0 -right-2 bg-white p-2 rounded-full shadow cursor-pointer"
//             >
//               <FontAwesomeIcon size="xl" icon={faCloudArrowUp} />
//             </label>

//             <input
//               id="avatarIn"
//               type="file"
//               className="hidden"
//               onChange={handleAvatarImageChange}
//             />
//             <input type="hidden" name="avatar" value={avatar} />
//           </div>
//         </div>

//         {/* TEXT INFO */}
//         <div className="p-0">
//           <label className="input-label">Display name</label>
//           <input name="displayName" defaultValue={page?.displayName} />

//           <label className="input-label">Location</label>
//           <input name="location" defaultValue={page?.location} />

//           <label className="input-label">Bio</label>
//           <textarea name="bio" defaultValue={page?.bio} />

//           <div className="max-w-[200px] mx-auto">
//             <SubmitButton>
//               <FontAwesomeIcon icon={faSave} />
//               <span>Save</span>
//             </SubmitButton>
//           </div>
//         </div>
//       </form>
//     </SectionBox>
//   );
// }
