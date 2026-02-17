"use client";

import { useState } from "react";
import SectionBox from "@/components/layout/SectionBox";
import toast from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGripLines,
  faPlus,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { savePageBlocks, deleteLinkBlock } from "@/actions/pageActions";

export default function PageBlocksForm({ page }) {
  const [blocks, setBlocks] = useState(
    (page.blocks || []).map((b) => ({
      ...b,
      clientId: b.clientId || crypto.randomUUID(),
    }))
  );

  /* ---------- ADD ---------- */

  function addTextBlock() {
    setBlocks((prev) => [
      ...prev,
      {
        _id: crypto.randomUUID(),
        clientId: crypto.randomUUID(),
        type: "text",
        order: prev.length,
        data: { content: "" },
      },
    ]);
  }

  function addLinkBlock() {
    setBlocks((prev) => [
      ...prev,
      {
        _id: crypto.randomUUID(),
        clientId: crypto.randomUUID(),
        type: "link",
        order: prev.length,
        data: {
          links: [
            {
              id: crypto.randomUUID(),
              title: "",
              subtitle: "",
              url: "",
              icon: "",
            },
          ],
        },
      },
    ]);
  }

  /* ---------- DELETE ---------- */

  async function removeBlock(block) {
    setBlocks((prev) => prev.filter((b) => b.clientId !== block.clientId));

    if (block._id) {
      await deleteLinkBlock(block._id);
      toast.success("Block deleted");
    }
  }

  /* ---------- SAVE PAGE ---------- */

  async function handleSavePage() {
    try {
      await savePageBlocks({
        pageId: page._id,
        blocks: blocks.map(({ clientId, ...b }, index) => ({
          ...b,
          order: index,
        })),
      });

      toast.success("Page saved");
    } catch (err) {
      toast.error("Save failed");
    }
  }

  return (
    <SectionBox>
      <h2 className="text-2xl font-bold mb-4">Blocks</h2>

      <div className="flex gap-3 mb-6">
        <button onClick={addLinkBlock} className="p-2 bg-gray-200">
          <FontAwesomeIcon icon={faPlus} /> Add link block
        </button>

        <button onClick={addTextBlock} className="p-2 bg-gray-200">
          ➕ Add text block
        </button>

        <button
          onClick={handleSavePage}
          className="ml-auto p-2 bg-green-600 text-white"
        >
          <FontAwesomeIcon icon={faSave} /> Save page
        </button>
      </div>

      <ReactSortable
        list={blocks}
        setList={(list) => setBlocks(list.map((b, i) => ({ ...b, order: i })))}
        idField="clientId"
        handle=".handle"
      >
        {blocks.map((block) => (
          <div key={block.clientId} className="border p-4 mb-6 rounded">
            <div className="flex items-center gap-2 mb-4 text-gray-500">
              <FontAwesomeIcon
                icon={faGripLines}
                className="handle cursor-move"
              />
              <span className="uppercase text-sm">{block.type}</span>

              <button
                onClick={() => removeBlock(block)}
                className="ml-auto text-gray-400 hover:text-red-500"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>

            {block.type === "text" && (
              <textarea
                className="w-full border rounded p-2 min-h-[120px]"
                value={block.data.content}
                onChange={(e) =>
                  setBlocks((prev) =>
                    prev.map((b) =>
                      b.clientId === block.clientId
                        ? { ...b, data: { content: e.target.value } }
                        : b
                    )
                  )
                }
              />
            )}

            {block.type === "link" &&
              block.data.links.map((link) => (
                <div key={link.id} className="mb-3">
                  <input
                    className="block w-full border p-1 mb-1"
                    placeholder="Title"
                    value={link.title}
                    onChange={(e) =>
                      setBlocks((prev) =>
                        prev.map((b) =>
                          b.clientId === block.clientId
                            ? {
                                ...b,
                                data: {
                                  links: b.data.links.map((l) =>
                                    l.id === link.id
                                      ? { ...l, title: e.target.value }
                                      : l
                                  ),
                                },
                              }
                            : b
                        )
                      )
                    }
                  />

                  <input
                    className="block w-full border p-1"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) =>
                      setBlocks((prev) =>
                        prev.map((b) =>
                          b.clientId === block.clientId
                            ? {
                                ...b,
                                data: {
                                  links: b.data.links.map((l) =>
                                    l.id === link.id
                                      ? { ...l, url: e.target.value }
                                      : l
                                  ),
                                },
                              }
                            : b
                        )
                      )
                    }
                  />
                </div>
              ))}
          </div>
        ))}
      </ReactSortable>
    </SectionBox>
  );
}
// "use client";

