import type { ItemStatus } from "@/db/schema";

export type PlaceholderWantRow = {
  id: string;
  name: string;
  price: number;
  currency: string;
  status: ItemStatus;
  notifyAtMs: number;
  decidedAtMs?: number;
};

const now = Date.now();

/** Waiting wants ordered by `notifyAt` ascending (PRD home upcoming). Includes one expired row. */
export const PLACEHOLDER_UPCOMING_WANTS: PlaceholderWantRow[] = [
  {
    id: "want-expired-demo",
    name: "Wireless headphones",
    price: 299,
    currency: "USD",
    status: "waiting",
    notifyAtMs: now - 2 * 60 * 60 * 1000,
  },
  {
    id: "want-upcoming-a",
    name: "Coffee maker",
    price: 89,
    currency: "USD",
    status: "waiting",
    notifyAtMs: now + 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "want-upcoming-b",
    name: "Bookshelf",
    price: 180,
    currency: "USD",
    status: "waiting",
    notifyAtMs: now + 5 * 24 * 60 * 60 * 1000,
  },
];

/** Past rows for the All Wants placeholder screen only. */
export const PLACEHOLDER_PAST_WANTS: PlaceholderWantRow[] = [
  {
    id: "past-skip-1",
    name: "Desk lamp",
    price: 45,
    currency: "USD",
    status: "skipped",
    notifyAtMs: now - 10 * 24 * 60 * 60 * 1000,
    decidedAtMs: now - 9 * 24 * 60 * 60 * 1000,
  },
  {
    id: "past-bought-1",
    name: "Running shoes",
    price: 120,
    currency: "USD",
    status: "bought",
    notifyAtMs: now - 20 * 24 * 60 * 60 * 1000,
    decidedAtMs: now - 18 * 24 * 60 * 60 * 1000,
  },
];
