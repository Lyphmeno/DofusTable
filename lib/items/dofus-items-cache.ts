import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { DofusItem } from "@/lib/items/dofus-items";
import { normalizeItemSearchText } from "@/lib/items/dofus-items";

const dofusItemsPath = join(process.cwd(), "public", "data", "dofus-items.json");

let cachedItems: DofusItem[] | null = null;

const loadItems = () => {
  if (cachedItems) {
    return cachedItems;
  }

  try {
    cachedItems = JSON.parse(readFileSync(dofusItemsPath, "utf8")) as DofusItem[];
  } catch (error) {
    console.error("Unable to read local Dofus items cache", error);
    cachedItems = [];
  }

  return cachedItems;
};

export const findCachedDofusItem = (itemId: number | null, itemName: string) => {
  const items = loadItems();

  if (itemId !== null) {
    const itemById = items.find((item) => item.id === itemId);

    if (itemById) {
      return itemById;
    }
  }

  const normalizedItemName = normalizeItemSearchText(itemName);
  return items.find((item) => normalizeItemSearchText(item.name) === normalizedItemName) ?? null;
};