// import { useState } from "react";
// import SectionBox from "@/components/layout/SectionBox";
// import toast from "react-hot-toast";
// import { ReactSortable } from "react-sortablejs";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faGripLines,
//   faPlus,
//   faSave,
//   faTrash,
// } from "@fortawesome/free-solid-svg-icons";
// import { saveLinkBlock, deleteLinkBlock } from "@/actions/pageActions";

// export default function PageBlocksForm({ page }) {
//   const [blocks, setBlocks] = useState(
//     (page.blocks || []).map((b) => ({
//       ...b,
//       clientId: b.clientId || crypto.randomUUID(), // chỉ dùng client-side
//     }))
//   );

//   /* ---------- ADD BLOCK ---------- */

//   function addTextBlock() {
//     setBlocks((prev) => [
//       ...prev,
//       {
//         _id: null,
//         clientId: crypto.randomUUID(),
//         type: "text",
//         order: prev.length,
//         data: { content: "" },
//       },
//     ]);
//   }

//   function addLinkBlock() {
//     setBlocks((prev) => [
//       ...prev,
//       {
//         _id: null,
//         clientId: crypto.randomUUID(),
//         type: "link",
//         order: prev.length,
//         data: {
//           links: [
//             {
//               id: crypto.randomUUID(),
//               title: "",
//               subtitle: "",
//               url: "",
//               icon: "",
//             },
//           ],
//         },
//       },
//     ]);
//   }

//   /* ---------- DELETE ---------- */
//   async function removeBlock(block) {
//     if (!block._id) {
//       setBlocks((prev) => prev.filter((b) => b.clientId !== block.clientId));
//       return;
//     }

//     await deleteLinkBlock(block._id);
//     setBlocks((prev) => prev.filter((b) => b.clientId !== block.clientId));
//     toast.success("Block deleted");
//   }

//   /* ---------- SAVE ---------- */
//   async function handleSaveBlock(block) {
//     const res = await saveLinkBlock({
//       pageId: page._id,
//       block: {
//         _id: block._id,
//         type: block.type,
//         order: block.order,
//         data: block.data,
//       },
//     });

//     if (!block._id && res?._id) {
//       setBlocks((prev) =>
//         prev.map((b) =>
//           b.clientId === block.clientId ? { ...b, _id: res._id } : b
//         )
//       );
//     }

//     toast.success("Block saved");
//   }

//   return (
//     <SectionBox>
//       <h2 className="text-2xl font-bold mb-4">Blocks</h2>

//       <div className="flex gap-3 mb-6">
//         <button
//           type="button"
//           onClick={addLinkBlock}
//           className="flex gap-2 p-2 bg-gray-200"
//         >
//           <FontAwesomeIcon icon={faPlus} />
//           Add link block
//         </button>

//         <button
//           type="button"
//           onClick={addTextBlock}
//           className="flex gap-2 p-2 bg-gray-200"
//         >
//           ➕ Add text block
//         </button>
//       </div>

//       <ReactSortable
//         list={blocks}
//         setList={(newList) =>
//           setBlocks(newList.map((b, index) => ({ ...b, order: index })))
//         }
//         idField="clientId" // ✅ FIX QUAN TRỌNG
//         handle=".handle"
//       >
//         {blocks.map((block) => (
//           <div key={block.clientId} className="border p-4 mb-6 rounded">
//             {/* HEADER */}
//             <div className="flex gap-2 items-center mb-4 text-gray-500">
//               <FontAwesomeIcon
//                 icon={faGripLines}
//                 className="handle cursor-move"
//               />
//               <span className="uppercase text-sm">{block.type} block</span>

//               <button
//                 type="button"
//                 onClick={() => removeBlock(block)}
//                 className="ml-auto text-gray-400 hover:text-red-500"
//               >
//                 <FontAwesomeIcon icon={faTrash} />
//               </button>
//             </div>

