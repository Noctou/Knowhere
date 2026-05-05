"use client";

import Link from "next/link";
import { useState } from "react";
import Sidebar from "@/app/components/sidebar/page";
import {
  loadRecoveryRequests,
  RecoveryRequest,
  saveRecoveryRequests,
} from "@/app/lib/item-storage";

type RecoveredItemsClientProps = {
  role: "student" | "faculty" | "admin";
  userName?: string;
};

export default function RecoveredItemsClient({
  role,
  userName,
}: RecoveredItemsClientProps) {
  const [requests, setRequests] = useState<RecoveryRequest[]>(() =>
    typeof window === "undefined" ? [] : loadRecoveryRequests(),
  );

  function approveRequest(id: string) {
    setRequests((currentRequests) => {
      const updatedRequests = currentRequests.map((request) =>
        request.id === id ? { ...request, status: "Approved" as const } : request,
      );

      saveRecoveryRequests(updatedRequests);

      return updatedRequests;
    });
  }

  if (role !== "admin") {
    return (
      <main className="flex min-h-screen bg-gray-100">
        <Sidebar role={role} userName={userName} />
        <section className="flex-1 p-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">
              Manager Access Required
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Recovered item requests are reviewed by manager accounts.
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
          <h1 className="text-2xl font-semibold text-gray-900">
            Recovered Items
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Student recovery requests appear here as soon as they are submitted.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-sm text-gray-600 shadow-sm">
            No recovery requests yet.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-lg bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {request.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {request.category} - {request.location}
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {request.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                  <p>Requested by: {request.requestedBy}</p>
                  <p>Requested at: {request.requestedAt}</p>
                </div>

                <button
                  type="button"
                  onClick={() => approveRequest(request.id)}
                  disabled={request.status === "Approved"}
                  className="mt-5 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {request.status === "Approved"
                    ? "Approved"
                    : "Approve recovery"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
