import SearchBrowseClient from "./search-browse-client";

type Role = "student" | "admin";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getRole(value: string | string[] | undefined): Role {
  return value === "admin" ? "admin" : "student";
}

export default async function SearchBrowsePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const userName = typeof params.user === "string" ? params.user : undefined;

  return <SearchBrowseClient role={getRole(params.role)} userName={userName} />;
}
