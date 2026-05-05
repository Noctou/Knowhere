import { redirect } from "next/navigation";
import RecoverItemClient from "./recover-item-client";

type Role = "student" | "faculty" | "admin";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getRole(value: string | string[] | undefined): Role {
  return value === "admin" || value === "faculty" ? value : "student";
}

export default async function RecoverItemPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const role = getRole(params.role);
  const userName = typeof params.user === "string" ? params.user : undefined;

  if (role === "admin") {
    redirect(`/pages/search-browse?role=admin${userName ? `&user=${encodeURIComponent(userName)}` : ""}`);
  }

  return <RecoverItemClient role={role} userName={userName} />;
}
