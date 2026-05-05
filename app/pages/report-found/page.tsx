import Sidebar from "@/app/components/sidebar/page";
import ReportFoundForm from "./report-found-form";

type Role = "student" | "admin";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getRole(value: string | string[] | undefined): Role {
  return value === "admin" ? "admin" : "student";
}

export default async function ReportFoundItem({ searchParams }: PageProps) {
  const params = await searchParams;
  const role = getRole(params.role);
  const userName = typeof params.user === "string" ? params.user : undefined;

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar role={role} userName={userName} />

      <section className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Report Found Item
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Post found item details so the owner can identify it.
          </p>
        </div>

        <ReportFoundForm role={role} userName={userName} />
      </section>
    </main>
  );
}
