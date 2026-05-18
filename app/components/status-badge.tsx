import { ItemStatus } from "@/app/lib/items";

type StatusBadgeProps = {
  status: ItemStatus;
};

const statusClasses: Record<ItemStatus, string> = {
  Lost: "bg-red-50 text-red-700 ring-red-200",
  Found: "bg-green-50 text-green-700 ring-green-200",
  Claimed: "bg-gray-100 text-gray-700 ring-gray-200",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}
