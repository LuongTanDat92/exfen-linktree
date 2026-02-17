"use client";
import { trackLinkClick } from "@/actions/analytics";

export default function LinkBlock({ blockId, pageId, uri, links = [] }) {
  if (!links.length) return null;

  async function handleClick(link) {
    try {
      await trackLinkClick({
        uri,
        pageId,
        blockId,
        url: link.url,
      });
    } catch (err) {
      console.warn("trackLinkClick failed", err);
    }

    window.open(link.url, "_blank");
  }

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <button
          key={link.id}
          onClick={() => handleClick(link)}
          className="block w-full text-left p-4 bg-white text-blue-950 rounded-lg"
        >
          <div className="font-semibold">{link.title}</div>
          {link.subtitle && (
            <div className="text-sm opacity-70">{link.subtitle}</div>
          )}
        </button>
      ))}
    </div>
  );
}
