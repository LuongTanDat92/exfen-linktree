// src/app/layout.js

export const metadata = {
  title: "LinkList",
  description: "Link in bio platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
