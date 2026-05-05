"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar/page";
import { Item, sampleItems } from "@/app/lib/items";
import {
  addRecoveryRequest,
  loadRecoveryRequests,
  loadStoredItems,
} from "@/app/lib/item-storage";

type RecoverItemClientProps = {
  role: "student" | "faculty" | "admin";
  userName?: string;
};

export default function RecoverItemClient({
  role,
  userName,
}: RecoverItemClientProps) {
  const requester = role === "admin" ? "Manager" : userName || "Student";
  const [items] = useState<Item[]>(() =>
    typeof window === "undefined"
      ? sampleItems
      : [...sampleItems, ...loadStoredItems()],
  );
  const foundItems = items.filter((item) => item.status === "Found");
  const [requestedItemIds, setRequestedItemIds] = useState<number[]>(() =>
    typeof window === "undefined"
      ? []
      : loadRecoveryRequests()
          .filter((request) => request.requestedBy === requester)
          .map((request) => request.itemId),
  );

  function requestRecovery(item: Item) {
    addRecoveryRequest({
      id: `${item.id}-${requester}`,
      itemId: item.id,
      title: item.title,
      category: item.category,
      location: item.location,
      requestedBy: requester,
      requestedAt: "Submitted",
      status: "Pending",
    });

    setRequestedItemIds((currentIds) =>
      currentIds.includes(item.id) ? currentIds : [...currentIds, item.id],
    );
  }

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar role={role} userName={userName} />

      <section className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Recover Item
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Select an item to request recovery. Managers can review submitted
            requests from Recovered Items.
          </p>
        </div>

        {foundItems.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-sm text-gray-600 shadow-sm">
            No found items are available for recovery requests.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {foundItems.map((item) => {
            const isRequested = requestedItemIds.includes(item.id);

            return (
              <article
                key={item.id}
                className="rounded-lg bg-white p-5 shadow-sm"
              >
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
                <p className="mt-4 text-sm text-gray-700">
                  {item.description}
                </p>
                <button
                  type="button"
                  onClick={() => requestRecovery(item)}
                  disabled={isRequested}
                  className="mt-5 inline-flex rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {isRequested ? "Recovery requested" : "Request recovery"}
                </button>
              </article>
            );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
