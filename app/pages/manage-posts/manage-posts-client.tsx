"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FoundItemExpiration from "@/app/components/found-item-expiration";
import Sidebar from "@/app/components/sidebar/page";
import StatusBadge from "@/app/components/status-badge";
import { Item, sampleItems } from "@/app/lib/items";
import {
  getActiveItems,
  loadRecoveryRequests,
  loadStoredItems,
  RecoveryRequest,
  saveStoredItems,
} from "@/app/lib/item-storage";

type ManagePostsClientProps = {
  role: "student" | "faculty" | "admin";
  userName?: string;
};

export default function ManagePostsClient({
  role,
  userName,
}: ManagePostsClientProps) {
  const [recoveryRequests] = useState<RecoveryRequest[]>(() =>
    typeof window === "undefined" ? [] : loadRecoveryRequests(),
  );
  const [items, setItems] = useState<Item[]>(() =>
    typeof window === "undefined"
      ? sampleItems
      : getActiveItems([...sampleItems, ...loadStoredItems()], recoveryRequests),
  );

  const openItems = useMemo(
    () => items.filter((item) => item.status !== "Claimed"),
    [items],
  );

  function markAsFound(id: number) {
    setItems((currentItems) =>
      updateStoredItems(
        currentItems.map((item) =>
          item.id === id ? { ...item, status: "Found" } : item,
        ),
      ),
    );
  }

  function deleteItem(id: number) {
    setItems((currentItems) =>
      updateStoredItems(currentItems.filter((item) => item.id !== id)),
    );
  }

  function updateStoredItems(updatedItems: Item[]) {
    saveStoredItems(updatedItems.filter((item) => item.id > sampleItems.length));

    return updatedItems;
  }

  if (role !== "admin") {
    return (
      <main className="flex min-h-screen bg-gray-100">
        <Sidebar role={role} userName={userName} />
        <section className="flex-1 p-6">
          <div className="content-wrapper-fade rounded-lg bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">
              Manager Access Required
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Students can view items and post lost or found reports. Manager
              tools are limited to admin accounts.
            </p>
            <Link
              href="/pages/login"
              className="mt-5 inline-flex rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Return to login
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar role="admin" userName={userName} />

      <section className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Manage Posts</h1>
          <p className="mt-1 text-sm text-gray-600">
            Delete invalid posts or mark lost reports as found.
          </p>
        </div>

        <div className="space-y-4">
          {openItems.map((item, index) => (
            <article
              key={item.id}
              className="content-wrapper-fade rounded-lg bg-white p-5 shadow-sm"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {item.category} - {item.location}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>

              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="mt-4 h-44 w-full rounded-md bg-gray-100 object-contain"
                />
              ) : null}

              <p className="mt-4 text-sm text-gray-700">{item.description}</p>
              <FoundItemExpiration
                item={item}
                recoveryRequests={recoveryRequests}
              />

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => markAsFound(item.id)}
                  disabled={item.status === "Found"}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Mark as found
                </button>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
