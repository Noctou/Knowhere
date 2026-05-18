"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import MenuIcon from "@/app/components/menu-icon";

type SidebarProps = {
  role?: "student" | "faculty" | "admin";
  userName?: string;
};

export default function Sidebar({ role = "student", userName }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const inactivityTimerRef = useRef<number | null>(null);
  const displayName =
    role === "admin"
      ? "Manager"
      : userName || (role === "faculty" ? "Faculty" : "Student");
  const userQuery = userName ? `&user=${encodeURIComponent(userName)}` : "";
  const roleQuery = `?role=${role}${userQuery}`;
  const navigationLinks = [
    { href: `/pages/search-browse${roleQuery}`, label: "Search & Browse" },
    ...(role === "admin"
      ? []
      : [
          { href: `/pages/report-lost${roleQuery}`, label: "Report Lost" },
          { href: `/pages/report-found${roleQuery}`, label: "Report Found" },
          { href: `/pages/recover-item${roleQuery}`, label: "Recover Item" },
        ]),
    ...(role === "admin"
      ? [
          { href: `/pages/manage-posts${roleQuery}`, label: "Manage Posts" },
          {
            href: `/pages/recovered-items${roleQuery}`,
            label: "Recovered Items",
          },
        ]
      : []),
  ];

  const resetInactivityTimer = useCallback(() => {
    if (!isOpen) {
      return;
    }

    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 8000);
  }, [isOpen]);

  useEffect(() => {
    resetInactivityTimer();

    return () => {
      if (inactivityTimerRef.current) {
        window.clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="app-sidebar"
        className={`fixed left-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-md bg-green-700 text-white shadow-lg transition-opacity md:hidden ${
          isOpen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <MenuIcon />
      </button>

      {isOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
        />
      ) : null}

      <aside
        id="app-sidebar"
        onClick={resetInactivityTimer}
        onFocus={resetInactivityTimer}
        onMouseMove={resetInactivityTimer}
        onTouchStart={resetInactivityTimer}
        className={`fixed inset-y-0 left-0 z-40 flex min-h-screen w-64 shrink-0 flex-col bg-green-700 px-4 py-6 text-white shadow-xl transition-transform duration-200 md:static md:z-auto md:self-stretch md:translate-x-0 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8">
        <Image
          src="/logo.png"
          alt="Our Lady of Fatima University"
          width={232}
          height={35}
          priority
          className="mx-auto mb-6 h-auto w-full max-w-[200px]"
        />
        <h1 className="text-2xl font-semibold tracking-wide">Knowhere</h1>
        <p className="mt-1 text-sm text-green-50/80">
          Lost and found portal
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navigationLinks.map((link) => {
          const isActive = pathname === link.href.split("?")[0];

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              aria-current={isActive ? "page" : undefined}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-green-50 text-green-800 shadow-sm"
                  : "text-green-50/90 hover:bg-green-600 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-green-500/60 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-sm font-semibold ring-1 ring-green-300/40">
            {role === "admin" ? "MG" : displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs capitalize text-green-50/75">
              {role} access
            </p>
          </div>
        </div>
        <Link
          href="/pages/login"
          className="mt-4 block rounded-md border border-green-400/70 px-3 py-2 text-center text-sm font-medium text-green-50/90 transition hover:bg-green-600 hover:text-white"
        >
          Sign out
        </Link>
      </div>
      </aside>
    </>
  );
}