//             {/* TEXT BLOCK */}
//             {block.type === "text" && (
//               <textarea
//                 className="w-full border rounded p-2 min-h-[120px]"
//                 placeholder="Enter text..."
//                 value={block.data.content}
//                 onChange={(e) =>
//                   setBlocks((prev) =>
//                     prev.map((b) =>
//                       b.clientId === block.clientId
//                         ? { ...b, data: { content: e.target.value } }
//                         : b
//                     )
//                   )
//                 }
//               />
//             )}

//             {/* LINK BLOCK */}
//             {block.type === "link" &&
//               block.data.links.map((link) => (
//                 <div key={link.id} className="mb-3">
//                   <input
//                     className="block w-full border p-1 mb-1"
//                     placeholder="Title"
//                     value={link.title}
//                     onChange={(e) =>
//                       setBlocks((prev) =>
//                         prev.map((b) =>
//                           b.clientId === block.clientId
//                             ? {
//                                 ...b,
//                                 data: {
//                                   links: b.data.links.map((l) =>
//                                     l.id === link.id
//                                       ? { ...l, title: e.target.value }
//                                       : l
//                                   ),
//                                 },
//                               }
//                             : b
//                         )
//                       )
//                     }
//                   />

//                   <input
//                     className="block w-full border p-1"
//                     placeholder="URL"
//                     value={link.url}
//                     onChange={(e) =>
//                       setBlocks((prev) =>
//                         prev.map((b) =>
//                           b.clientId === block.clientId
//                             ? {
//                                 ...b,
//                                 data: {
//                                   links: b.data.links.map((l) =>
//                                     l.id === link.id
//                                       ? { ...l, url: e.target.value }
//                                       : l
//                                   ),
//                                 },
//                               }
//                             : b
//                         )
//                       )
//                     }
//                   />
//                 </div>
//               ))}

//             <button
//               onClick={() => handleSaveBlock(block)}
//               className="flex gap-2 text-green-600 mt-3"
//             >
//               <FontAwesomeIcon icon={faSave} />
//               Save block
//             </button>
//           </div>
//         ))}
//       </ReactSortable>
//     </SectionBox>
//   );
// }

// // "use client";

// // import { useState } from "react";
// // import SectionBox from "@/components/layout/SectionBox";
// // import toast from "react-hot-toast";
// // import { ReactSortable } from "react-sortablejs";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import {
// //   faGripLines,
// //   faPlus,
// //   faSave,
// //   faTrash,
// // } from "@fortawesome/free-solid-svg-icons";
// // import { saveLinkBlock } from "@/actions/pageActions";
// // import { useRouter } from "next/navigation";
// // import { deleteLinkBlock } from "@/actions/pageActions";

// // export default function PageBlocksForm({ page }) {
// //   const router = useRouter();

// //   const [blocks, setBlocks] = useState(
// //     (page.blocks || []).map((b) => ({
// //       ...b,
// //       clientId: crypto.randomUUID(),
// //       data:
// //         b.type === "link"
// //           ? {
// //               links: Array.isArray(b.data?.links) ? b.data.links : [],
// //             }
// //           : b.data ?? {},
// //     }))
// //   );

// //   /* ---------------- ADD LINK BLOCK ---------------- */
// //   function addLinkBlock() {
// //     const id = crypto.randomUUID();

// //     setBlocks((prev) => [
// //       ...prev,
// //       {

// //         _id: null, // 👈 CHƯA CÓ DB ID
// //         clientId: crypto.randomUUID(),

// //         type: "link",
// //         order: blocks.length,
// //         data: {
// //           title: "",
// //           subtitle: "",
// //           url: "",
// //         },
// //       },
// //     ]);
// //   }

// //   /* ---------------- REMOVE BLOCK ---------------- */
// //   async function removeBlock(block) {
// //     // UI remove trước (optimistic)
// //     setBlocks((prev) => prev.filter((b) => b.id !== block.id));

// //     // ❗ nếu block đã tồn tại trong DB → delete DB
// //     if (block._id) {
// //       try {
// //         await deleteLinkBlock(block._id);
// //         toast.success("Block deleted");
// //       } catch (e) {
// //         toast.error("Delete failed");
// //       }
// //     }
// //   }

