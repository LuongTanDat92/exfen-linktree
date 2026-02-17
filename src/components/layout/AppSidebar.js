"use client";

import LogoutButton from "@/components/buttons/LogoutButton";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

function navClass(active) {
  const base =
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition";

  if (active) {
    return `${base} bg-blue-50 text-blue-700`;
  }

  return `${base} text-slate-600 hover:bg-slate-100 hover:text-slate-900`;
}

export default function AppSidebar() {
  const path = usePathname();

  return (
    <nav className="space-y-2">
      <Link href="/account" className={navClass(path === "/account")}>
        <FontAwesomeIcon fixedWidth icon={faFileLines} className="h-4 w-4" />
        <span className="font-medium">My Page</span>
      </Link>

      <Link
        href="/analytics"
        className={navClass(path === "/analytics")}
      >
        <FontAwesomeIcon fixedWidth icon={faChartLine} className="h-4 w-4" />
        <span className="font-medium">Analytics</span>
      </Link>

      <div className="pt-2">
        <LogoutButton
          iconLeft
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          iconClasses="h-4 w-4"
        />
      </div>

      <div className="border-t border-slate-200 pt-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-slate-500 transition hover:text-slate-700"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
          <span>Back to website</span>
        </Link>
      </div>
    </nav>
  );
}
