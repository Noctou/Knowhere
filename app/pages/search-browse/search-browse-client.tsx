"use client";

import Link from "next/link";
import { useState } from "react";
import Sidebar from "@/app/components/sidebar/page";
import { Item, sampleItems } from "@/app/lib/items";
import { loadStoredItems } from "@/app/lib/item-storage";

type SearchBrowseClientProps = {
  role: "student" | "faculty" | "admin";
  userName?: string;
};

export default function SearchBrowseClient({
  role,
  userName,
}: SearchBrowseClientProps) {
  const query = `role=${role}${userName ? `&user=${encodeURIComponent(userName)}` : ""}`;
  const [items] = useState<Item[]>(() =>
    typeof window === "undefined"
      ? sampleItems
      : [...sampleItems, ...loadStoredItems()],
  );

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar role={role} userName={userName} />

      <section className="flex-1 p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Lost and Found Items
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {role === "admin"
                ? "Review all campus posts and manage item status."
                : "Browse items or post a lost or found report."}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/pages/report-lost?${query}`}
              className="rounded-md border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
            >
              Report lost
            </Link>
            <Link
              href={`/pages/report-found?${query}`}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Report found
            </Link>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {item.category} - {item.location}
                  </p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {item.status}
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-700">{item.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Posted by {item.postedBy}</span>
                <span>{item.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
