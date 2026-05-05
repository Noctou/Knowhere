import ManagePostsClient from "./manage-posts-client";

type Role = "student" | "admin";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getRole(value: string | string[] | undefined): Role {
  return value === "admin" ? "admin" : "student";
}

export default async function ManagePostsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const userName = typeof params.user === "string" ? params.user : undefined;

  return <ManagePostsClient role={getRole(params.role)} userName={userName} />;
}
