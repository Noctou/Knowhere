"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState("");

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");

    if (username === "admin") {
      if (password !== "123") {
        setLoginError("Invalid manager password.");
        return;
      }

      setLoginError("");
      router.push("/pages/search-browse?role=admin&user=admin");
      return;
    }

    const isStudentEmail = username.endsWith("@student.fatima.edu");
    const isFacultyEmail = username.endsWith("@fatima.edu");

    if (!isStudentEmail && !isFacultyEmail) {
      setLoginError(
        "Use @student.fatima.edu for students or @fatima.edu for faculty.",
      );
      return;
    }

    setLoginError("");
    const role = isStudentEmail ? "student" : "faculty";

    router.push(
      `/pages/search-browse?role=${role}&user=${encodeURIComponent(
        username.split("@")[0] || "student",
      )}`,
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
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Email or username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-400/10"
              placeholder="you@student.fatima.edu, you@fatima.edu, or admin"
            />
            {loginError ? (
              <p className="mt-2 text-sm text-red-600">{loginError}</p>
            ) : null}
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
