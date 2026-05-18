import { Item } from "@/app/lib/items";
import {
  getFoundItemExpirationDate,
  RecoveryRequest,
} from "@/app/lib/item-storage";

type FoundItemExpirationProps = {
  item: Item;
  recoveryRequests: RecoveryRequest[];
};

const dayInMilliseconds = 24 * 60 * 60 * 1000;

export default function FoundItemExpiration({
  item,
  recoveryRequests,
}: FoundItemExpirationProps) {
  const expirationDate = getFoundItemExpirationDate(item);
  const hasRecoveryRequest = recoveryRequests.some(
    (request) => request.itemId === item.id,
  );

  if (!expirationDate || item.status !== "Found") {
    return null;
  }

  if (hasRecoveryRequest) {
    return (
      <p className="mt-3 text-xs font-medium text-green-700">
        Recovery requested. Expiration paused.
      </p>
    );
  }

  const daysRemaining = Math.max(
    0,
    Math.ceil((expirationDate.getTime() - Date.now()) / dayInMilliseconds),
  );

  return (
    <p className="mt-3 text-xs font-medium text-gray-500">
      {daysRemaining === 0
        ? "Expires today"
        : `Expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`}
    </p>
  );
}
