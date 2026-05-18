"use client";

import { useMemo } from "react";
import { useState } from "react";
import FoundItemExpiration from "@/app/components/found-item-expiration";
import ItemSearchFilter from "@/app/components/search-bar/item-search-filter";
import Sidebar from "@/app/components/sidebar/page";
import StatusBadge from "@/app/components/status-badge";
import { Item, sampleItems } from "@/app/lib/items";
import {
  addRecoveryRequest,
  getActiveItems,
  loadRecoveryRequests,
  loadStoredItems,
  RecoveryRequest,
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
  const [recoveryRequests, setRecoveryRequests] = useState<RecoveryRequest[]>(
    () => (typeof window === "undefined" ? [] : loadRecoveryRequests()),
  );
  const [items] = useState<Item[]>(() =>
    typeof window === "undefined"
      ? sampleItems
      : getActiveItems([...sampleItems, ...loadStoredItems()], recoveryRequests),
  );
  const foundItems = useMemo(
    () => items.filter((item) => item.status === "Found"),
    [items],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = useMemo(
    () =>
      Array.from(
        new Set(foundItems.map((item) => item.category).filter(Boolean)),
      ).sort((first, second) => first.localeCompare(second)),
    [foundItems],
  );
  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return foundItems.filter((item) => {
      const matchesName =
        !normalizedSearch || item.title.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesName && matchesCategory;
    });
  }, [foundItems, searchTerm, selectedCategory]);
  const [requestedItemIds, setRequestedItemIds] = useState<number[]>(() =>
    typeof window === "undefined"
      ? []
      : recoveryRequests
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
    setRecoveryRequests(loadRecoveryRequests());

    setRequestedItemIds((currentIds) =>
      currentIds.includes(item.id) ? currentIds : [...currentIds, item.id],
    );
  }

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar role={role} userName={userName} />

      <section className="flex-1 p-6 pt-20 md:pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Recover Item
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Select an item to request recovery. Managers can review submitted
            requests from Recovered Items.
          </p>
        </div>

        <ItemSearchFilter
          categories={categories}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchTermChange={setSearchTerm}
          onSelectedCategoryChange={setSelectedCategory}
        />

        {foundItems.length === 0 ? (
          <div className="content-wrapper-fade rounded-lg bg-white p-6 text-sm text-gray-600 shadow-sm">
            No found items are available for recovery requests.
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="content-wrapper-fade rounded-lg bg-white p-6 text-sm text-gray-600 shadow-sm">
            No items match your search.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredItems.map((item, index) => {
              const isRequested = requestedItemIds.includes(item.id);

              return (
                <article
                  key={item.id}
                  className="content-wrapper-fade rounded-lg bg-white p-5 shadow-sm"
                  style={{ animationDelay: `${index * 60}ms` }}
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
                  <p className="mt-4 text-sm text-gray-700">
                    {item.description}
                  </p>
                  <FoundItemExpiration
                    item={item}
                    recoveryRequests={recoveryRequests}
                  />
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
