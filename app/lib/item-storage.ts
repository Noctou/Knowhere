import { Item } from "./items";

const STORAGE_KEY = "knowhere-items";
const RECOVERY_REQUESTS_KEY = "knowhere-recovery-requests";
const FOUND_ITEM_EXPIRATION_MONTHS = 6;

export type RecoveryRequest = {
  id: string;
  itemId: number;
  title: string;
  category: string;
  location: string;
  requestedBy: string;
  requestedAt: string;
  status: "Pending" | "Approved";
};

function parseItemDate(date: string) {
  const parsedDate = new Date(date.replace(" ", "T"));

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function getFoundItemExpirationDate(item: Item) {
  if (item.status !== "Found") {
    return null;
  }

  const itemDate = parseItemDate(item.date);

  if (!itemDate) {
    return null;
  }

  const expirationDate = new Date(itemDate);
  expirationDate.setMonth(
    expirationDate.getMonth() + FOUND_ITEM_EXPIRATION_MONTHS,
  );

  return expirationDate;
}

export function isExpiredFoundItem(
  item: Item,
  recoveryRequests: RecoveryRequest[],
  now = new Date(),
) {
  const expirationDate = getFoundItemExpirationDate(item);
  const hasRecoveryRequest = recoveryRequests.some(
    (request) => request.itemId === item.id,
  );

  return Boolean(
    item.status === "Found" &&
      expirationDate &&
      expirationDate <= now &&
      !hasRecoveryRequest,
  );
}

export function removeExpiredFoundItems(
  items: Item[],
  recoveryRequests: RecoveryRequest[],
) {
  return items.filter((item) => !isExpiredFoundItem(item, recoveryRequests));
}

export function applyApprovedRecoveryRequests(
  items: Item[],
  recoveryRequests: RecoveryRequest[],
) {
  const claimedItemIds = new Set(
    recoveryRequests
      .filter((request) => request.status === "Approved")
      .map((request) => request.itemId),
  );

  return items.map((item) =>
    claimedItemIds.has(item.id) ? { ...item, status: "Claimed" as const } : item,
  );
}

export function getActiveItems(items: Item[], recoveryRequests: RecoveryRequest[]) {
  return applyApprovedRecoveryRequests(
    removeExpiredFoundItems(items, recoveryRequests),
    recoveryRequests,
  );
}

export function loadStoredItems(): Item[] {
  const value = window.localStorage.getItem(STORAGE_KEY);

  if (!value) {
    return [];
  }

  try {
    const items = JSON.parse(value) as Item[];
    const activeItems = removeExpiredFoundItems(items, loadRecoveryRequests());

    if (activeItems.length !== items.length) {
      saveStoredItems(activeItems);
    }

    return activeItems;
  } catch {
    return [];
  }
}

export function saveStoredItems(items: Item[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addStoredItem(item: Item) {
  saveStoredItems([...loadStoredItems(), item]);
}

export function loadRecoveryRequests(): RecoveryRequest[] {
  const value = window.localStorage.getItem(RECOVERY_REQUESTS_KEY);

  if (!value) {
    return [];
  }

  try {
    return JSON.parse(value) as RecoveryRequest[];
  } catch {
    return [];
  }
}

export function saveRecoveryRequests(requests: RecoveryRequest[]) {
  window.localStorage.setItem(RECOVERY_REQUESTS_KEY, JSON.stringify(requests));
}

export function addRecoveryRequest(request: RecoveryRequest) {
  const currentRequests = loadRecoveryRequests();
  const existingRequest = currentRequests.find(
    (item) =>
      item.itemId === request.itemId && item.requestedBy === request.requestedBy,
  );

  if (existingRequest) {
    return;
  }

  saveRecoveryRequests([...currentRequests, request]);
}

export function claimStoredItem(itemId: number) {
  const updatedItems = loadStoredItems().map((item) =>
    item.id === itemId ? { ...item, status: "Claimed" as const } : item,
  );

  saveStoredItems(updatedItems);
}
