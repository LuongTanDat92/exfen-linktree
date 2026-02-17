"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function buttonLink(key, value) {
  if (key === "mobile") return "tel:" + value;
  if (key === "email") return "mailto:" + value;
  return value;
}

export default function PageButtons({ buttons, pageId, uri, icons }) {
  return (
    <div className="flex gap-2 justify-center mt-4 pb-4">
      {Object.entries(buttons || {}).map(([key, value]) => {
        const icon = icons[key];
        if (!icon || !value) return null;

        const href = buttonLink(key, value);

        return (
          <button
            key={key}
            type="button"
            className="rounded-full bg-white text-blue-950 p-2 flex items-center justify-center"
            onClick={async () => {
              try {
                await fetch("/api/track/button-click", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    type: "button_click",
                    page: pageId,
                    uri,
                    buttonType: key,
                    url: href,
                  }),
                  keepalive: true, // ✅ QUAN TRỌNG
                });
              } catch (e) {}

              window.open(href, "_blank"); // 👉 điều hướng SAU
            }}
          >
            <FontAwesomeIcon className="w-5 h-5" icon={icon} />
          </button>
        );
      })}
    </div>
  );
}
