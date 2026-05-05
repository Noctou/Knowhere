"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const role = form.get("role") === "admin" ? "admin" : "student";
    const userName = email.split("@")[0] || "student";

    router.push(
      `/pages/search-browse?role=${role}&user=${encodeURIComponent(userName)}`,
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <section className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Knowhere</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage lost and found reports.
          </p>
        </div>

        <form onSubmit={signIn} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-400/10"
              placeholder="you@school.edu"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-400/10"
              placeholder="Enter your password"
            />
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-gray-700">
              Sign in as
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  defaultChecked
                  className="h-4 w-4"
                />
                Student
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700">
                <input type="radio" name="role" value="admin" className="h-4 w-4" />
                Manager
              </label>
            </div>
          </fieldset>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 rounded border-gray-300"
              />
              Remember me
            </label>
            <Link
              href="/pages/campus-login"
              className="font-medium text-gray-900 hover:underline"
            >
              Campus login
            </Link>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
