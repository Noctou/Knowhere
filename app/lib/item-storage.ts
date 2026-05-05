import { Item } from "./items";

const STORAGE_KEY = "knowhere-items";
const RECOVERY_REQUESTS_KEY = "knowhere-recovery-requests";

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

export function loadStoredItems(): Item[] {
  const value = window.localStorage.getItem(STORAGE_KEY);

  if (!value) {
    return [];
  }

  try {
    return JSON.parse(value) as Item[];
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