// //   /* ---------------- SAVE SINGLE BLOCK ---------------- */
// //   async function handleSaveBlock(block) {
// //     try {
// //       await saveLinkBlock({
// //         _id: block._id || null, // ❗ chỉ gửi nếu có thật
// //         type: block.type,
// //         order: block.order,
// //         data: block.data,
// //       });

// //       toast.success("Link block saved");
// //       router.refresh();
// //     } catch (e) {
// //       toast.error(e.message || "Save failed");
// //     }
// //   }

// //   return (
// //     <SectionBox>
// //       <h2 className="text-2xl font-bold mb-4">Link Blocks</h2>

// //       <button
// //         type="button"
// //         onClick={addLinkBlock}
// //         className="flex items-center gap-1 p-2 bg-gray-200 mb-6"
// //       >
// //         <FontAwesomeIcon icon={faPlus} />
// //         Add link block
// //       </button>

// //       <ReactSortable
// //         list={blocks}
// //         setList={setBlocks}
// //         dataIdAttr="id" // 🔥 CHỈ DÙNG ID
// //         handle=".handle"
// //         animation={150}
// //       >
// //         {blocks.map((block) => (
// //           <div
// //             key={block.id}
// //             data-id={block.id}
// //             className="border p-4 mb-6 rounded"
// //           >
// //             <div className="flex items-center gap-2 mb-4 text-gray-500">
// //               <FontAwesomeIcon
// //                 icon={faGripLines}
// //                 className="handle cursor-move"
// //               />
// //               <span className="text-sm uppercase">Link block</span>

// //               <button
// //                 type="button"
// //                 onClick={() => removeBlock(block)}
// //                 className="ml-auto text-gray-400 hover:text-red-500"
// //               >
// //                 <FontAwesomeIcon icon={faTrash} />
// //               </button>
// //             </div>

// //             {block.type === "link" &&
// //               block.data.links.map((link) => (
// //                 <div
// //                   key={link.id}
// //                   className="border rounded p-3 mb-3 bg-gray-50"
// //                 >
// //                   <input
// //                     placeholder="Title"
// //                     value={link.title}
// //                     onChange={(e) => {
// //                       const v = e.target.value;
// //                       setBlocks((prev) =>
// //                         prev.map((b) =>
// //                           b.id === block.id
// //                             ? {
// //                                 ...b,
// //                                 data: {
// //                                   links: b.data.links.map((l) =>
// //                                     l.id === link.id ? { ...l, title: v } : l
// //                                   ),
// //                                 },
// //                               }
// //                             : b
// //                         )
// //                       );
// //                     }}
// //                   />

// //                   <input
// //                     placeholder="URL"
// //                     value={link.url}
// //                     onChange={(e) => {
// //                       const v = e.target.value;
// //                       setBlocks((prev) =>
// //                         prev.map((b) =>
// //                           b.id === block.id
// //                             ? {
// //                                 ...b,
// //                                 data: {
// //                                   links: b.data.links.map((l) =>
// //                                     l.id === link.id ? { ...l, url: v } : l
// //                                   ),
// //                                 },
// //                               }
// //                             : b
// //                         )
// //                       );
// //                     }}
// //                   />
// //                 </div>
// //               ))}

// //             <button
// //               type="button"
// //               onClick={() =>
// //                 setBlocks((prev) =>
// //                   prev.map((b) =>
// //                     b.id === block.id
// //                       ? {
// //                           ...b,
// //                           data: {
// //                             links: [
// //                               ...b.data.links,
// //                               {
// //                                 id: crypto.randomUUID(),
// //                                 title: "",
// //                                 subtitle: "",
// //                                 url: "",
// //                                 icon: "",
// //                               },
// //                             ],
// //                           },
// //                         }
// //                       : b
// //                   )
// //                 )
// //               }
// //               className="text-blue-600 text-sm mb-4"
// //             >
// //               ➕ Add link
// //             </button>

// //             <button
// //               type="button"
// //               onClick={() => handleSaveBlock(block)}
// //               className="flex items-center gap-1 text-green-600"
// //             >
// //               <FontAwesomeIcon icon={faSave} />
// //               Save block
// //             </button>
// //           </div>
// //         ))}
// //       </ReactSortable>
// //     </SectionBox>
// //   );
// // }

// // // "use client";

