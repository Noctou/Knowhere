import Link from "next/link";

export default function CampusLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <section className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Campus Login
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Continue through the standard Knowhere login while campus SSO is not
            connected.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/pages/login"
            className="block w-full rounded-md bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Go to login
          </Link>
          <Link
            href="/pages/search-browse?role=student"
            className="block w-full rounded-md border border-green-200 px-4 py-2.5 text-center text-sm font-semibold text-green-700 transition hover:bg-green-50"
          >
            Continue as student
          </Link>
        </div>
      </section>
    </main>
  );
}
