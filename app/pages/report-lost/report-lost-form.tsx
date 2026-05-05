"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { addStoredItem } from "@/app/lib/item-storage";

type ReportLostFormProps = {
  role: "student" | "admin";
  userName?: string;
};

export default function ReportLostForm({ role, userName }: ReportLostFormProps) {
  const router = useRouter();
  const query = `role=${role}${userName ? `&user=${encodeURIComponent(userName)}` : ""}`;

  function submitItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const dateTime = String(form.get("dateTime") || "");

    addStoredItem({
      id: Date.now(),
      title: String(form.get("title") || "Untitled item"),
      category: String(form.get("category") || "Uncategorized"),
      location: String(form.get("location") || "Unknown location"),
      date: dateTime ? dateTime.replace("T", " ") : new Date().toISOString().slice(0, 10),
      status: "Lost",
      postedBy: role === "admin" ? "Manager" : userName || "Student",
      description: String(form.get("description") || "No description provided."),
    });

    router.push(`/pages/search-browse?${query}`);
  }

  return (
    <form
      onSubmit={submitItem}
      className="max-w-2xl space-y-5 rounded-lg bg-white p-6 shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Item name
        </label>
        <input
          name="title"
          required
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
          placeholder="Example: Blue Hydro Flask"
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            name="category"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
            placeholder="Bottle, ID, electronics"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last seen location
          </label>
          <input
            name="location"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
            placeholder="Library, cafeteria, lab"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date and time lost
        </label>
        <input
          name="dateTime"
          type="datetime-local"
          required
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          rows={5}
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
          placeholder="Add color, marks, labels, or other identifying details."
        />
      </div>
      <button className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
        Post lost item
      </button>
    </form>
  );
}