// // // import { useState } from "react";
// // // import SectionBox from "@/components/layout/SectionBox";
// // // import { ReactSortable } from "react-sortablejs";
// // // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // // import {
// // //   faGripLines,
// // //   faPlus,
// // //   faTrash,
// // //   faLink,
// // // } from "@fortawesome/free-solid-svg-icons";

// // // export default function PageBlocksForm({ page }) {
// // //   const [blocks, setBlocks] = useState(page.blocks || []);

// // //   function addLinkBlock() {
// // //     setBlocks((prev) => [
// // //       ...prev,
// // //       {
// // //         type: "link",
// // //         order: prev.length,
// // //         data: {
// // //           title: "",
// // //           subtitle: "",
// // //           url: "",
// // //           icon: "",
// // //         },
// // //       },
// // //     ]);
// // //   }

// // //   function updateBlock(index, field, value) {
// // //     setBlocks((prev) => {
// // //       const copy = [...prev];
// // //       copy[index].data[field] = value;
// // //       return copy;
// // //     });
// // //   }

// // //   function removeBlock(index) {
// // //     setBlocks((prev) => prev.filter((_, i) => i !== index));
// // //   }

// // //   return (
// // //     <SectionBox>
// // //       <h2 className="text-2xl font-bold mb-4">Blocks</h2>

// // //       <button
// // //         type="button"
// // //         onClick={addLinkBlock}
// // //         className="mb-4 flex gap-2 items-center text-blue-600"
// // //       >
// // //         <FontAwesomeIcon icon={faPlus} />
// // //         Add link block
// // //       </button>

// // //       <ReactSortable list={blocks} setList={setBlocks} handle=".handle">
// // //         {blocks.map((block, index) => (
// // //           <div
// // //             key={index}
// // //             className="border rounded-lg p-4 bg-white shadow-sm flex gap-4 items-start"
// // //           >
// // //             <div className="handle cursor-move pt-2">
// // //               <FontAwesomeIcon icon={faGripLines} />
// // //             </div>

// // //             {block.type === "link" && (
// // //               <div className="grow space-y-2">
// // //                 <input
// // //                   placeholder="Title"
// // //                   value={block.data.title}
// // //                   onChange={(e) => updateBlock(index, "title", e.target.value)}
// // //                 />
// // //                 <input
// // //                   placeholder="Subtitle"
// // //                   value={block.data.subtitle}
// // //                   onChange={(e) =>
// // //                     updateBlock(index, "subtitle", e.target.value)
// // //                   }
// // //                 />
// // //                 <input
// // //                   placeholder="URL"
// // //                   value={block.data.url}
// // //                   onChange={(e) => updateBlock(index, "url", e.target.value)}
// // //                 />
// // //               </div>
// // //             )}

// // //             <button
// // //               type="button"
// // //               onClick={() => removeBlock(index)}
// // //               className="text-red-600"
// // //             >
// // //               <FontAwesomeIcon icon={faTrash} />
// // //             </button>
// // //           </div>
// // //         ))}
// // //       </ReactSortable>
// // //     </SectionBox>
// // //   );
// // // }
// // "use client";

// // import { useState } from "react";
// // import SectionBox from "@/components/layout/SectionBox";
// // import SubmitButton from "@/components/buttons/SubmitButton";
// // import { savePageBlocks } from "@/actions/pageActions";
// // import toast from "react-hot-toast";
// // import { ReactSortable } from "react-sortablejs";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import LinkBlockItem from "@/components/blocks/LinkBlockItem";
// // import {
// //   faGripLines,
// //   faPlus,
// //   faSave,
// //   faTrash,
// // } from "@fortawesome/free-solid-svg-icons";

// // export default function PageBlocksForm({ page }) {
// //   const [blocks, setBlocks] = useState(
// //     (page.blocks || []).map((b) => ({
// //       ...b,
// //       _tempId: crypto.randomUUID(), // 👈 key cho React
// //     }))
// //   );

// //   function addTextBlock() {
// //     setBlocks((prev) => [
// //       ...prev,
// //       {
// //         _tempId: crypto.randomUUID(),
// //         type: "text",
// //         order: prev.length,
// //         data: { text: "" },
// //       },
// //     ]);
// //   }

