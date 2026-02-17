"use client";

import { Toaster } from "react-hot-toast";

export default function AppTemplate({ children }) {
  return (
    <div className="font-sans">
      <Toaster
        position="bottom-center"
        toastOptions={{
          className:
            "!bg-blue-900 !text-white !rounded-xl !px-4 !py-3 !shadow-lg",
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
      {children}
    </div>
  );
}
