import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AppSidebar from "@/components/layout/AppSidebar";
import Page from "@/models/Page";
import connectDB from "@/libs/mongodb";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

function safeAvatar(src) {
  if (typeof src === "string" && src.startsWith("http")) return src;
  return "/avatar-placeholder.png";
}

export default async function AppTemplate({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let page = null;

  try {
    await connectDB();
    page = await Page.findOne({ owner: session.user.email }).lean();
  } catch (e) {
    page = null;
  }

  const avatar = safeAvatar(session?.user?.image);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Toaster position="bottom-center" />

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
          <div className="sticky top-6 space-y-6">
            <div className="space-y-4 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-white">
                  <Image src={avatar} alt="avatar" width={48} height={48} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {session.user?.name || "Your account"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {session.user?.email || ""}
                  </p>
                </div>
              </div>

              {page?.uri && (
                <Link
                  href={`/${page.uri}`}
                  target="_blank"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Open public page
                </Link>
              )}
            </div>

            <AppSidebar />
          </div>
        </aside>

        <main className="min-w-0 flex-1 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-white">
                <Image src={avatar} alt="avatar" width={40} height={40} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {session.user?.name || "Your account"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {session.user?.email || ""}
                </p>
              </div>
            </div>
            <AppSidebar />
          </div>

          <div className="space-y-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