// //   function addLinkBlock() {
// //     setBlocks((prev) => [
// //       ...prev,
// //       {
// //         _tempId: crypto.randomUUID(),
// //         type: "link",
// //         order: prev.length,
// //         data: {
// //           title: "",
// //           subtitle: "",
// //           url: "",
// //           icon: "",
// //         },
// //       },
// //     ]);
// //   }

// //   function removeBlock(tempId) {
// //     setBlocks((prev) => prev.filter((b) => b._tempId !== tempId));
// //   }

// //   async function save() {
// //     const cleanBlocks = blocks.map(({ _tempId, ...b }, index) => ({
// //       ...b,
// //       order: index,
// //     }));

// //     await savePageBlocks(cleanBlocks);
// //     toast.success("Blocks saved!");
// //   }

// //   return (
// //     <SectionBox>
// //       <form action={save}>
// //         <h2 className="text-2xl font-bold mb-4">Blocks</h2>

// //         {/* hidden để giữ style giống ButtonsForm */}
// //         <input
// //           type="hidden"
// //           name="_blocksOrder"
// //           value={blocks.map((b) => b.type).join(",")}
// //         />

// //         <div className="flex gap-2 mb-4">
// //           <button
// //             type="button"
// //             onClick={addLinkBlock}
// //             className="flex items-center gap-1 p-2 bg-gray-200"
// //           >
// //             <FontAwesomeIcon icon={faPlus} />
// //             Link block
// //           </button>

// //           <button
// //             type="button"
// //             onClick={addTextBlock}
// //             className="flex items-center gap-1 p-2 bg-gray-200"
// //           >
// //             <FontAwesomeIcon icon={faPlus} />
// //             Text block
// //           </button>
// //         </div>

// //         <ReactSortable
// //           list={blocks}
// //           setList={setBlocks}
// //           handle=".handle"
// //           animation={150}
// //         >
// //           {blocks.map((block, i) => (
// //             <div key={block._tempId} className="border p-4 mb-4 rounded">
// //               <div className="flex items-center gap-2 mb-2 text-gray-500">
// //                 <FontAwesomeIcon
// //                   icon={faGripLines}
// //                   className="handle cursor-move"
// //                 />
// //                 <span className="text-sm uppercase">{block.type}</span>

// //                 <button
// //                   type="button"
// //                   onClick={() => removeBlock(block._tempId)}
// //                   className="ml-auto text-gray-400 hover:text-red-500"
// //                 >
// //                   <FontAwesomeIcon icon={faTrash} />
// //                 </button>
// //               </div>

// //               {block.type === "link" && (
// //                 <>
// //                   <input
// //                     placeholder="Title"
// //                     value={block.data.title}
// //                     onChange={(e) => {
// //                       const v = e.target.value;
// //                       setBlocks((prev) =>
// //                         prev.map((b) =>
// //                           b._tempId === block._tempId
// //                             ? { ...b, data: { ...b.data, title: v } }
// //                             : b
// //                         )
// //                       );
// //                     }}
// //                   />

// //                   <input
// //                     placeholder="URL"
// //                     value={block.data.url}
// //                     onChange={(e) => {
// //                       const v = e.target.value;
// //                       setBlocks((prev) =>
// //                         prev.map((b) =>
// //                           b._tempId === block._tempId
// //                             ? { ...b, data: { ...b.data, url: v } }
// //                             : b
// //                         )
// //                       );
// //                     }}
// //                   />
// //                 </>
// //               )}

// //               {block.type === "text" && (
// //                 <textarea
// //                   placeholder="Write something..."
// //                   value={block.data.text}
// //                   onChange={(e) => {
// //                     const v = e.target.value;
// //                     setBlocks((prev) =>
// //                       prev.map((b) =>
// //                         b._tempId === block._tempId
// //                           ? { ...b, data: { ...b.data, text: v } }
// //                           : b
// //                       )
// //                     );
// //                   }}
// //                   className="w-full min-h-[80px]"
// //                 />
// //               )}
// //             </div>
// //           ))}
// //         </ReactSortable>

// //         <div className="max-w-xs mx-auto mt-8">
// //           <SubmitButton>
// //             <FontAwesomeIcon icon={faSave} />
// //             <span>Save</span>
// //           </SubmitButton>
// //         </div>
// //       </form>
// //     </SectionBox>
// //   );
// // }
