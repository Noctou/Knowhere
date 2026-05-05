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
  const userName = typeof params.user === "string" ? params.user : undefined;

  return <RecoverItemClient role={getRole(params.role)} userName={userName} />;
}
